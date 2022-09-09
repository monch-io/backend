import { CreateIngredient, Ingredient } from "../../types/ingredient";
import { IngredientSearchQuery } from "../../types/ingredient-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";

export interface IngredientDao {
  create: (ingredient: CreateIngredient) => Promise<string>;
  search: (
    query?: IngredientSearchQuery,
    pagination?: Pagination
  ) => Promise<PaginatedResult<Ingredient>>;
  findById: (id: string) => Promise<Ingredient | null>;
  delete: (id: string) => Promise<void>;
}
