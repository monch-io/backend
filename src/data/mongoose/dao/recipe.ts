import mongoose from "mongoose";
import { Recipe } from "../../../types/recipe";
import { assertConforms, todo } from "../../../utils/assertions";
import { RecipeDao } from "../../dao/recipe";
import { getRecipeModel, RecipeClass } from "../schema/recipe";

const mongoRecipeToRecipeDto = (mongooseRecipe: RecipeClass): Recipe =>
  assertConforms(Recipe, {
    id: mongooseRecipe._id.toString(),
    name: mongooseRecipe.name,
    description: mongooseRecipe.description,
    tags: mongooseRecipe.tags,
    ingredients: mongooseRecipe.ingredients.map((quantifiedIngredient) => ({
      ingredientId: quantifiedIngredient.ingredientId.toString(),
      quantity: quantifiedIngredient.quantity,
    })),
  });

export const makeMongooseRecipeDao = (
  connection: mongoose.Connection
): RecipeDao => {
  const RecipeModel = getRecipeModel(connection);

  return {
    create: async (recipe) => {
      const createdRecipe = await RecipeModel.create({
        name: recipe.name,
        description: recipe.description,
        tags: recipe.tags,
        ingredients: recipe.ingredients.map((quantifiedIngredient) => ({
          ingredientId: quantifiedIngredient.ingredientId,
          quantity: quantifiedIngredient.quantity,
        })),
      });
      return createdRecipe._id.toString();
    },
    search: async (query, pagination) => {
      const mongoQuery = {
        ...(query.text && { $text: { $search: query.text } }),
        tags: { $in: query.tags },
      };

      const items = await RecipeModel.find(mongoQuery)
        .skip(pagination.skip)
        .limit(pagination.take)
        .lean();
      const total = await RecipeModel.countDocuments(mongoQuery);

      return {
        items: items.map(mongoRecipeToRecipeDto),
        total,
      };
    },
    findById: async (id) => {
      return todo(id);
    },
    findByIdWithoutIngredients: async (id) => {
      return todo(id);
    },
    update: async (id, recipe) => {
      return todo(id, recipe);
    },
    delete: async (id) => {
      return todo(id);
    },
  };
};
