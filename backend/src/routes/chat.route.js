import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLiveKitToken, getRoomToken } from "../controllers/chat.controller.js";

const router = express.Router();

// Get general LiveKit token (for connecting to any room)
router.get("/token", protectRoute, getLiveKitToken);

// Get token for a specific room
router.get("/token/:roomId", protectRoute, getRoomToken);

export default router;
