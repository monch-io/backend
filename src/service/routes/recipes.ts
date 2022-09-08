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
import { Context } from "../context";

export const recipesRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: CreateRecipe,
    output: z.string(),
    resolve: async ({
      input,
      ctx: {
        daos: { recipeDao },
      },
    }) => {
      return await recipeDao.create(input);
    },
  })
  .query("search", {
    input: z.object({
      query: RecipeSearchQuery,
      pagination: Pagination,
    }),
    output: PaginatedResult(RecipeWithoutIngredients),
    resolve: async ({
      input,
      ctx: {
        daos: { recipeDao },
      },
    }) => {
      return await recipeDao.search(input.query, input.pagination);
    },
  })
  .query("findById", {
    input: z.object({
      id: z.string(),
    }),
    output: Recipe.nullable(),
    resolve: async ({
      input,
      ctx: {
        daos: { recipeDao },
      },
    }) => {
      return await recipeDao.findById(input.id);
    },
  })
  .query("findByIdWithoutIngredients", {
    input: z.object({
      id: z.string(),
    }),
    output: RecipeWithoutIngredients.nullable(),
    resolve: async ({
      input,
      ctx: {
        daos: { recipeDao },
      },
    }) => {
      return await recipeDao.findByIdWithoutIngredients(input.id);
    },
  })
  .mutation("update", {
    input: z.object({ id: z.string(), data: UpdateRecipe }),
    output: z.void(),
    resolve: async ({
      input,
      ctx: {
        daos: { recipeDao },
      },
    }) => {
      return await recipeDao.update(input.id, input.data);
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    output: z.void(),
    resolve: async ({
      input,
      ctx: {
        daos: { recipeDao },
      },
    }) => {
      return await recipeDao.delete(input.id);
    },
  });
