import express from "express";
import {
  addUser,
  addStore,
  getDashboardStats,
  deleteUser,
  updateUser,
  deleteStore,
  updateStore,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";
import { db } from "../config/db.js";

const router = express.Router();

// ---------- USERS ----------
router.post("/users", authMiddleware, requireRole("admin"), addUser);
router.delete("/users/:id", authMiddleware, requireRole("admin"), deleteUser);
router.put("/users/:id", authMiddleware, requireRole("admin"), updateUser);

// ---------- STORES ----------
router.post("/stores", authMiddleware, requireRole("admin"), addStore);
router.delete("/stores/:id", authMiddleware, requireRole("admin"), deleteStore);
router.put("/stores/:id", authMiddleware, requireRole("admin"), updateStore);

// GET all stores
router.get("/stores", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM stores");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching stores" });
  }
});

// GET single store
router.get("/stores/:id", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM stores WHERE id=?", [req.params.id]);
    if (!rows[0]) return res.status(404).json({ message: "Store not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching store" });
  }
});

router.get("/owners", authMiddleware, requireRole("admin"), async (req, res) => {
    try {
      const [rows] = await db.query("SELECT id, name, email FROM users WHERE role='owner'");
      res.json(rows);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching owners" });
    }
  });

// ---------- DASHBOARD STATS ----------
router.get("/stats", authMiddleware, requireRole("admin"), getDashboardStats);

export default router;
