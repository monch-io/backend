import { getModelForClass, prop, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { RecipeClass } from "./recipe";

export class MealClass {
  @prop({ required: true })
  date!: Date;

  @prop({ required: true, ref: () => RecipeClass })
  recipeId!: Ref<RecipeClass>;
}

export const getMealModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(MealClass, { existingConnection });
