import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
} from "@typegoose/typegoose";
import { QuantifiedIngredientClass } from "./quantified-ingredient";
import { WithId } from "./with-id";

@modelOptions({ schemaOptions: { collection: "inventoryEntries" } })
export class InventoryEntryClass extends WithId {
  @prop({ required: true })
  data!: QuantifiedIngredientClass;
}

export const getInventoryEntryModel = (
  existingConnection: mongoose.Connection
) => getModelForClass(InventoryEntryClass, { existingConnection });
