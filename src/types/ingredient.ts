import { z } from "zod";
import { QuantityType } from "./quantity-type";

export const Ingredient = z.object({
  id: z.string(),
  name: z.string().min(1),
  quantityType: QuantityType,
});
export interface Ingredient extends z.infer<typeof Ingredient> {}

export const CreateIngredient = Ingredient.omit({ id: true });
export interface CreateIngredient extends z.infer<typeof CreateIngredient> {}
