import { z } from "zod";

export const InventoryEntrySearchQuery = z.object({
  ingredientIds: z.string().array().optional(),
});
export interface InventoryEntrySearchQuery
  extends z.infer<typeof InventoryEntrySearchQuery> {}
