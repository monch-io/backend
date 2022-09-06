import { z } from "zod";
import { DateRange } from "./date-range";

export const MealSearchQuery = z.object({
  dateRange: DateRange.optional(),
  recipeIds: z.string().array().optional(),
});
export interface MealSearchQuery extends z.infer<typeof MealSearchQuery> {}
