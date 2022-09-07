import mongoose from "mongoose";
import { CONFIG } from "../../utils/config";
import { LOG } from "../../utils/log";
import { Daos } from "../dao/all";
import { IngredientDaoMongoose } from "./dao/ingredient";
import { MealDaoMongoose } from "./dao/meal";
import { RecipeDaoMongoose } from "./dao/recipe";

export const setupDaosWithMongoose = async (): Promise<Daos> => {
  const { connection } = await mongoose.connect(CONFIG.MONGO_DB_URI);
  LOG.info(`Connected to MongoDB: ${CONFIG.MONGO_DB_URI}`);
  return {
    recipeDao: new RecipeDaoMongoose(connection),
    ingredientDao: new IngredientDaoMongoose(connection),
    mealDao: new MealDaoMongoose(connection),
  };
};
