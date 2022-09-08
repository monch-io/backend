import * as trpc from "@trpc/server";
import { z } from "zod";
import { CreateMeal, Meal } from "../../types/meal";
import { MealSearchQuery } from "../../types/meal-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";
import { Context } from "../context";

export const mealsRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: CreateMeal,
    output: z.string(),
    resolve: async ({
      input,
      ctx: {
        daos: { mealDao },
      },
    }) => {
      return await mealDao.create(input);
    },
  })
  .query("search", {
    input: z.object({
      query: MealSearchQuery,
      pagination: Pagination,
    }),
    output: PaginatedResult(Meal),
    resolve: async ({
      input,
      ctx: {
        daos: { mealDao },
      },
    }) => {
      return await mealDao.search(input.query, input.pagination);
    },
  })
  .query("findById", {
    input: z.object({
      id: z.string(),
    }),
    output: Meal.nullable(),
    resolve: async ({
      input,
      ctx: {
        daos: { mealDao },
      },
    }) => {
      return await mealDao.findById(input.id);
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    output: z.void(),
    resolve: async ({
      input,
      ctx: {
        daos: { mealDao },
      },
    }) => {
      return await mealDao.delete(input.id);
    },
  });
