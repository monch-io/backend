import * as trpc from "@trpc/server";
import { z } from "zod";
import { Pagination } from "../../types/pagination";
import {
  CreateRecipe,
  Recipe,
  RecipeWithoutIngredients,
  UpdateRecipe,
} from "../../types/recipe";
import { PaginatedResult } from "../../types/pagination";
import { RecipeSearchQuery } from "../../types/recipe-search-query";
import { todo } from "../../utils/assertions";
import { Context } from "../context";

export const recipesRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: CreateRecipe,
    output: z.string(),
    resolve: () => todo(),
  })
  .query("search", {
    input: z.object({
      query: RecipeSearchQuery,
      pagination: Pagination,
    }),
    output: PaginatedResult(RecipeWithoutIngredients),
    resolve: () => todo(),
  })
  .query("findById", {
    input: z.object({
      id: z.string(),
    }),
    output: Recipe.nullable(),
    resolve: () => todo(),
  })
  .query("findByIdWithoutIngredients", {
    input: z.object({
      id: z.string(),
    }),
    output: RecipeWithoutIngredients.nullable(),
    resolve: () => todo(),
  })
  .mutation("update", {
    input: UpdateRecipe,
    output: z.void(),
    resolve: () => todo(),
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    output: z.void(),
    resolve: () => todo(),
  });
