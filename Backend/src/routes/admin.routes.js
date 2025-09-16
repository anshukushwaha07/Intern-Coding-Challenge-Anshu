import express from "express";
import { addUser, 
    addStore,
    getDashboardStats,
    deleteUser,
    updateUser,
    deleteStore,
    updateStore, } from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/role.middleware.js";

const router = express.Router();

// only admin can add users
router.post("/users", authMiddleware, requireRole("admin"), addUser);
router.post("/stores", authMiddleware, requireRole("admin"), addStore);
router.get("/stats", authMiddleware, requireRole("admin"), getDashboardStats);

router.delete("/users/:id", authMiddleware, requireRole("admin"), deleteUser);
router.put("/users/:id", authMiddleware, requireRole("admin"), updateUser);

router.delete("/stores/:id", authMiddleware, requireRole("admin"), deleteStore);
router.put("/stores/:id", authMiddleware, requireRole("admin"), updateStore);

export default router;



