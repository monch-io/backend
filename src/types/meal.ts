import { z } from "zod";

export const Meal = z.object({
  id: z.string(),
  date: z.date(),
  recipeId: z.string(),
});
export interface Meal extends z.infer<typeof Meal> {}

export const MealWithoutId = z.object({
  date: z.date(),
  recipeId: z.string(),
});
export interface MealWithoutId extends z.infer<typeof MealWithoutId> {}

export const CreateMeal = MealWithoutId;
export interface CreateMeal extends z.infer<typeof CreateMeal> {}
