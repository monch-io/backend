import { z } from "zod";
import { QuantifiedIngredientRef } from "./quantified-ingredient";

export const Inventory = z.object({
  entriesByIngredientId: z.map(z.string(), QuantifiedIngredientRef),
});
export interface Inventory extends z.infer<typeof Inventory> {}
