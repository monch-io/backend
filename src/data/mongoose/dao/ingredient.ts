import mongoose from "mongoose";
import {
  CreateIngredient,
  Ingredient,
  UpdateIngredient,
} from "../../../types/ingredient";
import { IngredientSearchQuery } from "../../../types/ingredient-search-query";
import { Pagination, PaginatedResult } from "../../../types/pagination";
import { Dimension } from "../../../types/unit";
import { assertConforms } from "../../../utils/assertions";
import { mapNull } from "../../../utils/mapping";
import { IngredientDao } from "../../dao/ingredient";
import { getIngredientModel, IngredientClass } from "../schema/ingredient";
import { DaoHelper } from "./dao-helper";

const mongooseIngredientToIngredientDto = (
  mongooseIngredient: IngredientClass
) =>
  assertConforms(Ingredient, {
    id: mongooseIngredient._id.toString(),
    dimension: mongooseIngredient.dimension as Dimension,
    name: mongooseIngredient.name,
  });

const createIngredientDtoToMongooseCreateIngredient = (
  ingredient: CreateIngredient
) => ({
  dimension: ingredient.dimension,
  name: ingredient.name,
});

export class IngredientDaoMongoose implements IngredientDao {
  constructor(
    connection: mongoose.Connection,
    private readonly daoHelper = new DaoHelper(),
    private readonly IngredientModel = getIngredientModel(connection)
  ) {}

  create = async (ingredient: CreateIngredient): Promise<string> => {
    const createdIngredient = await this.IngredientModel.create(
      createIngredientDtoToMongooseCreateIngredient(ingredient)
    );
    return createdIngredient._id.toString();
  };

  search = async (
    query?: IngredientSearchQuery,
    pagination?: Pagination
  ): Promise<PaginatedResult<Ingredient>> => {
    const mongoQuery = {
      ...(query?.text && { $text: { $search: query.text } }),
    };

    return await this.daoHelper.paginateQuery({
      query: this.IngredientModel.find(mongoQuery),
      pagination,
      mapResult: mongooseIngredientToIngredientDto,
    });
  };

  findById = async (id: string): Promise<Ingredient | null> => {
    const result = await this.IngredientModel.findById(id).lean();
    return mapNull(result, mongooseIngredientToIngredientDto);
  };

  update = async (id: string, data: UpdateIngredient): Promise<void> => {
    await this.IngredientModel.findByIdAndUpdate(
      id,
      createIngredientDtoToMongooseCreateIngredient(data)
    );
  };

  delete = async (id: string): Promise<void> => {
    await this.IngredientModel.findByIdAndDelete(id);
  };
}
