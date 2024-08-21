import { Users } from "../../models";
import { IUsers, IUser, ISocket } from "../../Interfaces";

async function authMiddleware(socket: ISocket, users: IUsers) {
  if (!users[socket.username]) {
    return null;
  }

  const user: any = await Users.findOne({
    email: users[socket.username].email,
  }).select("_id email userName");

  return user;
}

export default authMiddleware;
