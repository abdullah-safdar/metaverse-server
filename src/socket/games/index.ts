import { Server } from "socket.io";
import { authMiddleware } from "../../middlewares";
import { updateGameSession } from "../../services";
import {
  IUsers,
  ISocket,
  IRooms,
  ICreateGameSessionParams,
  IJoinGameSessionParams,
  ILeaveGameSessionParams,
  IGameCompletedParams,
} from "../../Interfaces";
import { encrypt, decrypt } from "../../utils";

const gamesModule = (
  io: Server,
  socket: ISocket,
  users: IUsers,
  rooms: IRooms
) => {
  socket.on("createGameSession", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }
      const decryptedData: ICreateGameSessionParams = decrypt(param);
      const roomId: string = `room-${decryptedData.id}`;

      //creating game room
      socket.join(roomId);

      // updating game room state
      if (decryptedData.isClosed) {
        rooms[roomId] = {
          id: roomId,
          players: [socket?.username],
          prizeMoney: decryptedData.prizeMoney,
          expectedPlayers: [...decryptedData.expectedPlayers],
          gameType: decryptedData.gameType,
        };
      } else {
        rooms[roomId] = {
          id: roomId,
          players: [socket?.username],
          prizeMoney: decryptedData.prizeMoney,
          gameType: decryptedData.gameType,
        };
      }

      // sending success event to itself
      socket.emit(
        "createGameSessionSuccess",
        encrypt({
          id: roomId,
          message: "Game session created successfully",
        })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit(
        "createGameSessionFailure",
        encrypt({ message: error?.message })
      );
    }
  });

  socket.on("joinGameSession", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }
      const decryptedData: IJoinGameSessionParams = decrypt(param);
      const roomId: string = `room-${decryptedData.id}`;

      // Joining game room
      socket.join(roomId);

      // adding players to room state
      rooms[roomId].players = [socket.username, ...rooms[roomId].players];

      // broadcast event to all room users except itself
      socket
        .to(roomId)
        .emit(
          "playerJoinedGameSession",
          encrypt({ id: roomId, player: socket.username })
        );

      // Emit event to itself
      socket.emit(
        "joinGameSessionSuccess",
        encrypt({ id: roomId, players: rooms[roomId].players })
      );
    } catch (error: any) {
      console.log(error);
      socket.emit(
        "joinGameSessionFailure",
        encrypt({ message: error.message })
      );
    }
  });

  socket.on("leaveGameSession", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }
      const decryptedData: ILeaveGameSessionParams = decrypt(param);
      const roomId = `room-${decryptedData.id}`;

      //removing current player from the room state
      rooms[roomId].players = rooms[roomId].players.filter(
        (player) => player !== socket.username
      );

      // update schema only when one player left in room
      if (rooms[roomId].players.length === 1) {
        // updating game schema
        await updateGameSession({
          username: rooms[roomId].players[0],
          gameType: rooms[roomId].gameType,
          prizeMoney: rooms[roomId].prizeMoney,
        });

        // send win event to winner
        socket.to(users[rooms[roomId].players[0]].username).emit(
          "playerWin",
          encrypt({
            id: roomId,
            player: rooms[roomId].players[0],
            prize: rooms[roomId].prizeMoney,
          })
        );

        //deleting room after game completion
        if (rooms[roomId]) delete rooms[roomId];
      }

      //broadcasting event to the current room except itself
      socket
        .to(roomId)
        .emit(
          "playerLeftGameSession",
          encrypt({ id: roomId, player: socket.username })
        );

      // emit success event to itslef
      socket.emit(
        "leaveGameSessionSuccess",
        encrypt({ message: "Left game session successfully." })
      );

      // current socket leaves the room
      socket.leave(roomId);

      // delete room from room state
      if (rooms[roomId].players.length === 0) delete rooms[roomId];

      console.log("ROOM Leave session", rooms);
    } catch (error) {
      console.log(error);
      socket.emit("leaveGameSessionFailure", encrypt({ message: error }));
    }
  });

  socket.on("gameCompleted", async (param: string) => {
    try {
      const user = await authMiddleware(socket, users);
      if (!user) {
        socket.emit("authError", { message: "User isn't authorized" });
      }
      const decryptedData: IGameCompletedParams = decrypt(param);
      const roomId = `room-${decryptedData.id}`;

      // updating game schema
      await updateGameSession({
        username: decryptedData.winner,
        gameType: rooms[roomId].gameType,
        prizeMoney: rooms[roomId].prizeMoney,
      });

      //broadcast win event to all players in the room
      io.to(roomId).emit(
        "playerWin",
        encrypt({
          id: roomId,
          player: decryptedData.winner,
          prize: rooms[roomId].prizeMoney,
        })
      );

      // all socket ids will leave the room
      io.socketsLeave(roomId);

      //deleting room after game completion
      if (rooms[roomId]) delete rooms[roomId];
    } catch (error) {
      console.log(error);
    }
  });

  // socket.on("matchMaking", async (param: string) => {
  //   try {
  //     const user = await authMiddleware(socket, users);
  //     if (!user) {
  //       socket.emit("authError", { message: "User isn't authorized" });
  //     }
  //     const decryptedData = decrypt(param);

  //     socket.join(`room-${decryptedData.roomId}`);
  //     io.to(`room-${decryptedData.roomId}`).emit("joinRoomSuccess", {
  //       roomId: `room-${decryptedData.roomId}`,
  //       username: socket.username,
  //     });

  //     socket.emit("pickItemSuccess", encrypt({ message: "" }));
  //   } catch (error: any) {
  //     console.log(error);
  //     socket.emit("pickItemFailure", encrypt({ message: error?.message }));
  //   }
  // });
};

export default gamesModule;
