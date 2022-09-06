import { z } from "zod";
import {
  QuantifiedIngredient,
  QuantifiedIngredientRef,
} from "./quantified-ingredient";

export const RecipeWithoutIngredients = z.object({
  id: z.string(),
  name: z.string().min(1),
  description: z.string().optional(),
  tags: z.string().array(),
});
export interface RecipeWithoutIngredients
  extends z.infer<typeof RecipeWithoutIngredients> {}

export const Recipe = RecipeWithoutIngredients.extend({
  ingredients: QuantifiedIngredientRef.array(),
});
export interface Recipe extends z.infer<typeof Recipe> {}

export const RecipeWithIngredientDetails = RecipeWithoutIngredients.extend({
  ingredients: QuantifiedIngredient.array(),
});
export interface RecipeWithIngredientDetails
  extends z.infer<typeof RecipeWithIngredientDetails> {}

export const CreateRecipe = Recipe.omit({ id: true });
export interface CreateRecipe extends z.infer<typeof CreateRecipe> {}

export const UpdateRecipe = CreateRecipe.extend({});
export interface UpdateRecipe extends z.infer<typeof UpdateRecipe> {}
