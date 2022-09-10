import { assertConforms } from "../../../utils/assertions";
import {
  CreateInventoryChange,
  InventoryChange,
} from "../../../types/inventory-change";
import { InventoryChangeSearchQuery } from "../../../types/inventory-change-search-query";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import mongoose from "mongoose";
import {
  getInventoryChangeModel,
  InventoryChangeClass,
} from "../schema/inventory-change";
import { InventoryChangeDao } from "../../dao/inventory-change";
import { Unit } from "../../../types/unit";
import { DaoHelper } from "./dao-helper";
import { mapNull } from "../../../utils/mapping";
import { handleMongooseError } from "../errors";

const mongooseInventoryChangeToInventoryChangeDto = (
  mongooseInventoryChange: InventoryChangeClass
): InventoryChange =>
  assertConforms(InventoryChange, {
    id: mongooseInventoryChange._id.toString(),
    change: {
      ingredientId: mongooseInventoryChange.change.ingredientId.toString(),
      quantity: {
        unit: mongooseInventoryChange.change.quantity.unit as Unit,
        value: mongooseInventoryChange.change.quantity.value,
      },
    },
    timestamp: mongooseInventoryChange.timestamp,
  });

const createInventoryChangeDtoToMongooseCreateInventoryChange = (
  createInventoryChangeDto: CreateInventoryChange
) => ({
  change: {
    ingredientId: createInventoryChangeDto.change.ingredientId.toString(),
    quantity: {
      unit: createInventoryChangeDto.change.quantity.unit as Unit,
      value: createInventoryChangeDto.change.quantity.value,
    },
  },
  timestamp: createInventoryChangeDto.timestamp,
});

export class InventoryChangeDaoMongoose implements InventoryChangeDao {
  constructor(
    connection: mongoose.Connection,
    private readonly daoHelper: DaoHelper = new DaoHelper("inventory change"),
    private readonly InventoryChangeModel = getInventoryChangeModel(connection)
  ) {}

  create = (data: CreateInventoryChange): Promise<string> =>
    handleMongooseError(async () => {
      const createdInventoryChange = await this.InventoryChangeModel.create(
        createInventoryChangeDtoToMongooseCreateInventoryChange(data)
      );
      return createdInventoryChange._id.toString();
    });

  createMany = (data: CreateInventoryChange[]): Promise<string[]> =>
    handleMongooseError(async () => {
      const createdInventoryChange = await this.InventoryChangeModel.create(
        data.map(createInventoryChangeDtoToMongooseCreateInventoryChange)
      );
      return createdInventoryChange.map(({ _id }) => _id.toString());
    });

  search = (
    query?: InventoryChangeSearchQuery,
    pagination?: Pagination
  ): Promise<PaginatedResult<InventoryChange>> =>
    handleMongooseError(async () => {
      const mongoQuery = {
        ...(query?.dateRange && {
          date: { $gte: query.dateRange.from, $lte: query.dateRange.to },
        }),
        ...(query?.ingredientIds && {
          ingredientId: { $in: query.ingredientIds },
        }),
      };

      return await this.daoHelper.paginateQuery({
        query: this.InventoryChangeModel.find(mongoQuery),
        pagination,
        mapResult: mongooseInventoryChangeToInventoryChangeDto,
      });
    });

  findById = (id: string): Promise<InventoryChange | null> =>
    handleMongooseError(async () => {
      const result = await this.InventoryChangeModel.findById(id).lean();
      return mapNull(result, mongooseInventoryChangeToInventoryChangeDto);
    });

  delete = (id: string): Promise<void> =>
    handleMongooseError(async () => {
      await this.daoHelper.ensureFound(
        id,
        this.InventoryChangeModel.findByIdAndDelete(id)
      );
    });
}
