import { Server } from "socket.io";
import authModule from "./user";
import nftModule from "./nft";
import chatModule from "./chat";
import inviteModule from "./invite";
import inventoryModule from "./inventory";
import gameInventory from "./games";
import { updateGameSession } from "../services";
import { IUsers, ISocket, IRooms } from "../Interfaces";
import { encrypt } from "../utils";

let users: IUsers = {};
let rooms: IRooms = {};

const socket = (io: Server) => {
  io.on("connection", (socket: ISocket) => {
    authModule(socket, users);
    nftModule(socket, users);
    chatModule(socket, users);
    inviteModule(socket, users);
    inventoryModule(socket, users);
    gameInventory(io, socket, users, rooms);

    socket.on("disconnecting", async () => {
      //   console.log("Rooms State", rooms);
      // console.log("Rooms", socket.rooms);

      // handling mini games when socket is disconnected
      for (const room of socket.rooms) {
        if (rooms[room]) {
          // update player state in room
          rooms[room].players = rooms[room].players.filter(
            (player) => player !== socket.username
          );

          // leave room
          socket.leave(room);

          // broadcast event to all players that player has left the room
          io.to(room).emit(
            "playerLeftGameSession",
            encrypt({ id: room, player: socket.username })
          );

          if (rooms[room].players.length === 1) {
            // update schema
            await updateGameSession({
              username: rooms[room].players[0],
              gameType: rooms[room].gameType,
              prizeMoney: rooms[room].prizeMoney,
            });

            // emit win event to the winner player
            socket.to(rooms[room].players[0]).emit(
              "playerWin",
              encrypt({
                id: room,
                player: rooms[room].players[0],
                prize: rooms[room].prizeMoney,
              })
            );

            // delete room from room state
            if (rooms[room]) delete rooms[room];
          }

          // delete room from room state
          if (rooms[room].players.length === 0) delete rooms[room];
        }
      }

      console.log("Rooms State After", rooms);
    });

    socket.on("disconnect", () => {
      // console.log("beforeDisconnect", users);

      // handling user state when socket is disconnected
      if (users[socket.username]) delete users[socket.username];

      // console.log("disconnected", users);
    });

    socket.on("error", function (er: any) {
      console.log("error", er);
    });
  });
};
export default socket;
