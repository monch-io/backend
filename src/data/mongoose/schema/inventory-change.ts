import {
  getModelForClass,
  modelOptions,
  mongoose,
  prop,
} from "@typegoose/typegoose";
import { QuantifiedIngredientClass } from "./quantified-ingredient";
import { WithId } from "./with-id";

@modelOptions({ schemaOptions: { collection: "inventoryChanges" } })
export class InventoryChangeClass extends WithId {
  @prop({ required: true })
  change!: QuantifiedIngredientClass;

  @prop({ required: true })
  timestamp!: Date;
}

export const getInventoryChangeModel = (
  existingConnection: mongoose.Connection
) => getModelForClass(InventoryChangeClass, { existingConnection });
