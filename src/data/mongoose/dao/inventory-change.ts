import { todo } from "../../../utils/assertions";
import {
  CreateInventoryChange,
  InventoryChange,
} from "../../../types/inventory-change";
import { InventoryChangeSearchQuery } from "../../../types/inventory-change-search-query";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import mongoose from "mongoose";
import { getInventoryChangeModel } from "../schema/inventory-change";

export class InventoryChangeDaoMongoose {
  constructor(
    connection: mongoose.Connection,
    private readonly InventoryChangeModel = getInventoryChangeModel(connection)
  ) {}

  create = (data: CreateInventoryChange): Promise<string> => {
    return todo(this.InventoryChangeModel, data);
  };
  search = (
    query: InventoryChangeSearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<InventoryChange>> => {
    return todo(query, pagination);
  };
  findById = (id: string): Promise<InventoryChange | null> => {
    return todo(id);
  };
  delete = (id: string): Promise<void> => {
    return todo(id);
  };
}
