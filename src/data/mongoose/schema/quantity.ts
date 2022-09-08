import { prop } from "@typegoose/typegoose";

export class QuantityClass {
  @prop({ required: true })
  value!: number;

  @prop({ required: true })
  unit!: string;
}
