import mongoose from "mongoose";
import { CreateMeal, Meal } from "../../../types/meal";
import { MealSearchQuery } from "../../../types/meal-search-query";
import { Pagination, PaginatedResult } from "../../../types/pagination";
import { todo } from "../../../utils/assertions";
import { MealDao } from "../../dao/meal";
import { getMealModel } from "../schema/meal";

export class MealDaoMongoose implements MealDao {
  constructor(
    connection: mongoose.Connection,
    private readonly MealModel = getMealModel(connection)
  ) {}

  create = (meal: CreateMeal): Promise<string> => {
    return todo(meal, this.MealModel);
  };

  search = (
    query: MealSearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<Meal>> => {
    return todo(query, pagination);
  };

  findById = (id: string): Promise<Meal | null> => {
    return todo(id);
  };

  delete = (id: string): Promise<void> => {
    return todo(id);
  };
}
