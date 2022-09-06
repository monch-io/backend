import { z } from "zod";

export const IngredientSearchQuery = z.object({
  text: z.string().optional(),
});
export interface IngredientSearchQuery
  extends z.infer<typeof IngredientSearchQuery> {}
