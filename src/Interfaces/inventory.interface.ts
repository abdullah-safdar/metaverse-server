export interface IPickItemInventory {
  username: string;
  itemKey: string;
  itemType: string;
}

export interface IDropItemInventory {
  username: string;
  itemKey: string;
}

export interface IFetchInventoryItems {
  username: string;
}
