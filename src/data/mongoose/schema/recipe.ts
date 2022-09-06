import { getModelForClass, index, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { QuantifiedIngredientClass } from "./quantified-ingredient";
import { WithId } from "./with-id";

@index({
  name: "text",
  description: "text",
  tags: "text",
})
export class RecipeClass extends WithId {
  @prop({ required: true })
  name!: string;

  @prop()
  description?: string;

  @prop({ type: String, required: true })
  tags!: string[];

  @prop({ type: QuantifiedIngredientClass, required: true })
  ingredients!: QuantifiedIngredientClass[];
}

export const getRecipeModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(RecipeClass, { existingConnection });
