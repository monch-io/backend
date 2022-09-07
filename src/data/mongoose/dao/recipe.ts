import mongoose from "mongoose";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import {
  CreateRecipe,
  Recipe,
  RecipeWithoutIngredients,
  UpdateRecipe,
} from "../../../types/recipe";
import { RecipeSearchQuery } from "../../../types/recipe-search-query";
import { assertConforms } from "../../../utils/assertions";
import { RecipeDao } from "../../dao/recipe";
import { getRecipeModel, RecipeClass } from "../schema/recipe";

const mongoRecipeToRecipeDtoWithoutIngredients = (
  mongooseRecipe: RecipeClass
): RecipeWithoutIngredients =>
  assertConforms(RecipeWithoutIngredients, {
    id: mongooseRecipe._id.toString(),
    name: mongooseRecipe.name,
    description: mongooseRecipe.description,
    tags: mongooseRecipe.tags,
  });

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

export class RecipeDaoMongoose implements RecipeDao {
  constructor(
    connection: mongoose.Connection,
    private readonly RecipeModel = getRecipeModel(connection)
  ) {}

  create = async (recipe: CreateRecipe): Promise<string> => {
    const createdRecipe = await this.RecipeModel.create({
      name: recipe.name,
      description: recipe.description,
      tags: recipe.tags,
      ingredients: recipe.ingredients.map((quantifiedIngredient) => ({
        ingredientId: quantifiedIngredient.ingredientId,
        quantity: quantifiedIngredient.quantity,
      })),
    });
    return createdRecipe._id.toString();
  };

  search = async (
    query: RecipeSearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<Recipe>> => {
    const mongoQuery = {
      ...(query.text && { $text: { $search: query.text } }),
      tags: { $in: query.tags },
    };

    const items = await this.RecipeModel.find(mongoQuery)
      .skip(pagination.skip)
      .limit(pagination.take)
      .lean();
    const total = await this.RecipeModel.countDocuments(mongoQuery);

    return {
      items: items.map(mongoRecipeToRecipeDto),
      total,
    };
  };

  findById = async (id: string): Promise<Recipe | null> => {
    const result = await this.RecipeModel.findById(id).lean();
    if (result !== null) {
      return mongoRecipeToRecipeDto(result);
    } else {
      return null;
    }
  };

  findByIdWithoutIngredients = async (
    id: string
  ): Promise<RecipeWithoutIngredients | null> => {
    const result = await this.RecipeModel.findById(id, {
      ingredients: false,
    }).lean();
    if (result !== null) {
      return mongoRecipeToRecipeDtoWithoutIngredients(result);
    } else {
      return null;
    }
  };

  update = async (id: string, recipe: UpdateRecipe): Promise<void> => {
    await this.RecipeModel.findByIdAndUpdate(id, recipe);
  };

  delete = async (id: string): Promise<void> => {
    await this.RecipeModel.findByIdAndDelete(id);
  };
}
