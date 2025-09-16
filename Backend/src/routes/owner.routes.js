import express from "express";
import { getMyStoreRatings } from "../controllers/owner.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();


router.get("/ratings", authMiddleware, requireRole("owner"), getMyStoreRatings);

export default router;
