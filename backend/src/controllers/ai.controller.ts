import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { chatWithAI } from "../services/ai.service";
import { HTTPSTATUS } from "../config/http.config";

export const chatAIController = asyncHandler(
  async (req: Request, res: Response) => {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Message is required",
      });
    }

    const userId = req.user!._id;

    const response = await chatWithAI(message, userId);

    return res.status(HTTPSTATUS.OK).json({
      message: response,
    });
  }
);