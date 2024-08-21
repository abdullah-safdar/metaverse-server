import { ISocket } from "../Interfaces";

export interface IRoom {
  id: string;
  players: string[];
  prizeMoney: number;
  expectedPlayers?: string[];
  gameType: string;
}

export interface IRooms {
  [key: string]: IRoom;
}
