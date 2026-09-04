import { Router } from "express";
import upload from "../middlewares/upload.middleware";
import { uploadFileController } from "../controllers/file.controller";

const fileRoutes = Router();

fileRoutes.post(
  "/upload",
  upload.single("file"),
  uploadFileController
);

export default fileRoutes;