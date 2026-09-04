import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { uploadFileToCloudinary } from "../services/file.service";
import { HTTPSTATUS } from "../config/http.config";

export const uploadFileController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "No file uploaded",
      });
    }

    const result = await uploadFileToCloudinary(req.file);

    return res.status(HTTPSTATUS.OK).json({
      message: "File uploaded successfully",
      file: {
        name: req.file.originalname,
        url: result.secure_url,
        type: req.file.mimetype,
        size: req.file.size,
      },
    });
  }
);