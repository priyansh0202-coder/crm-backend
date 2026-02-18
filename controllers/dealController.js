import Deal from "../models/Deal.js";
import Lead from "../models/Lead.js";

export const createDeal = async (req, res, next) => {
    try {
        const { leadId, value, stage, expectedCloseDate } = req.body;

        const lead = await Lead.findById(leadId);

        if (!lead) {
            return res.status(404).json({
                success: false,
                message: "Lead not found",
            });
        }

        if (
            req.user.role === "user" &&
            lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "You can only create deals for your own leads",
            });
        }

        const deal = await Deal.create({
            lead: leadId,
            value,
            stage,
            expectedCloseDate,
        });

        res.status(201).json({
            success: true,
            message: "Deal created successfully",
            deal,
        });
    } catch (error) {
        next(error);
    }
};

export const getDeals = async (req, res, next) => {
    try {
        const { stage } = req.query;

        const query = {};

        if (stage) {
            query.stage = stage;
        }

        let deals;

        if (req.user.role === "admin") {
            deals = await Deal.find(query)
                .populate({
                    path: "lead",
                    select: "name assignedTo",
                })
                .lean();
        } else {
            deals = await Deal.find(query)
                .populate({
                    path: "lead",
                    match: { assignedTo: req.user._id },
                    select: "name assignedTo",
                })
                .lean();

            deals = deals.filter((deal) => deal.lead !== null);
        }

        res.status(200).json({
            success: true,
            count: deals.length,
            deals,
        });
    } catch (error) {
        next(error);
    }
};

export const updateDealStage = async (req, res, next) => {
    try {
        const { stage } = req.body;

        const deal = await Deal.findById(req.params.id).populate("lead");

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Deal not found",
            });
        }

        if (
            req.user.role === "user" &&
            deal.lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        deal.stage = stage;
        await deal.save();

        res.status(200).json({
            success: true,
            message: "Deal stage updated",
            deal,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteDeal = async (req, res, next) => {
    try {
        const deal = await Deal.findById(req.params.id).populate("lead");

        if (!deal) {
            return res.status(404).json({
                success: false,
                message: "Deal not found",
            });
        }

        if (
            req.user.role === "user" &&
            deal.lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        await deal.deleteOne();

        res.status(200).json({
            success: true,
            message: "Deal deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
