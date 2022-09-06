import mongoose from "mongoose";
import { todo } from "../../../utils/assertions";
import { IngredientDao } from "../../dao/ingredient";
import { getIngredientModel } from "../schema/ingredient";

export const makeMongooseIngredientDao = (
  connection: mongoose.Connection
): IngredientDao => {
  const IngredientModel = getIngredientModel(connection);

  return todo(IngredientModel);
};
