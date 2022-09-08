import {
  getModelForClass,
  index,
  modelOptions,
  prop,
} from "@typegoose/typegoose";
import mongoose from "mongoose";
import { WithId } from "./with-id";

@index({
  name: "text",
})
@modelOptions({ schemaOptions: { collection: "ingredients" } })
export class IngredientClass extends WithId {
  @prop({ required: true })
  name!: string;

  @prop({ required: true })
  dimension!: string;
}

export const getIngredientModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(IngredientClass, { existingConnection });
