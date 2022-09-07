import mongoose from "mongoose";

export class WithId {
  readonly id!: string;
  _id!: mongoose.Types.ObjectId;
}
