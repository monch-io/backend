import * as trpc from "@trpc/server";
import { z } from "zod";
import { CreateMeal, Meal } from "../../types/meal";
import { MealSearchQuery } from "../../types/meal-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";
import { todo } from "../../utils/assertions";
import { Context } from "../context";

export const mealsRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: CreateMeal,
    output: z.string(),
    resolve: () => todo(),
  })
  .query("search", {
    input: z.object({
      query: MealSearchQuery,
      pagination: Pagination,
    }),
    output: PaginatedResult(Meal),
    resolve: () => todo(),
  })
  .query("findById", {
    input: z.object({
      id: z.string(),
    }),
    output: Meal.nullable(),
    resolve: () => todo(),
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    output: z.void(),
    resolve: () => todo(),
  });
