import { InventoryManager } from "./inventory-manager";
import { MealPlanner } from "./meal-planner";

export interface Logic {
  inventoryManager: InventoryManager;
  mealPlanner: MealPlanner;
}
