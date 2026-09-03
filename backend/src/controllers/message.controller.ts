import { Request, Response } from "express";
import { getMessagesService, createMessageService } from "../services/message.service";
import { getIO } from "../socket";

export const getMessagesController = async (
  req: Request,
  res: Response
) => {
  const { workspaceId } = req.params;

  const messages = await getMessagesService(workspaceId);

  return res.status(200).json({
    messages,
  });
};

export const createMessageController = async (
  req: Request,
  res: Response
) => {
  const { workspaceId } = req.params;
  const { content } = req.body;

  const senderId = req.user?._id;

  if (!senderId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const message = await createMessageService(
    workspaceId,
    senderId.toString(),
    content
  );

  getIO()
  .to(`workspace:${workspaceId}`)
  .emit("new-message", message);

  return res.status(201).json({
    message,
  });
};