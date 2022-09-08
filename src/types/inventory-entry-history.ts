import { z } from "zod";
import { QuantifiedIngredientRef } from "./quantified-ingredient";

export const InventoryEntryChange = z.object({
  id: z.string(),
  change: QuantifiedIngredientRef,
  timestamp: z.date(),
});
export interface InventoryEntryChange
  extends z.infer<typeof InventoryEntryChange> {}
