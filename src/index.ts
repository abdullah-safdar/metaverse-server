import { Server } from "socket.io";
import connectToDatabase from "./db";
import socket from "./socket";
import { config } from "./config";

const io = new Server(config.PORT_NUMBER);
connectToDatabase();
socket(io);
