import { Schema, model } from "mongoose";

const conversationsSchema = new Schema(
  {
    participants: [Schema.Types.ObjectId],
  },
  {
    timestamps: true,
  }
);

export = model("Conversations", conversationsSchema);
