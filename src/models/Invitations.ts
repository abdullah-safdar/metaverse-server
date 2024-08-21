import { Schema, model } from "mongoose";

let inventory_type_enum = ["pending", "accepted", "rejected"];

const enumValidator = (inventory_type: string) =>
  inventory_type_enum.includes(inventory_type);

const invitationsSchema = new Schema(
  {
    sentBy: {
      type: Schema.Types.ObjectId,
    },
    sentTo: {
      type: Schema.Types.ObjectId,
    },
    landId: {
      type: Number,
    },
    status: {
      type: String,
      enum: {
        values: ["pending", "accepted", "rejected"],
        message: "Invalid status",
      },
      default: "pending",
    },
    message: String,
  },
  {
    timestamps: true,
  }
);

export = model("Invitations", invitationsSchema);
