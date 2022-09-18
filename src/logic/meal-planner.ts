import { MealDao } from "../data/dao/meal";
import { RecipeDao } from "../data/dao/recipe";
import { MealWithoutId } from "../types/meal";
import { MealPlan, MealPlanWithIngredientsNeeded } from "../types/meal-plan";
import { INFINITE_PAGINATION } from "../types/pagination";
import { QuantifiedIngredientRef } from "../types/quantified-ingredient";
import { Quantity } from "../types/quantity";
import { Recipe } from "../types/recipe";
import { assert } from "../utils/assertions";
import { LOG } from "../utils/log";
import { DomainException } from "./domain-exception";
import { InventoryManager } from "./inventory-manager";
import { addQuantities, makeQuantity, ZERO_QUANTITY } from "./quantities";

interface IngredientUsage {
  existingQuantityUsed: Quantity;
  quantityToPurchase: Quantity;
}

/**
 * Contains functionality related to meal plan generation.
 */
export class MealPlanner {
  constructor(
    private readonly mealDao: MealDao,
    private readonly recipeDao: RecipeDao,
    private readonly inventoryManager: InventoryManager
  ) {}

  /**
   * Make a meal plan for the given dates
   *
   * Currently, the meal generation strategy is quite simple:
   *
   * - Available recipes are shuffled to add some noise
   * - Recipes are sorted by their cumulative ingredient usage from inventory.
   * - Recipes that use more of the existing inventory are ranked higher.
   * - The first N recipes are selected for N dates given.
   *
   * The created meal plan also lists all ingredients that need to be purchased
   * for all the planned meals.
   */
  makeMealPlan = async (
    mealDates: Date[]
  ): Promise<MealPlanWithIngredientsNeeded> => {
    const inventory = new Map(
      Object.entries(
        (await this.inventoryManager.getInventory()).entriesByIngredientId
      )
    );

    let potentialRecipes = await this.recipeDao
      .search({}, INFINITE_PAGINATION)
      .then(({ items }) => items);

    // Map from recipeId to cumulative ingredient usage
    const recipeCumulativeIngredientUsage = new Map<string, number>();
    const ingredientsNeededByRecipeId = new Map<
      string,
      Map<string, Quantity>
    >();
    for (const recipe of potentialRecipes) {
      const recipeWithIngredients = await this.recipeDao.findById(recipe.id);
      assert(recipeWithIngredients !== null);
      const ingredientUsage = this.calculateIngredientUsageForRecipe(
        inventory,
        recipeWithIngredients
      );

      // Calculate cumulative ingredient usage
      recipeCumulativeIngredientUsage.set(
        recipe.id,
        this.calculateCumulativeIngredientUsage(ingredientUsage)
      );

      // Set ingredients needed
      ingredientsNeededByRecipeId.set(
        recipe.id,
        new Map(
          Array.from(ingredientUsage.entries()).map(([id, usage]) => [
            id,
            usage.quantityToPurchase,
          ])
        )
      );
    }

    // First shuffle recipes to add some noise
    potentialRecipes = potentialRecipes
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);

    // Sort recipes descending by cumulative ingredient usage
    potentialRecipes.sort(
      (a, b) =>
        (recipeCumulativeIngredientUsage.get(b.id) ?? 0) -
        (recipeCumulativeIngredientUsage.get(a.id) ?? 0)
    );

    // Ensure we have enough recipes
    if (potentialRecipes.length < mealDates.length) {
      throw new DomainException(
        "Not enough recipes found to make a meal plan",
        "PRECONDITION_FAILED"
      );
    }

    // Now we just pick the first n recipes mapped to the dates:
    const plan = mealDates.map((date, i): MealWithoutId => {
      const recipeId = potentialRecipes[i]?.id;
      assert(typeof recipeId !== "undefined");
      return { date, recipeId };
    });

    // Get the ingredients that are needed to be purchased
    const ingredientsNeeded = new Map<string, Quantity>();
    for (const recipe of potentialRecipes.slice(0, mealDates.length)) {
      const ingredientsForRecipe =
        ingredientsNeededByRecipeId.get(recipe.id) ??
        new Map<string, Quantity>();
      for (const [ingredientId, quantity] of ingredientsForRecipe.entries()) {
        ingredientsNeeded.set(
          ingredientId,
          addQuantities(
            ingredientsNeeded.get(ingredientId) ?? { value: 0 },
            quantity
          )
        );
      }
    }

    return {
      plan,
      ingredientsNeeded: Object.fromEntries(ingredientsNeeded.entries()),
    };
  };

  /**
   * Accept the given meals by saving them to the database.
   */
  acceptMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    // @@Todo: transaction
    for (const meal of mealPlan) {
      await this.mealDao.create(meal);
    }
  };

  private calculateIngredientUsageForRecipe = (
    inventory: Map<string, QuantifiedIngredientRef>,
    recipe: Recipe
  ): Map<string, IngredientUsage> => {
    // Keep track of how much of each ingredient we need to purchase and how
    // much we can use from inventory
    const existingIngredientsUtilised = new Map<string, Quantity>();
    const ingredientsToPurchase = new Map<string, Quantity>();

    for (const recipeQuantifiedIngredient of recipe.ingredients) {
      if (recipeQuantifiedIngredient.quantity.value === 0) {
        LOG.warn(
          `Found 0 quantity for ingredient with ID=${recipeQuantifiedIngredient.ingredientId} in recipe with ID=${recipe.id} during meal planning, skipping`
        );
        continue;
      }
      assert(typeof recipeQuantifiedIngredient.quantity.unit !== "undefined");

      const inventoryQuantifiedIngredient = inventory.get(
        recipeQuantifiedIngredient.ingredientId
      );
      if (typeof inventoryQuantifiedIngredient === "undefined") {
        // If not in inventory, we need to purchase all the stock
        ingredientsToPurchase.set(
          recipeQuantifiedIngredient.ingredientId,
          recipeQuantifiedIngredient.quantity
        );
        continue;
      }

      // Ensure quantity units match
      assert(
        inventoryQuantifiedIngredient.quantity.value === 0 ||
          inventoryQuantifiedIngredient.quantity.unit ===
            recipeQuantifiedIngredient.quantity.unit
      );

      const difference =
        inventoryQuantifiedIngredient.quantity.value -
        recipeQuantifiedIngredient.quantity.value;
      if (difference > 0) {
        // We have enough in inventory, so no need to purchase
        existingIngredientsUtilised.set(
          recipeQuantifiedIngredient.ingredientId,
          makeQuantity(difference, recipeQuantifiedIngredient.quantity.unit)
        );
      } else if (difference < 0) {
        const usedUp = inventoryQuantifiedIngredient.quantity.value;
        const extraNeeded = -difference;

        if (usedUp !== 0) {
          // Use up what we have in inventory
          existingIngredientsUtilised.set(
            recipeQuantifiedIngredient.ingredientId,
            makeQuantity(usedUp, recipeQuantifiedIngredient.quantity.unit)
          );
        }

        // Purchase the rest
        ingredientsToPurchase.set(
          recipeQuantifiedIngredient.ingredientId,
          makeQuantity(extraNeeded, recipeQuantifiedIngredient.quantity.unit)
        );
      }
    }

    return this.constructIngredientUsageMap(
      existingIngredientsUtilised,
      ingredientsToPurchase
    );
  };

  private constructIngredientUsageMap = (
    existingIngredientsUtilised: Map<string, Quantity>,
    ingredientsToPurchase: Map<string, Quantity>
  ): Map<string, IngredientUsage> => {
    return new Map(
      Array.from(
        // Keys are all the unique ingredients
        new Set([
          ...existingIngredientsUtilised.keys(),
          ...ingredientsToPurchase.keys(),
        ])
      ).map((ingredientId): [string, IngredientUsage] => {
        // Values are the quantity to purchase and the quantity to use from inventory
        return [
          ingredientId,
          {
            existingQuantityUsed:
              existingIngredientsUtilised.get(ingredientId) ?? ZERO_QUANTITY,
            quantityToPurchase:
              ingredientsToPurchase.get(ingredientId) ?? ZERO_QUANTITY,
          },
        ];
      })
    );
  };

  private calculateCumulativeIngredientUsage = (
    usage: Map<string, IngredientUsage>
  ): number => {
    // @@Refine: We can take into account units to have a better usage estimate.
    return Array.from(usage.values())
      .map((ingredientUsage) => ingredientUsage.existingQuantityUsed)
      .reduce((a, b) => a + b.value, 0);
  };
}
