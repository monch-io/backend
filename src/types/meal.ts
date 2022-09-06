import { z } from "zod";

export const Meal = z.object({
  id: z.string(),
  date: z.date(),
  recipeId: z.string(),
});
export interface Meal extends z.infer<typeof Meal> {}

export const CreateMeal = z.object({
  date: z.date(),
  recipeId: z.string(),
});
export interface CreateMeal extends z.infer<typeof CreateMeal> {}
