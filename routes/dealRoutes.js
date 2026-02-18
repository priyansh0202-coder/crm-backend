import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
    createDeal,
    getDeals,
    updateDealStage,
    deleteDeal,
} from "../controllers/dealController.js";

const router = express.Router();

router.post("/", protect, createDeal);
router.get("/", protect, getDeals);
router.put("/:id", protect, updateDealStage);
router.delete("/:id", protect, deleteDeal);

export default router;
