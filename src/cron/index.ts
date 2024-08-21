import { Chats } from "../models";

const deleteChats = async () => {
  await Chats.remove({ createdAt: { $lte: Date.now() } });
};
