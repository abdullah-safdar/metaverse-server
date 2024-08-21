import { IUser, IAddChat } from "../../Interfaces";
import { Chats, Users, Conversations } from "../../models";
import { CHAT_ENUMS } from "../../constants";

const getUserAllPrivateChats = async (id: any) => {
  const conversations = await Conversations.find({ participants: id });

  const allChats = await Promise.all(
    conversations.map(async (conversation) => {
      const otherParticipant = await conversation.participants.filter(
        (participantId) => participantId.toString() !== id.toString()
      );

      const user = await Users.findOne({ _id: otherParticipant[0] });

      const chats = await Chats.find({
        conversationId: conversation.id,
      })
        .sort({ createdAt: "desc" })
        .limit(1);

      const sender = await Users.findOne({ _id: chats[0].uid });

      return {
        targetUsername: user?.username,
        lastSentBy: sender?.username,
        message: chats[0].message,
        createdAt: chats[0].createdAt,
      };
    })
  );

  return allChats;
};

const getPrivateChats = async (currentUser: IUser, targetUsername: string) => {
  const targetUser = await Users.findOne({ username: targetUsername });

  const conversation = await Conversations.findOne({
    participants: { $all: [currentUser._id, targetUser?._id] },
  });

  let chats: any = await Chats.find({
    conversationId: conversation?._id,
  }).sort({ createdAt: "asc" });

  chats = await Promise.all(
    chats.map(async (chat: any) => {
      const user = await Users.findOne({ _id: chat.uid });

      return {
        username: user?.username,
        avatar: user?.avatar,
        message: chat.message,
        createdAt: chat.createdAt,
      };
    })
  );

  return chats;
};

const getGroupChats = async () => {
  try {
    let chats: any = await Chats.find({
      messageType: CHAT_ENUMS.GROUP,
    });

    chats = await Promise.all(
      chats.map(async (chat: any) => {
        const user = await Users.findOne({ _id: chat.uid });

        return { ...chat, username: user?.username };
      })
    );
    return chats;
  } catch (error) {
    console.log(error);
  }
};

const addChat = async (payload: IAddChat, user: IUser) => {
  const { message, targetUsername } = payload;

  const targetUser = await Users.findOne({ username: targetUsername });

  let conversation = await Conversations.findOne({
    participants: { $all: [user._id, targetUser?._id] },
  });

  if (!conversation) {
    conversation = await Conversations.create({
      participants: [user._id, targetUser?._id],
    });
  }

  await Chats.create({
    uid: user._id,
    message,
    conversationId: conversation._id,
  });
};

export { getGroupChats, getUserAllPrivateChats, getPrivateChats, addChat };
