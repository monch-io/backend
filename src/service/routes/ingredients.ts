import * as trpc from "@trpc/server";
import { z } from "zod";
import {
  CreateIngredient,
  Ingredient,
  UpdateIngredient,
} from "../../types/ingredient";
import { IngredientSearchQuery } from "../../types/ingredient-search-query";
import { Pagination, PaginatedResult } from "../../types/pagination";
import { Context } from "../context";

export const ingredientsRouter = trpc
  .router<Context>()
  .mutation("create", {
    input: CreateIngredient,
    output: z.string(),
    resolve: async ({
      input,
      ctx: {
        daos: { ingredientDao },
      },
    }) => {
      return await ingredientDao.create(input);
    },
  })
  .query("search", {
    input: z.object({
      query: IngredientSearchQuery.optional(),
      pagination: Pagination.optional(),
    }),
    output: PaginatedResult(Ingredient),
    resolve: async ({
      input,
      ctx: {
        daos: { ingredientDao },
      },
    }) => {
      return await ingredientDao.search(input.query, input.pagination);
    },
  })
  .query("findById", {
    input: z.object({
      id: z.string(),
    }),
    output: Ingredient.nullable(),
    resolve: async ({
      input,
      ctx: {
        daos: { ingredientDao },
      },
    }) => {
      return await ingredientDao.findById(input.id);
    },
  })
  .mutation("update", {
    input: z.object({ id: z.string(), data: UpdateIngredient }),
    output: z.void(),
    resolve: async ({
      input,
      ctx: {
        daos: { ingredientDao },
      },
    }) => {
      return await ingredientDao.update(input.id, input.data);
    },
  })
  .mutation("delete", {
    input: z.object({ id: z.string() }),
    output: z.void(),
    resolve: async ({
      input,
      ctx: {
        daos: { ingredientDao },
      },
    }) => {
      return await ingredientDao.delete(input.id);
    },
  });
