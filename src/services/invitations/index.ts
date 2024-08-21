import { Users, Lands, Invitations } from "../../models";
import {
  IBuyLand,
  ISendInvitation,
  IUpdateInviteStatus,
  IUser,
} from "../../Interfaces";

const buyLand = async (params: IBuyLand) => {
  const { landId, username } = params;

  const user = await Users.findOne({ username: username });

  await Lands.create({ landId, ownerId: user?._id });

  return { landId, username };
};

const searchUsers = async (username: string) => {
  const users = await Users.find({ $text: { $search: username } });

  return users;
};

const getPendingInvitations = async (username: string) => {
  const user = await Users.findOne({ username: username });
  let pendingInvitations: any = await Invitations.find({
    sentTo: user?._id,
    status: "pending",
  });

  pendingInvitations = await Promise.all(
    pendingInvitations.map(async (invitation: any) => {
      const sentToUser = await Users.findOne({ _id: invitation.sentTo });
      const sentByUser = await Users.findOne({ _id: invitation.sentBy });
      return {
        inviteId: invitation._id,
        landId: invitation.landId,
        sentTo: sentToUser?.username,
        sentBy: sentByUser?.username,
        message: invitation?.message,
        status: invitation?.status,
      };
    })
  );

  return pendingInvitations;
};

const sendInvitation = async (params: ISendInvitation) => {
  const { landId, sentBy, sentTo, message } = params;

  const sentById = await Users.findOne({ username: sentBy });
  const sentToId = await Users.findOne({ username: sentTo });

  const { _id } = await Invitations.create({
    landId,
    sentBy: sentById?._id,
    sentTo: sentToId?._id,
    message,
  });

  return _id;
};

const updateInviteStatus = async (params: IUpdateInviteStatus) => {
  const { inviteId, status } = params;

  await Invitations.findOneAndUpdate(
    { _id: inviteId },
    { status },
    { runValidators: true }
  );

  const invite = await Invitations.findOne({ _id: inviteId });

  const inviteSender: any = await Users.findOne({ _id: invite?.sentBy });

  const inviteDetails = {
    sentBy: inviteSender.username,
    landId: invite?.landId,
    status: invite?.status,
  };

  return inviteDetails;
};

export {
  buyLand,
  searchUsers,
  sendInvitation,
  updateInviteStatus,
  getPendingInvitations,
};
