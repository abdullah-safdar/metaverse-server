import { Characteristics, Users } from "../../models";
import {
  IBuyWardRobe,
  IGetAuctionWardrobeList,
  IBuyAuctionWardRobe,
  ISelectWardRobe,
  IUpdateDna,
  IAuction,
  Uid,
} from "../../Interfaces";

const selectWardrobe = async (params: ISelectWardRobe, uid: Uid) => {
  const { slotName, value } = params;

  await Characteristics.updateOne(
    { uid: uid, "wardrobe.selected.slotName": slotName },
    {
      $set: { "wardrobe.selected.$.value": value },
    }
  );
};

const selectDna = async (params: IUpdateDna, uid: Uid) => {
  const { dna } = params;
  console.log(params);
  for (let data of dna) {
    await Characteristics.updateOne(
      { uid: uid, "dna.key": data.key },
      {
        $set: { "dna.$.value": data.value },
      }
    );
  }
};

const buyWardrobe = async (params: IBuyWardRobe, uid: Uid) => {
  const { slotName, value } = params;
  console.log(params);
  await Characteristics.updateOne(
    { uid: uid, "wardrobe.bought.slotName": slotName },
    {
      $addToSet: { "wardrobe.bought.$.value": value },
    }
  );
};

const buyAuctionWardrobe = async (params: IBuyAuctionWardRobe, uid: Uid) => {
  const { slotName, value, sellerName } = params;

  const seller = await Users.findOne({ username: sellerName });

  await Characteristics.updateOne(
    { uid: seller?._id, "wardrobe.bought.slotName": slotName },
    { $pull: { "wardrobe.bought.$.value.itemName": value.itemName } }
  );

  await Characteristics.updateOne(
    { uid: uid, "wardrobe.bought.slotName": slotName },
    {
      $addToSet: { "wardrobe.bought.$.value": value },
    }
  );
};

const updateWardrobeAuctionStatus = async (params: IAuction, uid: Uid) => {
  const { slotName, value } = params;

  await Characteristics.updateOne(
    {
      uid: uid,
      "wardrobe.bought.slotName": slotName,
    },
    {
      $set: {
        "wardrobe.bought.$[].value.$[index].price": value.price,
        "wardrobe.bought.$[].value.$[index].forAuction": value.forAuction,
      },
    },
    {
      arrayFilters: [{ "index.itemName": value.itemName }],
    }
  );
};

const getWardrobeAuctionList = async (param: IGetAuctionWardrobeList) => {
  const { username } = param;

  const user = await Users.findOne({ username });

  const auctionWardrobeList = await Characteristics.aggregate([
    {
      $unwind: "$wardrobe.bought",
    },
    {
      $unwind: "$wardrobe.bought.value",
    },
    {
      $match: {
        uid: user?._id,
        "wardrobe.bought.value.forAuction": true,
      },
    },
    {
      $group: {
        _id: "",
        auction: {
          $push: "$wardrobe.bought",
        },
      },
    },
  ]);

  console.log(auctionWardrobeList[0].auction);

  return auctionWardrobeList[0].auction;
};

export {
  selectWardrobe,
  selectDna,
  buyWardrobe,
  getWardrobeAuctionList,
  buyAuctionWardrobe,
  updateWardrobeAuctionStatus,
};
