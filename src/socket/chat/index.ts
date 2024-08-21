import { authMiddleware } from "../../middlewares";
import {
  getGroupChats,
  getUserAllPrivateChats,
  getPrivateChats,
  addChat,
} from "../../services";
import {
  IUsers,
  IGetChatHistory,
  IPrivateChat,
  IGroupChat,
  ISocket,
} from "../../Interfaces";
import { encrypt, decrypt } from "../../utils";

const chatModule = (socket: ISocket, users: IUsers) => {
  socket.on("getChatInteractions", async () => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const messages = await getUserAllPrivateChats(users[socket.username]._id);

      socket.emit(
        "onChatInteractionsReceived",
        encrypt({
          messages,
        })
      );
    } catch (error: any) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("getChatHistory", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IGetChatHistory = decrypt(param);

      const messages = await getPrivateChats(
        users[socket.username],
        decryptedData.targetUsername
      );

      const data = { messages };
      const encryptedData = encrypt(data);

      socket.emit("onChatHistoryReceived", encryptedData);
    } catch (error: any) {
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("sendPrivateChat", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: IPrivateChat = decrypt(param);

      console.log(decryptedData);
      await addChat(
        {
          message: decryptedData.message,
          targetUsername: decryptedData.to,
        },
        users[socket.username]
      );

      if (users[decryptedData.to]) {
        const data = {
          message: decryptedData.message,
          from: users[socket.username]?.username,
          socketId: socket.id,
        };
        const encryptedData = encrypt(data);

        socket
          .to(users[decryptedData.to].socketId)
          .emit("onReceivePrivateChat", encryptedData);
      }
    } catch (error: any) {
      socket.emit("error", { message: error.message });
    }
  });

  // socket.on("getPreviousGroupChats", async () => {
  //   const messages = await getGroupChats();

  //   socket.to(socket.id).emit("onGroupMessages", {
  //     messages,
  //   });
  // });

  // socket.on("onGroupChat", async (params: IGroupChat) => {
  //   socket.emit("onGroupMessage", {
  //     message: params.message,
  //     from: socket.id,
  //   });
  // });
};

export default chatModule;
