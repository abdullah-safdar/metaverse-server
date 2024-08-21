import { Schema } from "mongoose";

interface ISelected {
  slotName: string;
  value: string;
}

interface IBought {
  slotName: string;
  value: [{ itemName: String; price?: Number; forAuction?: Boolean }];
}

interface IWardRobe {
  selected: [ISelected];
  bought: [IBought];
}

interface IDNA {
  key: string;
  value: string;
}

export type Uid = Schema.Types.ObjectId | undefined;

export interface IRegisterParams {
  email: string;
  username: string;
  password: string;
  dna: [IDNA];
  wardrobe: [IWardRobe];
}

export interface ILoginParams {
  username: string;
  email: string;
  password: string;
}

export interface ILoginWithMetamaskParams {
  walletAddress: string;
}

export interface IConnectMetamaskParams {
  username: string;
  walletAddress: string;
}

export interface IUser {
  _id: Schema.Types.ObjectId;
  username: string;
  email: string;
  balance: number;
  socketId: string;
}

export interface IUsers {
  [key: string]: IUser;
}

export interface IUpdateBalanceParams {
  username: string;
  balance: number;
}
