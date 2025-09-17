import express from "express";
import { getStores, submitRating,getStoreWithRating,rateStore } from "../controllers/store.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// public list of stores
router.get("/", getStores);

// protected: submit rating
router.post("/:id/rating", authMiddleware, submitRating);

router.post("/stores/:id/rate", authMiddleware, rateStore);
router.get("/stores/:id", getStoreWithRating);

export default router;
