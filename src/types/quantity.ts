import { z } from "zod";
import { Unit } from "./unit";

export const Quantity = z.union([
  z.object({
    value: z.literal(0),
    unit: Unit.optional(),
  }),
  z.object({
    value: z.number(),
    unit: Unit,
  }),
]);
export type Quantity = z.infer<typeof Quantity>;
