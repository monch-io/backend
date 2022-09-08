import { z } from "zod";
import { QuantifiedIngredientRef } from "./quantified-ingredient";

export const InventoryChange = z.object({
  id: z.string(),
  change: QuantifiedIngredientRef,
  timestamp: z.date(),
});
export interface InventoryChange extends z.infer<typeof InventoryChange> {}

export const CreateInventoryChange = z.object({
  change: QuantifiedIngredientRef,
  timestamp: z.date(),
});
export interface CreateInventoryChange
  extends z.infer<typeof CreateInventoryChange> {}
