import * as trpc from "@trpc/server";
import { z } from "zod";
import { DateRange } from "../../types/date-range";
import { Inventory, InventoryWithDetails } from "../../types/inventory";
import { InventoryChange } from "../../types/inventory-change";
import { PaginatedResult, Pagination } from "../../types/pagination";
import { QuantifiedIngredientRef } from "../../types/quantified-ingredient";
import { Context } from "../context";

export const inventoryRouter = trpc
  .router<Context>()
  .query("getInventory", {
    input: z.object({}),
    output: Inventory,
    resolve: async ({
      ctx: {
        logic: { inventoryManager },
      },
    }) => {
      return await inventoryManager.getInventory();
    },
  })
  .query("getInventoryWithDetails", {
    input: z.object({}),
    output: InventoryWithDetails,
    resolve: async ({
      ctx: {
        logic: { inventoryManager },
      },
    }) => {
      return await inventoryManager.getInventoryWithDetails();
    },
  })
  .query("getQuantityForIngredient", {
    input: z.object({
      ingredientId: z.string(),
    }),
    output: QuantifiedIngredientRef,
    resolve: async ({
      ctx: {
        logic: { inventoryManager },
      },
      input: { ingredientId },
    }) => {
      return await inventoryManager.getQuantityForIngredient(ingredientId);
    },
  })
  .query("getInventoryHistory", {
    input: z.object({
      ingredientIds: z.string().array().optional(),
      dateRange: DateRange.optional(),
      pagination: Pagination.optional(),
    }),
    output: PaginatedResult(InventoryChange),
    resolve: async ({
      ctx: {
        logic: { inventoryManager },
      },
      input: { ingredientIds, dateRange, pagination },
    }) => {
      return await inventoryManager.getInventoryHistory(
        ingredientIds,
        dateRange,
        pagination
      );
    },
  })
  .mutation("updateInventory", {
    input: z.object({ changes: QuantifiedIngredientRef.array() }),
    output: z.void(),
    resolve: async ({
      ctx: {
        logic: { inventoryManager },
      },
      input: { changes },
    }) => {
      return await inventoryManager.updateInventory(changes);
    },
  })
  .mutation("setQuantityForIngredients", {
    input: z.object({ changes: QuantifiedIngredientRef.array() }),
    output: z.void(),
    resolve: async ({
      ctx: {
        logic: { inventoryManager },
      },
      input: { changes },
    }) => {
      return await inventoryManager.setQuantityForIngredients(changes);
    },
  });
