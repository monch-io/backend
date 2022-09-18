import { Quantity } from "../types/quantity";
import { Unit } from "../types/unit";
import { assert } from "../utils/assertions";

// Quantity of zero
export const ZERO_QUANTITY = { value: 0 } as const;

// Make a quantity from the given value and unit
export const makeQuantity = (value: number, unit: Unit): Quantity => {
  if (value === 0) {
    return ZERO_QUANTITY;
  }
  return { value, unit };
};

// Add the given quantities, which can be either positive or negative.
//
// If the units have different units, this will throw an assertion error.
export const addQuantities = (a: Quantity, b: Quantity): Quantity => {
  if (a.value === 0) {
    return b;
  } else if (b.value === 0) {
    return a;
  } else {
    assert(typeof a.unit !== "undefined" && a.unit === b.unit);
    return { value: a.value + b.value, unit: a.unit };
  }
};
