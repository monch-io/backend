import { z } from "zod";
import { Ingredient } from "./ingredient";
import { Unit } from "./quantity-type";

export const QuantifiedIngredient = z.object({
  ingredient: Ingredient,
  quantity: z.number().positive(),
  unit: Unit,
});

export const QuantifiedIngredientRef = z.object({
  ingredientId: z.string(),
  quantity: z.number().positive(),
  unit: Unit,
});