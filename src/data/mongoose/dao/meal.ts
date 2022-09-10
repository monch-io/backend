import mongoose from "mongoose";
import { CreateMeal, Meal } from "../../../types/meal";
import { MealSearchQuery } from "../../../types/meal-search-query";
import { Pagination, PaginatedResult } from "../../../types/pagination";
import { assertConforms } from "../../../utils/assertions";
import { mapNull } from "../../../utils/mapping";
import { MealDao } from "../../dao/meal";
import { handleMongooseError } from "../errors";
import { getMealModel, MealClass } from "../schema/meal";
import { DaoHelper } from "./dao-helper";

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
    private readonly daoHelper: DaoHelper = new DaoHelper(),
    private readonly MealModel = getMealModel(connection)
  ) {}

  create = (meal: CreateMeal): Promise<string> =>
    handleMongooseError(async () => {
      const createdMeal = await this.MealModel.create(
        createMealDtoToMongooseCreateMeal(meal)
      );
      return createdMeal._id.toString();
    });

  search = (
    query?: MealSearchQuery,
    pagination?: Pagination
  ): Promise<PaginatedResult<Meal>> =>
    handleMongooseError(async () => {
      const mongoQuery = {
        ...(query?.dateRange && {
          date: { $gte: query.dateRange.from, $lte: query.dateRange.to },
        }),
        ...(query?.recipeIds && {
          recipeId: { $in: query.recipeIds },
        }),
      };

      return this.daoHelper.paginateQuery({
        query: this.MealModel.find(mongoQuery),
        pagination,
        mapResult: mongooseMealToMealDto,
      });
    });

  findById = (id: string): Promise<Meal | null> =>
    handleMongooseError(async () => {
      const result = await this.MealModel.findById(id).lean();
      return mapNull(result, mongooseMealToMealDto);
    });

  delete = (id: string): Promise<void> =>
    handleMongooseError(async () => {
      await this.MealModel.findByIdAndDelete(id);
    });
}
