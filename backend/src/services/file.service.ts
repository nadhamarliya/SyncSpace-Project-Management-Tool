import { UploadApiResponse } from "cloudinary";
import cloudinary from "../config/cloudinary.config";

export const uploadFileToCloudinary = (
  file: Express.Multer.File
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "syncspace/tasks",
        resource_type: "raw",
        public_id: file.originalname,
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
};