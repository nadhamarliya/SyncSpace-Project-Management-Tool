import { Server } from "socket.io";
import { config } from "./config/app.config";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: config.FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-workspace", (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);

      console.log(
        `Socket ${socket.id} joined workspace:${workspaceId}`
      );
    });

    

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO has not been initialized");
  }

  return io;
};