import { z } from "zod";
import {
  QuantifiedIngredient,
  QuantifiedIngredientRef,
} from "./quantified-ingredient";

export const Inventory = z.object({
  entriesByIngredientId: z.record(z.string(), QuantifiedIngredientRef),
});
export interface Inventory extends z.infer<typeof Inventory> {}

export const InventoryWithDetails = z.object({
  entriesByIngredientId: z.record(z.string(), QuantifiedIngredient),
});
export interface InventoryWithDetails
  extends z.infer<typeof InventoryWithDetails> {}
