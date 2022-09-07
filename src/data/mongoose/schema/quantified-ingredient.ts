import { prop, Ref } from "@typegoose/typegoose";
import mongoose from "mongoose";
import { Quantity } from "../../../types/quantity";
import { IngredientClass } from "./ingredient";

export class QuantifiedIngredientClass {
  @prop({ required: true, ref: () => IngredientClass })
  ingredientId!: Ref<IngredientClass, mongoose.Types.ObjectId>;

  @prop({ required: true })
  quantity!: Quantity;
}
