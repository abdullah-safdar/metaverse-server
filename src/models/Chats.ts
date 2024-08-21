import { Schema, model } from "mongoose";

const chatsSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export = model("Chats", chatsSchema);
