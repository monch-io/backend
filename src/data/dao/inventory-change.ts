import {
  CreateInventoryChange,
  InventoryChange,
} from "../../types/inventory-change";
import { InventoryChangeSearchQuery } from "../../types/inventory-change-search-query";
import { PaginatedResult, Pagination } from "../../types/pagination";

export interface InventoryChangeDao {
  create: (data: CreateInventoryChange) => Promise<string>;
  createMany: (data: CreateInventoryChange[]) => Promise<string[]>;
  search: (
    query?: InventoryChangeSearchQuery,
    pagination?: Pagination
  ) => Promise<PaginatedResult<InventoryChange>>;

  findById: (id: string) => Promise<InventoryChange | null>;
  delete: (id: string) => Promise<void>;
}
