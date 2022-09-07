import mongoose from "mongoose";
import { CreateIngredient, Ingredient } from "../../../types/ingredient";
import { IngredientSearchQuery } from "../../../types/ingredient-search-query";
import { Pagination, PaginatedResult } from "../../../types/pagination";
import { todo } from "../../../utils/assertions";
import { IngredientDao } from "../../dao/ingredient";
import { getIngredientModel } from "../schema/ingredient";

export class IngredientDaoMongoose implements IngredientDao {
  constructor(
    connection: mongoose.Connection,
    private readonly IngredientModel = getIngredientModel(connection)
  ) {}

  create = (ingredient: CreateIngredient): Promise<string> => {
    return todo(ingredient, this.IngredientModel);
  };

  search = (
    query: IngredientSearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<Ingredient>> => {
    return todo(query, pagination);
  };

  findById = (id: string): Promise<Ingredient | null> => {
    return todo(id);
  };

  delete = (id: string): Promise<void> => {
    return todo(id);
  };
}
