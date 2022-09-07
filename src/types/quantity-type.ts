import { z } from "zod";

export const QuantityType = z.enum(["discrete", "continuous"]);
export type QuantityType = z.infer<typeof QuantityType>;

export const DiscreteUnit = z.enum(["unit"]);
export type DiscreteUnit = z.infer<typeof DiscreteUnit>;

export const ContinuousUnit = z.enum(["g", "kg", "l", "ml"]);
export type ContinuousUnit = z.infer<typeof ContinuousUnit>;

export const Unit = z.union([DiscreteUnit, ContinuousUnit]);
export type Unit = z.infer<typeof Unit>;
