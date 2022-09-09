import {
  CreateInventoryEntry,
  InventoryEntry,
  UpdateInventoryEntry,
} from "../../types/inventory-entry";
import { InventoryEntrySearchQuery } from "../../types/inventory-entry-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";

export interface InventoryEntryDao {
  create: (data: CreateInventoryEntry) => Promise<string>;
  search: (
    query?: InventoryEntrySearchQuery,
    pagination?: Pagination
  ) => Promise<PaginatedResult<InventoryEntry>>;
  findById: (id: string) => Promise<InventoryEntry | null>;
  updateById: (id: string, data: UpdateInventoryEntry) => Promise<void>;
  findByIngredientId: (ingredientId: string) => Promise<InventoryEntry | null>;
  delete: (id: string) => Promise<void>;
}
