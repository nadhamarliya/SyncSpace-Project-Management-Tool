import express from "express";
import { getMessagesController, createMessageController } from "../controllers/message.controller";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";

const messageRoutes = express.Router();

messageRoutes.get(
  "/workspace/:workspaceId",
  asyncHandler(getMessagesController)
);

messageRoutes.post(
  "/workspace/:workspaceId",
  asyncHandler(createMessageController)
);

export default messageRoutes;