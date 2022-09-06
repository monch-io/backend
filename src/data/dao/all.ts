import { IngredientDao } from "./ingredient";
import { RecipeDao } from "./recipe";

export interface Daos {
  recipeDao: RecipeDao;
  ingredientDao: IngredientDao;
}
