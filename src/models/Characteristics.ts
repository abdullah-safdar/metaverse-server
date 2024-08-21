import { Schema, model } from "mongoose";

const dnaSchema = new Schema(
  {
    key: String,
    value: Number,
  },
  { _id: false }
);

const wardrobeSchema = new Schema(
  {
    selected: [{ slotName: String, value: String }],
    bought: [
      {
        slotName: String,
        value: [
          {
            itemName: String,
            price: Number,
            forAuction: { type: Boolean, default: false },
          },
        ],
      },
    ],
  },
  {
    _id: false,
  }
);

const CharacteristicsSchema = new Schema({
  uid: {
    type: Schema.Types.ObjectId,
  },
  dna: [dnaSchema],
  wardrobe: wardrobeSchema,
});

export = model("Characteristics", CharacteristicsSchema);
