import express from "express";
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import {
    getAllUsers,
    getSalesUsersWithLeads,
} from "../controllers/userController.js";

const router = express.Router();

// Admin only routes
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

router.get(
    "/sales-with-leads",
    protect,
    authorizeRoles("admin"),
    getSalesUsersWithLeads
);

export default router;
