import { IngredientDao } from "./ingredient";
import { MealDao } from "./meal";
import { RecipeDao } from "./recipe";

export interface Daos {
  recipeDao: RecipeDao;
  ingredientDao: IngredientDao;
  mealDao: MealDao;
}
