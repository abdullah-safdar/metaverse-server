import { Schema, model } from "mongoose";
import { LAND_ENUMS } from "../constants";

const landsSchema = new Schema(
  {
    ownerId: {
      type: Schema.Types.ObjectId,
    },
    landId: {
      type: Number,
    },
    type: {
      type: String,
      enum: {
        values: [LAND_ENUMS.RENTAL, LAND_ENUMS.FOOD, LAND_ENUMS.FUEL],
        message: "Invalid land type",
      },
    },

    // map nft functionality
    ownerAddress: {
      type: String,
      // required: true,
      index: true,
    },
    chainId: {
      type: Number,
      // required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export = model("Lands", landsSchema);
