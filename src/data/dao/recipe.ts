import {
  CreateRecipe,
  Recipe,
  RecipeWithoutIngredients,
  UpdateRecipe,
} from "../../types/recipe";
import { PaginatedResult, Pagination } from "../../types/pagination";
import { RecipeSearchQuery } from "../../types/recipe-search-query";

export interface RecipeDao {
  create: (recipe: CreateRecipe) => Promise<string>;

  search: (
    query?: RecipeSearchQuery,
    pagination?: Pagination
  ) => Promise<PaginatedResult<RecipeWithoutIngredients>>;

  findById: (id: string) => Promise<Recipe | null>;
  findByIdWithoutIngredients: (
    id: string
  ) => Promise<RecipeWithoutIngredients | null>;

  update: (id: string, recipe: UpdateRecipe) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
