import { MealDao } from "../data/dao/meal";
import { RecipeDao } from "../data/dao/recipe";
import { MealPlan } from "../types/meal-plan";
import { todo } from "../utils/assertions";
import { InventoryManager } from "./inventory-manager";

export class MealPlanner {
  constructor(
    private readonly mealDao: MealDao,
    private readonly recipeDao: RecipeDao,
    private readonly inventoryManager: InventoryManager
  ) {}

  makeMealPlan = async (mealDates: Date[]): Promise<MealPlan> => {
    todo(this.mealDao, this.recipeDao, this.inventoryManager);
    return todo(mealDates);
  };
  acceptMealPlan = async (mealPlan: MealPlan): Promise<void> => {
    return todo(mealPlan);
  };
}
