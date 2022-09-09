import { Daos } from "../data/dao/all";
import { Logic } from "./all";
import { InventoryManager } from "./inventory-manager";

export const makeLogicFromDaos = (daos: Daos): Logic => {
  return {
    inventoryManager: new InventoryManager(
      daos.ingredientDao,
      daos.inventoryChangeDao,
      daos.inventoryEntryDao
    ),
  };
};
