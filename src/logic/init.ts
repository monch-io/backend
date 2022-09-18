import { Daos } from "../data/dao/all";
import { Logic } from "./all";
import { InventoryManager } from "./inventory-manager";
import { MealPlanner } from "./meal-planner";

export const makeLogicFromDaos = (daos: Daos): Logic => {
  const inventoryManager = new InventoryManager(
    daos.ingredientDao,
    daos.inventoryChangeDao,
    daos.inventoryEntryDao
  );
  const mealPlanner = new MealPlanner(
    daos.mealDao,
    daos.recipeDao,
    inventoryManager
  );
  return {
    inventoryManager,
    mealPlanner,
  };
};
