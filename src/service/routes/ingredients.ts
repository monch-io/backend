import * as trpc from "@trpc/server";
import { z } from "zod";
import { CreateIngredient, Ingredient } from "../../types/ingredient";
import { IngredientSearchQuery } from "../../types/ingredient-search-query";
import { Pagination, PaginatedResult } from "../../types/pagination";
import { todo } from "../../utils/assertions";
import { Context } from "../context";

export const ingredientsRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: CreateIngredient,
    output: z.string(),
    resolve: () => todo(),
  })
  .query("search", {
    input: z.object({
      query: IngredientSearchQuery,
      pagination: Pagination,
    }),
    output: PaginatedResult(Ingredient),
    resolve: () => todo(),
  })
  .query("findById", {
    input: z.object({
      id: z.string(),
    }),
    output: Ingredient.nullable(),
    resolve: () => todo(),
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    output: z.void(),
    resolve: () => todo(),
  });
