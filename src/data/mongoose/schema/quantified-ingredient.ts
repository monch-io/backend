import { prop, Ref } from "@typegoose/typegoose";
import { IngredientClass } from "./ingredient";

export class QuantifiedIngredientClass {
  @prop({ required: true, ref: () => IngredientClass })
  ingredientId!: Ref<IngredientClass>;

  @prop({ required: true })
  quantity!: number;
}
