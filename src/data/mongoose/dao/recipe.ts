import mongoose from "mongoose";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import { Unit } from "../../../types/unit";
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
import { DaoHelper } from "./dao-helper";
import { mapNull } from "../../../utils/mapping";

const mongooseRecipeToRecipeDtoWithoutIngredients = (
  mongooseRecipe: RecipeClass
): RecipeWithoutIngredients =>
  assertConforms(RecipeWithoutIngredients, {
    id: mongooseRecipe._id.toString(),
    name: mongooseRecipe.name,
    description: mongooseRecipe.description,
    tags: mongooseRecipe.tags,
  });

const mongooseRecipeToRecipeDto = (mongooseRecipe: RecipeClass): Recipe =>
  assertConforms(Recipe, {
    id: mongooseRecipe._id.toString(),
    name: mongooseRecipe.name,
    description: mongooseRecipe.description,
    tags: mongooseRecipe.tags,
    ingredients: mongooseRecipe.ingredients.map((quantifiedIngredient) => ({
      ingredientId: quantifiedIngredient.ingredientId.toString(),
      quantity: {
        value: quantifiedIngredient.quantity.value,
        unit: quantifiedIngredient.quantity.unit as Unit,
      },
    })),
  });

const createRecipeDtoToMongooseCreateRecipe = (recipe: CreateRecipe) => ({
  name: recipe.name,
  description: recipe.description,
  tags: recipe.tags,
  ingredients: recipe.ingredients.map((quantifiedIngredient) => ({
    ingredientId: quantifiedIngredient.ingredientId,
    quantity: {
      value: quantifiedIngredient.quantity.value,
      unit: quantifiedIngredient.quantity.unit,
    },
  })),
});

export class RecipeDaoMongoose implements RecipeDao {
  constructor(
    connection: mongoose.Connection,
    private readonly daoHelper = new DaoHelper(),
    private readonly RecipeModel = getRecipeModel(connection)
  ) {}

  create = async (recipe: CreateRecipe): Promise<string> => {
    const createdRecipe = await this.RecipeModel.create(
      createRecipeDtoToMongooseCreateRecipe(recipe)
    );
    return createdRecipe._id.toString();
  };

  search = async (
    query?: RecipeSearchQuery,
    pagination?: Pagination
  ): Promise<PaginatedResult<Recipe>> => {
    const mongoQuery = {
      ...(query?.text && { $text: { $search: query.text } }),
      ...(query?.tags && { tags: { $in: query.tags } }),
    };

    return await this.daoHelper.paginateQuery({
      query: this.RecipeModel.find(mongoQuery),
      pagination,
      mapResult: mongooseRecipeToRecipeDto,
    });
  };

  findById = async (id: string): Promise<Recipe | null> => {
    const result = await this.RecipeModel.findById(id).lean();
    return mapNull(result, mongooseRecipeToRecipeDto);
  };

  findByIdWithoutIngredients = async (
    id: string
  ): Promise<RecipeWithoutIngredients | null> => {
    const result = await this.RecipeModel.findById(id, {
      ingredients: false,
    }).lean();
    return mapNull(result, mongooseRecipeToRecipeDtoWithoutIngredients);
  };

  update = async (id: string, recipe: UpdateRecipe): Promise<void> => {
    await this.RecipeModel.findByIdAndUpdate(
      id,
      createRecipeDtoToMongooseCreateRecipe(recipe)
    );
  };

  delete = async (id: string): Promise<void> => {
    await this.RecipeModel.findByIdAndDelete(id);
  };
}
