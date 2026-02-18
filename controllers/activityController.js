import Activity from "../models/Activity.js";
import Lead from "../models/Lead.js";

export const createActivity = async (req, res, next) => {
    try {
        const { leadId, type, description, activityDate } = req.body;

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
                message: "You can log activity only for your own leads",
            });
        }

        const activity = await Activity.create({
            lead: leadId,
            type,
            description,
            activityDate,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Activity logged successfully",
            activity,
        });
    } catch (error) {
        next(error);
    }
};

export const getActivitiesByLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;

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
                message: "Access denied",
            });
        }

        const activities = await Activity.find({ lead: leadId })
            .populate("createdBy", "name email")
            .sort({ activityDate: -1 })
            .lean();

        res.status(200).json({
            success: true,
            count: activities.length,
            activities,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteActivity = async (req, res, next) => {
    try {
        const activity = await Activity.findById(req.params.id).populate("lead");

        if (!activity) {
            return res.status(404).json({
                success: false,
                message: "Activity not found",
            });
        }

        if (
            req.user.role === "user" &&
            activity.lead.assignedTo.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        await activity.deleteOne();

        res.status(200).json({
            success: true,
            message: "Activity deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
