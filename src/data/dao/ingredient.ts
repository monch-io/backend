import {
  CreateIngredient,
  Ingredient,
  UpdateIngredient,
} from "../../types/ingredient";
import { IngredientSearchQuery } from "../../types/ingredient-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";

export interface IngredientDao {
  create: (ingredient: CreateIngredient) => Promise<string>;
  search: (
    query?: IngredientSearchQuery,
    pagination?: Pagination
  ) => Promise<PaginatedResult<Ingredient>>;
  findById: (id: string) => Promise<Ingredient | null>;

  update: (id: string, data: UpdateIngredient) => Promise<void>;
  delete: (id: string) => Promise<void>;
}
