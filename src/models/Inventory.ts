import { Schema, model } from "mongoose";

const itemSchema = new Schema(
  {
    itemKey: String,
  },
  { _id: false }
);

const inventorySchema = new Schema(
  {
    ownerId: Schema.Types.ObjectId,
    item: [itemSchema],
  },
  {
    timestamps: true,
  }
);

export = model("Inventory", inventorySchema);
