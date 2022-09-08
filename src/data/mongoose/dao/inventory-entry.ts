import { todo } from "../../../utils/assertions";
import {
  CreateInventoryEntry,
  InventoryEntry,
} from "../../../types/inventory-entry";
import { InventoryEntrySearchQuery } from "../../../types/inventory-entry-search-query";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import mongoose from "mongoose";
import { getInventoryEntryModel } from "../schema/inventory-entry";

export class InventoryEntryDaoMongoose {
  constructor(
    connection: mongoose.Connection,
    private readonly InventoryEntryModel = getInventoryEntryModel(connection)
  ) {}

  create = (data: CreateInventoryEntry): Promise<string> => {
    return todo(this.InventoryEntryModel, data);
  };
  search = (
    query: InventoryEntrySearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<InventoryEntry>> => {
    return todo(query, pagination);
  };
  findById = (id: string): Promise<InventoryEntry | null> => {
    return todo(id);
  };
  delete = (id: string): Promise<void> => {
    return todo(id);
  };
}
