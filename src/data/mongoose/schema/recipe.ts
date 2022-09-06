import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { QuantifiedIngredientClass } from "./quantified-ingredient";

export class RecipeClass {
  @prop({ required: true })
  name!: string;

  @prop()
  description?: string;

  @prop({ type: String, required: true })
  tags!: mongoose.Types.Array<string>;

  @prop({ type: QuantifiedIngredientClass, required: true })
  ingredients!: mongoose.Types.Array<QuantifiedIngredientClass>;
}

export const getRecipeModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(RecipeClass, { existingConnection });
