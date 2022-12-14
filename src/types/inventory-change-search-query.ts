import { z } from "zod";
import { DateRange } from "./date-range";

export const InventoryChangeSearchQuery = z.object({
  ingredientIds: z.string().array().optional(),
  dateRange: DateRange.optional(),
});
export interface InventoryChangeSearchQuery
  extends z.infer<typeof InventoryChangeSearchQuery> {}
