import { z } from "zod";
import { Ingredient } from "./ingredient";
import { Quantity } from "./quantity";

export const QuantifiedIngredient = z.object({
  ingredient: Ingredient,
  quantity: Quantity,
});
export interface QuantifiedIngredient
  extends z.infer<typeof QuantifiedIngredient> {}

export const QuantifiedIngredientRef = z.object({
  ingredientId: z.string(),
  quantity: Quantity,
});
export interface QuantifiedIngredientRef
  extends z.infer<typeof QuantifiedIngredientRef> {}
