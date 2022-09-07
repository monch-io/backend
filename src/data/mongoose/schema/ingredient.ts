import { getModelForClass, index, prop } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { WithId } from "./with-id";

@index({
  name: "text",
})
export class IngredientClass extends WithId {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  dimension!: string;
}

export const getIngredientModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(IngredientClass, { existingConnection });
