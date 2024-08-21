export interface ICreateGameSessionParams {
  id: string;
  isClosed: boolean;
  prizeMoney: number;
  expectedPlayers: [string];
  gameType: string;
}

export interface IJoinGameSessionParams {
  id: string;
}

export interface ILeaveGameSessionParams {
  id: string;
  player: string;
}

export interface IGameCompletedParams {
  id: string;
  winner: string;
  gameType: string;
}

export interface IUpdateGameSessionParams {
  username: string;
  gameType: string;
  prizeMoney: number;
}
