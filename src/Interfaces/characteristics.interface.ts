interface Dna {
  key: string;
  value: number;
}

export interface ISelectWardRobe {
  slotName: string;
  value: string;
}
export interface IUpdateDna {
  dna: [Dna];
}

export interface IBuyWardRobe {
  slotName: string;
  value: { itemName: string; price?: number; forAuction?: boolean };
}

export interface IBuyAuctionWardRobe {
  sellerName: string;
  slotName: string;
  value: { itemName: string; price?: number; forAuction?: boolean };
}

export interface IAuction {
  slotName: string;
  value: { itemName: string; price?: number; forAuction?: boolean };
}

export interface IGetAuctionWardrobeList {
  username: string;
}
