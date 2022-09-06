import { z } from "zod";
import { Ingredient } from "./ingredient";

export const QuantifiedIngredient = z.object({
  ingredient: Ingredient,
  quantity: z.number().positive(),
});

export const QuantifiedIngredientRef = z.object({
  ingredientId: z.string(),
  quantity: z.number().positive(),
});
