import mongoose from "mongoose";
import { todo } from "../../../utils/assertions";
import { RecipeDao } from "../../dao/recipe";
import { getRecipeModel } from "../schema/recipe";

export const makeMongooseRecipeDao = (
  connection: mongoose.Connection
): RecipeDao => {
  const RecipeModel = getRecipeModel(connection);
  return todo(RecipeModel);
};
