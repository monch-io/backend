import { getModelForClass, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";

export class IngredientClass {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  quantityType!: string;
}

export const getIngredientModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(IngredientClass, { existingConnection });
