import { Schema } from "mongoose";

type ChatEnum = "PRIVATE" | "GROUP";

export interface IGetPreviousChat {
  senderSocketId: string;
}

export interface IPrivateChat {
  message: string;
  to: string;
}

export interface IGroupChat {
  message: string;
}

export interface IGetChatHistory {
  targetUsername: string;
}

export interface IAddChat {
  message: string;
  targetUsername: string;
}
