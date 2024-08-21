import { Socket } from "socket.io";

interface ISocket extends Socket {
  username?: any;
}

export default ISocket;
