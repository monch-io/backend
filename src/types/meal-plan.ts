import { z } from "zod";
import { MealWithoutId } from "./meal";
import { Quantity } from "./quantity";

export const MealPlan = z.array(MealWithoutId);
export interface MealPlan extends z.infer<typeof MealPlan> {}

export const MealPlanWithIngredientsNeeded = z.object({
  plan: MealPlan,
  ingredientsNeeded: z.record(z.string(), Quantity),
});
export interface MealPlanWithIngredientsNeeded
  extends z.infer<typeof MealPlanWithIngredientsNeeded> {}
