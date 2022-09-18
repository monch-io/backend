import { z } from "zod";
import { MealWithoutId } from "./meal";

export const MealPlan = z.array(MealWithoutId);
export interface MealPlan extends z.infer<typeof MealPlan> {}
