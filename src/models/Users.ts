import { Schema, model, Types } from "mongoose";
import { validateEmail } from "../utils";

const usersSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      validate: [validateEmail, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 3000,
    },
    avatar: {
      type: String,
    },
    // map nfts
    ownedLands: [Number],
    walletAddress: {
      type: String,
      unique: true,
    },
    balance: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.index({ userName: "text" });

export = model("Users", usersSchema);
