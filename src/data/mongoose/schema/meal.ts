import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import mongoose from "mongoose";
import { RecipeClass } from "./recipe";
import { WithId } from "./with-id";

@modelOptions({ schemaOptions: { collection: "Meal" } })
export class MealClass extends WithId {
  @prop({ required: true })
  date!: Date;

  @prop({ required: true, ref: () => RecipeClass })
  recipeId!: Ref<RecipeClass, mongoose.Types.ObjectId>;
}

export const getMealModel = (existingConnection: mongoose.Connection) =>
  getModelForClass(MealClass, { existingConnection });
