import { Router } from "express";
import { chatAIController } from "../controllers/ai.controller";

console.log("🔥 AI ROUTE FILE LOADED");

const aiRoutes = Router();

aiRoutes.post("/chat", chatAIController);

export default aiRoutes;