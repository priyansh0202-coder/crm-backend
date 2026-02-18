import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    createActivity,
    getActivitiesByLead,
    deleteActivity,
} from "../controllers/activityController.js";

const router = express.Router();

router.post("/", protect, createActivity);
router.get("/:leadId", protect, getActivitiesByLead);
router.delete("/:id", protect, deleteActivity);

export default router;
