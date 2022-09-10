import { assertConforms } from "../../../utils/assertions";
import {
  CreateInventoryEntry,
  InventoryEntry,
  UpdateInventoryEntry,
} from "../../../types/inventory-entry";
import { InventoryEntrySearchQuery } from "../../../types/inventory-entry-search-query";
import { PaginatedResult, Pagination } from "../../../types/pagination";
import mongoose from "mongoose";
import {
  getInventoryEntryModel,
  InventoryEntryClass,
} from "../schema/inventory-entry";
import { InventoryEntryDao } from "../../dao/inventory-entry";
import { Unit } from "../../../types/unit";
import { DaoHelper } from "./dao-helper";
import { mapNull } from "../../../utils/mapping";

const mongooseInventoryEntryToInventoryEntryDto = (
  mongooseInventoryEntry: InventoryEntryClass
): InventoryEntry =>
  assertConforms(InventoryEntry, {
    id: mongooseInventoryEntry._id.toString(),
    data: {
      ingredientId: mongooseInventoryEntry.data.ingredientId._id.toString(),
      quantity: {
        unit: mongooseInventoryEntry.data.quantity.unit as Unit,
        value: mongooseInventoryEntry.data.quantity.value,
      },
    },
  });

const createInventoryEntryDtoToMongooseCreateInventoryEntry = (
  createInventoryEntryDto: CreateInventoryEntry
) => ({
  data: {
    ingredientId: createInventoryEntryDto.ingredientId.toString(),
    quantity: {
      unit: createInventoryEntryDto.quantity.unit,
      value: createInventoryEntryDto.quantity.value,
    },
  },
});

export class InventoryEntryDaoMongoose implements InventoryEntryDao {
  constructor(
    connection: mongoose.Connection,
    private readonly daoHelper: DaoHelper = new DaoHelper(),
    private readonly InventoryEntryModel = getInventoryEntryModel(connection)
  ) {}

  create = async (data: CreateInventoryEntry): Promise<string> => {
    const createdInventoryEntry = await this.InventoryEntryModel.create(
      createInventoryEntryDtoToMongooseCreateInventoryEntry(data)
    );
    return createdInventoryEntry._id.toString();
  };

  search = (
    query?: InventoryEntrySearchQuery,
    pagination?: Pagination
  ): Promise<PaginatedResult<InventoryEntry>> => {
    const mongoQuery = {
      ...(query?.ingredientIds && {
        "data.ingredientId": { $in: query.ingredientIds },
      }),
    };

    return this.daoHelper.paginateQuery({
      query: this.InventoryEntryModel.find(mongoQuery),
      pagination,
      mapResult: mongooseInventoryEntryToInventoryEntryDto,
    });
  };

  findById = async (id: string): Promise<InventoryEntry | null> => {
    const result = await this.InventoryEntryModel.findById(id).lean();
    return mapNull(result, mongooseInventoryEntryToInventoryEntryDto);
  };

  findByIngredientId = async (
    ingredientId: string
  ): Promise<InventoryEntry | null> => {
    const result = await this.InventoryEntryModel.findOne({
      "data.ingredientId": ingredientId,
    }).lean();
    return mapNull(result, mongooseInventoryEntryToInventoryEntryDto);
  };

  update = async (id: string, data: UpdateInventoryEntry): Promise<void> => {
    await this.InventoryEntryModel.updateOne(
      {
        _id: id,
      },
      createInventoryEntryDtoToMongooseCreateInventoryEntry(data)
    );
  };

  delete = async (id: string): Promise<void> => {
    await this.InventoryEntryModel.findByIdAndDelete(id);
  };
}
