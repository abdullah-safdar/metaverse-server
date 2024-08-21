import { Schema, model } from "mongoose";
import { GAME_TYPE_ENUMS } from "../constants";

const gameSchema = new Schema(
  {
    uid: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    gameType: {
      type: String,
      enum: {
        values: [
          GAME_TYPE_ENUMS.BASKETBALL,
          GAME_TYPE_ENUMS.CHECKERS,
          GAME_TYPE_ENUMS.CHESS,
          GAME_TYPE_ENUMS.DART,
          GAME_TYPE_ENUMS.EIGHTBALLPOOL,
          GAME_TYPE_ENUMS.PAINTBALL,
          GAME_TYPE_ENUMS.SOCCER,
          GAME_TYPE_ENUMS.VOLLEYBALL,
        ],
        message: "Invalid game type",
      },
      required: true,
    },
    prizeMoney: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export = model("Games", gameSchema);
