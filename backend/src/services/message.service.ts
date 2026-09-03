import mongoose from "mongoose";
import MessageModel from "../models/message.model";

export const createMessageService = async (
  workspaceId: string,
  senderId: string,
  content: string
) => {
  const message = await MessageModel.create({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
    senderId: new mongoose.Types.ObjectId(senderId),
    content,
  });

  return message;
};

export const getMessagesService = async (workspaceId: string) => {
  const messages = await MessageModel.find({
    workspaceId: new mongoose.Types.ObjectId(workspaceId),
  })
    .populate("senderId", "_id name profilePicture")
    .sort({ createdAt: 1 });

  return messages;
};