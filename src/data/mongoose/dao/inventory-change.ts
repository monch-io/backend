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
    private readonly daoHelper: DaoHelper = new DaoHelper(),
    private readonly InventoryChangeModel = getInventoryChangeModel(connection)
  ) {}

  create = async (data: CreateInventoryChange): Promise<string> => {
    const createdInventoryChange = await this.InventoryChangeModel.create(
      createInventoryChangeDtoToMongooseCreateInventoryChange(data)
    );
    return createdInventoryChange._id.toString();
  };

  createMany = async (data: CreateInventoryChange[]): Promise<string[]> => {
    const createdInventoryChange = await this.InventoryChangeModel.create(
      data.map(createInventoryChangeDtoToMongooseCreateInventoryChange)
    );
    return createdInventoryChange.map(({ _id }) => _id.toString());
  };

  search = (
    query?: InventoryChangeSearchQuery,
    pagination?: Pagination
  ): Promise<PaginatedResult<InventoryChange>> => {
    const mongoQuery = {
      ...(query?.dateRange && {
        date: { $gte: query.dateRange.from, $lte: query.dateRange.to },
      }),
      ...(query?.ingredientIds && {
        ingredientId: { $in: query.ingredientIds },
      }),
    };

    return this.daoHelper.paginateQuery({
      query: this.InventoryChangeModel.find(mongoQuery),
      pagination,
      mapResult: mongooseInventoryChangeToInventoryChangeDto,
    });
  };
  findById = async (id: string): Promise<InventoryChange | null> => {
    const result = await this.InventoryChangeModel.findById(id).lean();
    return mapNull(result, mongooseInventoryChangeToInventoryChangeDto);
  };
  delete = async (id: string): Promise<void> => {
    await this.InventoryChangeModel.findByIdAndDelete(id);
  };
}
