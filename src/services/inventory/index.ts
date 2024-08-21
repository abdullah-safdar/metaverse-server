import { Inventory, Users } from "../../models";
import {
  IPickItemInventory,
  IDropItemInventory,
  IFetchInventoryItems,
} from "../../Interfaces";

const pickInventoryItem = async (params: IPickItemInventory) => {
  const { username, itemKey } = params;

  const user = await Users.findOne({ username });

  // check inventory exists of current user
  const checkUserExists = await Inventory.findOne({ ownerId: user?._id });

  if (checkUserExists) {
    // check inventory exists
    const checkInventoryExists = await Inventory.findOne({
      ownerId: user?._id,
      "item.itemKey": itemKey,
    });

    //check current inventory
    if (checkInventoryExists) {
      throw new Error("Inventory item already picked!");
    }

    await Inventory.updateOne(
      { ownerId: user?._id },
      { $push: { item: { itemKey } } }
    );
  } else {
    await Inventory.create({
      ownerId: user?._id,
      item: [{ itemKey }],
    });
  }

  return { message: "Item picked up successfully." };
};

const dropInventoryItem = async (params: IDropItemInventory) => {
  const { username, itemKey } = params;

  const user = await Users.findOne({ username });

  const checkUserInventoryExists = await Inventory.findOne({
    ownerId: user?._id,
    "item.itemKey": itemKey,
  });

  if (!checkUserInventoryExists) {
    throw new Error("Inventory does not exist!");
  }

  await Inventory.updateOne(
    { ownerId: user?._id },
    { $pull: { item: { itemKey } } }
  );

  return { message: "Inventory dropped successfully." };
};

const fetchInventoryItems = async (params: IFetchInventoryItems) => {
  const { username } = params;
  const user = await Users.findOne({ username });

  const items = await Inventory.findOne({ ownerId: user?._id }).select(
    "item -_id"
  );

  return { items };
};

export { pickInventoryItem, dropInventoryItem, fetchInventoryItems };
