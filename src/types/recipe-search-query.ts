import { z } from "zod";

export const RecipeSearchQuery = z.object({
  text: z.string().optional(),
  tags: z.string().array().optional(),
});
export interface RecipeSearchQuery extends z.infer<typeof RecipeSearchQuery> {}
