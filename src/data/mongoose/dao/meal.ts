import mongoose from "mongoose";
import { CreateMeal, Meal } from "../../../types/meal";
import { MealSearchQuery } from "../../../types/meal-search-query";
import { Pagination, PaginatedResult } from "../../../types/pagination";
import { assertConforms } from "../../../utils/assertions";
import { MealDao } from "../../dao/meal";
import { getMealModel, MealClass } from "../schema/meal";

const mongooseMealToMealDto = (mongooseMeal: MealClass) =>
  assertConforms(Meal, {
    id: mongooseMeal._id.toString(),
    date: mongooseMeal.date,
    recipeId: mongooseMeal.recipeId._id.toString(),
  });

const createMealDtoToMongooseCreateMeal = (meal: CreateMeal) => ({
  date: meal.date,
  recipeId: meal.recipeId,
});

export class MealDaoMongoose implements MealDao {
  constructor(
    connection: mongoose.Connection,
    private readonly MealModel = getMealModel(connection)
  ) {}

  create = async (meal: CreateMeal): Promise<string> => {
    const createdMeal = await this.MealModel.create(
      createMealDtoToMongooseCreateMeal(meal)
    );
    return createdMeal._id.toString();
  };

  search = async (
    query: MealSearchQuery,
    pagination: Pagination
  ): Promise<PaginatedResult<Meal>> => {
    const mongoQuery = {
      ...(query.dateRange && {
        date: { $gte: query.dateRange.from, $lte: query.dateRange.to },
      }),
      ...(query.recipeIds && {
        recipeId: { $in: query.recipeIds },
      }),
    };

    const items = await this.MealModel.find(mongoQuery)
      .skip(pagination.skip)
      .limit(pagination.take)
      .lean();
    const total = await this.MealModel.countDocuments(mongoQuery);

    return {
      items: items.map(mongooseMealToMealDto),
      total,
    };
  };

  findById = async (id: string): Promise<Meal | null> => {
    const result = await this.MealModel.findById(id).lean();
    if (result !== null) {
      return mongooseMealToMealDto(result);
    } else {
      return null;
    }
  };

  delete = async (id: string): Promise<void> => {
    await this.MealModel.findByIdAndDelete(id);
  };
}
