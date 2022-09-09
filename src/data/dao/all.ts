import { IngredientDao } from "./ingredient";
import { InventoryEntryDao } from "./inventory-entry";
import { MealDao } from "./meal";
import { RecipeDao } from "./recipe";

export interface Daos {
  recipeDao: RecipeDao;
  ingredientDao: IngredientDao;
  mealDao: MealDao;
  inventoryEntryDao: InventoryEntryDao;
}
