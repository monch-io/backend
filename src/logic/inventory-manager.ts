import { assert } from "console";
import { IngredientDao } from "../data/dao/ingredient";
import { InventoryChangeDao } from "../data/dao/inventory-change";
import { InventoryEntryDao } from "../data/dao/inventory-entry";
import { DateRange } from "../types/date-range";
import { Inventory } from "../types/inventory";
import { InventoryChange } from "../types/inventory-change";
import { InventoryEntry } from "../types/inventory-entry";
import { INFINITE_PAGINATION, PaginatedResult } from "../types/pagination";
import { QuantifiedIngredientRef } from "../types/quantified-ingredient";
import { Unit } from "../types/unit";
import { BadRequestException, NotFoundException } from "../utils/exceptions";
import { LOG } from "../utils/log";

type InventoryEntryOptionalId = Omit<InventoryEntry, "id"> & {
  id?: string | undefined;
};

// Contains functionality to interact with the inventory system.
export class InventoryManager {
  constructor(
    private readonly ingredientDao: IngredientDao,
    private readonly inventoryChangeDao: InventoryChangeDao,
    private readonly inventoryEntryDao: InventoryEntryDao
  ) {}

  // Get the current inventory, which is for each ingredient
  getInventory = async (): Promise<Inventory> => {
    const entriesByIngredientId = new Map();
    const inventoryEntries = await this.inventoryEntryDao.search(
      {},
      INFINITE_PAGINATION
    );

    for (const { data } of inventoryEntries.items) {
      if (entriesByIngredientId.has(data.ingredientId)) {
        LOG.warn(
          `Found ingredient with id=${data.ingredientId} in inventory twice! Results might be incorrect.`
        );
      }
      entriesByIngredientId.set(data.ingredientId, data.quantity);
    }

    return { entriesByIngredientId };
  };

  // Get the quantity of a specific ingredient in the inventory
  getQuantityForIngredient = async (
    ingredientId: string
  ): Promise<QuantifiedIngredientRef> => {
    if ((await this.ingredientDao.findById(ingredientId)) === null) {
      throw new NotFoundException(
        `Ingredient with id ${ingredientId} not found.`
      );
    }
    const ingredientQuantity = await this.inventoryEntryDao.findByIngredientId(
      ingredientId
    );

    if (ingredientQuantity === null) {
      return {
        ingredientId,
        quantity: { value: 0 },
      };
    }

    return ingredientQuantity.data;
  };

  // Update the quantity of a specific ingredient in the inventory.
  //
  // The quantity differences will be added/subtracted.
  updateInventory = async (
    changes: QuantifiedIngredientRef[]
  ): Promise<void> => {
    return await this.updateInventoryInMode(changes, "relative");
  };

  // Set the quantity of a series of ingredients in the inventory
  //
  // The quantities will be set to the provided values.
  setQuantityForIngredients = async (
    changes: QuantifiedIngredientRef[]
  ): Promise<void> => {
    return await this.updateInventoryInMode(changes, "absolute");
  };

  // Get the history of the current inventory in the form of inventory change entries.
  getInventoryHistory = async (
    ingredientIds?: string[],
    dateRange?: DateRange
  ): Promise<PaginatedResult<InventoryChange>> => {
    return await this.inventoryChangeDao.search({ ingredientIds, dateRange });
  };

  private updateInventoryInMode = async (
    changes: QuantifiedIngredientRef[],
    mode: "absolute" | "relative"
  ): Promise<void> => {
    // Get all the ingredient inventory indexed by ID
    const inventoryByIngredientId =
      await this.mapIngredientIdsToInventoryEntries(
        changes.map(({ ingredientId }) => ingredientId)
      );

    // Apply all the changes to the map
    for (const change of changes) {
      this.updateInventoryInMapForChange(inventoryByIngredientId, change, mode);
    }

    // Set changes in mongo for inventory and inventory changes
    await this.applyInventoryChangesToDb(changes, inventoryByIngredientId);
  };

  private mapIngredientIdsToInventoryEntries = async (
    ingredientIds: string[]
  ): Promise<Map<string, InventoryEntryOptionalId>> => {
    return await Promise.all(
      ingredientIds.map(async (ingredientId) => {
        const inventoryEntry = await this.inventoryEntryDao.findByIngredientId(
          ingredientId
        );
        type Ret = [string, InventoryEntryOptionalId];
        if (inventoryEntry === null) {
          return [
            ingredientId,
            {
              id: undefined,
              data: {
                ingredientId,
                quantity: { value: 0, unit: undefined },
              },
            },
          ] as Ret;
        }
        return [ingredientId, inventoryEntry] as Ret;
      })
    ).then((result) => new Map(result));
  };

  private updateInventoryInMapForChange = (
    inventoryByIngredientId: Map<string, InventoryEntryOptionalId>,
    change: QuantifiedIngredientRef,
    changeMode: "absolute" | "relative"
  ) => {
    const cannotLower = (ingredientId: string) =>
      new BadRequestException(
        `Cannot reduce the quantity for ingredient with id=${ingredientId} below 0.`
      );

    const inconsistentUnits = (
      requested: Unit,
      existing: Unit,
      ingredientId: string
    ) =>
      new BadRequestException(
        `Cannot change the quantity of ingredient with id=${ingredientId} in units of ${requested} because it is set to be measured in ${existing}.`
      );

    const inventoryEntry = inventoryByIngredientId.get(change.ingredientId);

    if (typeof inventoryEntry === "undefined") {
      if (change.quantity.value < 0) {
        throw cannotLower(change.ingredientId);
      }
      inventoryByIngredientId.set(change.ingredientId, {
        id: undefined,
        data: change,
      });
      return;
    }

    const { data } = inventoryEntry;
    if (
      typeof data.quantity.unit === "undefined" &&
      typeof change.quantity.unit === "undefined"
    ) {
      assert(data.quantity.value === 0);
      assert(change.quantity.value === 0);
      // We can skip this, no change occurs
      return;
    }

    // Ensure the units are the same
    if (
      typeof data.quantity.unit !== "undefined" &&
      typeof change.quantity.unit !== "undefined" &&
      data.quantity.unit !== change.quantity.unit
    ) {
      throw inconsistentUnits(
        change.quantity.unit,
        data.quantity.unit,
        change.ingredientId
      );
    }

    // Ensure new quantity is positive
    const newQuantity =
      changeMode === "relative"
        ? data.quantity.value + change.quantity.value
        : change.quantity.value;
    const newUnit = data.quantity.unit ?? change.quantity.unit;
    if (newQuantity < 0) {
      throw cannotLower(change.ingredientId);
    }

    // Early exit if both values are 0 and unit is undefined
    if (typeof newUnit === "undefined") {
      assert(change.quantity.value === 0);
      assert(data.quantity.value === 0);
      return;
    }

    // Set updated values
    inventoryByIngredientId.set(change.ingredientId, {
      id: inventoryEntry.id,
      data: {
        ...data,
        quantity: {
          value: newQuantity,
          unit: newUnit,
        },
      },
    });
  };

  private applyInventoryChangesToDb = async (
    changes: QuantifiedIngredientRef[],
    inventoryByIngredientId: Map<string, InventoryEntryOptionalId>
  ): Promise<void> => {
    // @@Todo: transaction
    await this.inventoryChangeDao.createMany(
      changes.map((change) => ({ change, timestamp: new Date() }))
    );
    for (const inventoryEntry of inventoryByIngredientId.values()) {
      if (typeof inventoryEntry.id === "undefined") {
        // Create the first inventory entry for this ingredient if it doesn't
        // exist.
        await this.inventoryEntryDao.create(inventoryEntry.data);
      } else {
        // Update existing entry otherwise.
        await this.inventoryEntryDao.updateById(
          inventoryEntry.id,
          inventoryEntry.data
        );
      }
    }
  };
}
