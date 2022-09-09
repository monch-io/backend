import { z } from "zod";
import { QuantifiedIngredientRef } from "./quantified-ingredient";

export const InventoryEntry = z.object({
  id: z.string(),
  data: QuantifiedIngredientRef,
});
export interface InventoryEntry extends z.infer<typeof InventoryEntry> {}

export const CreateInventoryEntry = QuantifiedIngredientRef;
export interface CreateInventoryEntry
  extends z.infer<typeof CreateInventoryEntry> {}
