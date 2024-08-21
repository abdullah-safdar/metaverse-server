import { authMiddleware } from "../../middlewares";
import {
  buyLand,
  searchUsers,
  sendInvitation,
  updateInviteStatus,
  getPendingInvitations,
} from "../../services";
import { IUsers, ISocket, ISendInvitation } from "../../Interfaces";
import { encrypt, decrypt } from "../../utils";

const inviteModule = (socket: ISocket, users: IUsers) => {
  socket.on("buyLand", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData = decrypt(param);
      const resp = await buyLand(decryptedData);

      socket.emit(
        "buyLandSuccess",
        encrypt({ ...resp, message: "land bought successfully." })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("onSearchUsers", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData = decrypt(param);
      const usernames = await searchUsers(decryptedData.username);

      socket.emit("onGetUsers", encrypt({ usernames }));
    } catch (error) {}
  });

  socket.on("getPendingInvites", async () => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const pendingInvitations = await getPendingInvitations(socket.username);

      socket.emit("onReceivedPendingInvites", encrypt({ pendingInvitations }));
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("sendInvite", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData: ISendInvitation = decrypt(param);
      const invite = await sendInvitation(decryptedData);

      if (users[decryptedData.sentTo]) {
        socket.to(users[decryptedData.sentTo].socketId).emit(
          "onInviteReceived",
          encrypt({
            message: "Invite sent successfully.",
            sentBy: decryptedData.sentBy,
            sentTo: decryptedData.sentTo,
            inviteId: invite._id,
            landId: decryptedData.landId,
          })
        );
      }
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("updateInviteStatus", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }

      const decryptedData = decrypt(param);
      const { status, inviteId } = decryptedData;
      const invite = await updateInviteStatus({ inviteId, status });

      socket.emit(
        "broadcastOnInviteAccepted",
        encrypt({ message: "invite status update successful.", invite })
      );

      socket
        .to(users[invite.sentBy].socketId)
        .emit("onInviteAccepted", encrypt({ invite }));
    } catch (error: any) {
      console.log(error);
      socket.emit("error", { message: error.message });
    }
  });
};

export default inviteModule;
