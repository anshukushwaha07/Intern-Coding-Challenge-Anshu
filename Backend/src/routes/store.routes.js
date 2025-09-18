import express from "express";
import { getStores, submitRating, getStoreWithRating, rateStore } from "../controllers/store.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// public list of stores
router.get("/", getStores);

// get single store with ratings (for store detail page)
router.get("/:id", getStoreWithRating);

// get ratings for a specific store
router.get("/:id/ratings", async (req, res) => {
  const { id } = req.params;
  try {
    const { db } = await import("../config/db.js");
    const [ratings] = await db.query(
      "SELECT r.id, r.rating, r.comment, u.name as user_name FROM ratings r JOIN users u ON r.user_id=u.id WHERE r.store_id=?",
      [id]
    );
    res.json(ratings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching ratings" });
  }
});

// protected: submit rating (legacy endpoint)
router.post("/:id/rating", authMiddleware, submitRating);

// protected: submit rating with comment (new endpoint)
router.post("/:id/rate", authMiddleware, rateStore);

export default router;
