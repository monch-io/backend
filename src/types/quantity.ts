import { z } from "zod";
import { Unit } from "./unit";

export const Quantity = z.object({
  value: z.number(),
  unit: Unit,
});
export interface Quantity extends z.infer<typeof Quantity> {}
