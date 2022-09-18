import { z } from "zod";

export const Dimension = z.enum(["amount", "weight", "volume"]);
export type Dimension = z.infer<typeof Dimension>;

export const AmountUnit = z.enum(["piece"]);
export type AmountUnit = z.infer<typeof AmountUnit>;

export const WeightUnit = z.enum(["kg"]);
export type WeightUnit = z.infer<typeof WeightUnit>;

export const VolumeUnit = z.enum(["l"]);
export type VolumeUnit = z.infer<typeof VolumeUnit>;

export const Unit = z.enum([
  ...AmountUnit.options,
  ...WeightUnit.options,
  ...VolumeUnit.options,
]);
export type Unit = z.infer<typeof Unit>;
