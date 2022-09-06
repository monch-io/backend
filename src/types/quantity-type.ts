import { z } from "zod";

export const QuantityType = z.enum(["discrete", "continuous"]);
export type QuantityType = z.infer<typeof QuantityType>;

export const DiscreteQuantity = z.enum(["unit"]);
export type DiscreteQuantity = z.infer<typeof DiscreteQuantity>;

export const ContinuousQuantity = z.enum(["g", "kg", "l", "ml"]);
export type ContinuousQuantity = z.infer<typeof ContinuousQuantity>;
