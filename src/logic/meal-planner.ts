import { MealDao } from "../data/dao/meal";
import { RecipeDao } from "../data/dao/recipe";
import { MealWithoutId } from "../types/meal";
import { MealPlan } from "../types/meal-plan";
import { INFINITE_PAGINATION } from "../types/pagination";
import { QuantifiedIngredientRef } from "../types/quantified-ingredient";
import { Recipe } from "../types/recipe";
import { assert, todo } from "../utils/assertions";
import { DomainException } from "./domain-exception";
import { InventoryManager } from "./inventory-manager";

interface IngredientUsage {
  existingQuantityUsed: number;
  quantityToPurchase: number;
}

export class MealPlanner {
  constructor(
    private readonly mealDao: MealDao,
    private readonly recipeDao: RecipeDao,
    private readonly inventoryManager: InventoryManager
  ) {}

  makeMealPlan = async (mealDates: Date[]): Promise<MealPlan> => {
    todo(this.mealDao, this.recipeDao, this.inventoryManager);
    const inventory = new Map(
      Object.entries(
        (await this.inventoryManager.getInventory()).entriesByIngredientId
      )
    );

    const potentialRecipes = await this.recipeDao
      .search({}, INFINITE_PAGINATION)
      .then(({ items }) => items);

    // Map from recipeId to cumulative ingredient usage
    const recipeCumulativeIngredientUsage = new Map<string, number>();
    for (const recipe of potentialRecipes) {
      const recipeWithIngredients = await this.recipeDao.findById(recipe.id);
      assert(recipeWithIngredients !== null);
      const ingredientUsage = this.calculateIngredientUsageForRecipe(
        inventory,
        recipeWithIngredients
      );
      recipeCumulativeIngredientUsage.set(
        recipe.id,
        this.cumulateIngredientUsage(ingredientUsage)
      );
    }

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
    return mealDates.map((date, i): MealWithoutId => {
      const recipeId = potentialRecipes[i]?.id;
      assert(typeof recipeId !== "undefined");
      return { date, recipeId };
    });
  };

  acceptMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    return todo(mealPlan);
  };

  private calculateIngredientUsageForRecipe = (
    inventory: Map<string, QuantifiedIngredientRef>,
    recipe: Recipe
  ): Map<string, IngredientUsage> => {
    // Keep track of how much of each ingredient we need to purchase and how
    // much we can use from inventory
    const existingIngredientsUtilised = new Map<string, number>();
    const ingredientsToPurchase = new Map<string, number>();

    for (const recipeQuantifiedIngredient of recipe.ingredients) {
      const inventoryQuantifiedIngredient = inventory.get(
        recipeQuantifiedIngredient.ingredientId
      );
      if (typeof inventoryQuantifiedIngredient === "undefined") {
        // If not in inventory, we need to purchase all the stock
        ingredientsToPurchase.set(
          recipeQuantifiedIngredient.ingredientId,
          recipeQuantifiedIngredient.quantity.value
        );
        continue;
      }

      // Ensure quantity units match
      assert(
        inventoryQuantifiedIngredient.quantity.value === 0 ||
          recipeQuantifiedIngredient.quantity.value === 0 ||
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
          difference
        );
      } else if (difference < 0) {
        const usedUp = inventoryQuantifiedIngredient.quantity.value;
        const extraNeeded = -difference;

        if (usedUp !== 0) {
          // Use up what we have in inventory
          existingIngredientsUtilised.set(
            recipeQuantifiedIngredient.ingredientId,
            usedUp
          );
        }

        // Purchase the rest
        ingredientsToPurchase.set(
          recipeQuantifiedIngredient.ingredientId,
          extraNeeded
        );
      }
    }

    return this.constructIngredientUsageMap(
      existingIngredientsUtilised,
      ingredientsToPurchase
    );
  };

  private constructIngredientUsageMap = (
    existingIngredientsUtilised: Map<string, number>,
    ingredientsToPurchase: Map<string, number>
  ): Map<string, IngredientUsage> => {
    return new Map(
      Array.from(
        new Set([
          ...existingIngredientsUtilised.keys(),
          ...ingredientsToPurchase.keys(),
        ])
      ).map((ingredientId): [string, IngredientUsage] => {
        return [
          ingredientId,
          {
            existingQuantityUsed:
              existingIngredientsUtilised.get(ingredientId) ?? 0,
            quantityToPurchase: ingredientsToPurchase.get(ingredientId) ?? 0,
          },
        ];
      })
    );
  };

  private cumulateIngredientUsage = (
    usage: Map<string, IngredientUsage>
  ): number => {
    // @@Refine: We can take into account units to have a better usage estimate.
    return Array.from(usage.values())
      .map((ingredientUsage) => ingredientUsage.existingQuantityUsed)
      .reduce((a, b) => a + b, 0);
  };
}
