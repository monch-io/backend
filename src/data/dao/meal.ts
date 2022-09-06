import { CreateMeal, Meal } from "../../types/meal";
import { MealSearchQuery } from "../../types/meal-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";

export interface MealDao {
  create: (meal: CreateMeal) => Promise<string>;
  search: (
    query: MealSearchQuery,
    pagination: Pagination
  ) => Promise<PaginatedResult<Meal>>;
  findById: (id: string) => Promise<Meal | null>;
  delete: (id: string) => Promise<void>;
}
