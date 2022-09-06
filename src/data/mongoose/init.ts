import mongoose from "mongoose";
import { CONFIG } from "../../utils/config";
import { Daos } from "../dao/all";
import { makeMongooseIngredientDao } from "./dao/ingredient";
import { makeMongooseMealDao } from "./dao/meal";
import { makeMongooseRecipeDao } from "./dao/recipe";

export const setupDaosWithMongoose = async (): Promise<Daos> => {
  const { connection } = await mongoose.connect(CONFIG.MONGO_DB_URI);
  return {
    recipeDao: makeMongooseRecipeDao(connection),
    ingredientDao: makeMongooseIngredientDao(connection),
    mealDao: makeMongooseMealDao(connection),
  };
};
