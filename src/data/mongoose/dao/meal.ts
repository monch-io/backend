import mongoose from "mongoose";
import { todo } from "../../../utils/assertions";
import { MealDao } from "../../dao/meal";
import { getMealModel } from "../schema/meal";

export const makeMongooseMealDao = (
  connection: mongoose.Connection
): MealDao => {
  const MealModel = getMealModel(connection);
  return todo(MealModel);
};
