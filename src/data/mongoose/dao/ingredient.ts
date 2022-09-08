import mongoose from "mongoose";
import { CreateIngredient, Ingredient } from "../../../types/ingredient";
import { IngredientSearchQuery } from "../../../types/ingredient-search-query";
import { Pagination, PaginatedResult } from "../../../types/pagination";
import { Dimension } from "../../../types/unit";
import { assertConforms } from "../../../utils/assertions";
import { IngredientDao } from "../../dao/ingredient";
import { getIngredientModel, IngredientClass } from "../schema/ingredient";

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
    private readonly IngredientModel = getIngredientModel(connection)
  ) {}

  create = async (ingredient: CreateIngredient): Promise<string> => {
    const createdIngredient = await this.IngredientModel.create(
      createIngredientDtoToMongooseCreateIngredient(ingredient)
    );
    return createdIngredient._id.toString();
  };

  search = async (
    query: IngredientSearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<Ingredient>> => {
    const mongoQuery = {
      ...(query.text && { $text: { $search: query.text } }),
    };

    const items = await this.IngredientModel.find(mongoQuery)
      .skip(pagination.skip)
      .limit(pagination.take)
      .lean();
    const total = await this.IngredientModel.countDocuments(mongoQuery);

    return {
      items: items.map(mongooseIngredientToIngredientDto),
      total,
    };
  };

  findById = async (id: string): Promise<Ingredient | null> => {
    const result = await this.IngredientModel.findById(id).lean();
    if (result !== null) {
      return mongooseIngredientToIngredientDto(result);
    } else {
      return null;
    }
  };

  delete = async (id: string): Promise<void> => {
    await this.IngredientModel.findByIdAndDelete(id);
  };
}
