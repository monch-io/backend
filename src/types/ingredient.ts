import { z } from "zod";
import { Dimension } from "./unit";

export const Ingredient = z.object({
  id: z.string(),
  name: z.string().min(1),
  dimension: Dimension,
});
export interface Ingredient extends z.infer<typeof Ingredient> {}

export const CreateIngredient = Ingredient.omit({ id: true });
export interface CreateIngredient extends z.infer<typeof CreateIngredient> {}

export const UpdateIngredient = CreateIngredient;
export interface UpdateIngredient extends z.infer<typeof UpdateIngredient> {}
