import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getLastSeen } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/:id/last-seen", protectRoute, getLastSeen);

export default router;
