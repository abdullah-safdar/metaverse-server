export interface IBuyLand {
  landId: number;
  username: string;
}

export interface ISendInvitation {
  sentBy: string;
  sentTo: string;
  landId: string;
  message: string;
}

export interface IChangeInviteStatus {
  status: string;
}

export interface IUpdateInviteStatus {
  status: string;
  inviteId: string;
}
