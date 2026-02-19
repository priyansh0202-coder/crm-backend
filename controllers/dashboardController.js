import Lead from "../models/Lead.js";
import Deal from "../models/Deal.js";

export const getDashboardData = async (req, res, next) => {
    try {
        let leadQuery = {};
        let dealQuery = {};

        // If sales user → only their data
        if (req.user.role === "user") {
            leadQuery.assignedTo = req.user._id;

            const leads = await Lead.find({ assignedTo: req.user._id }).select("_id");
            const leadIds = leads.map((lead) => lead._id);

            dealQuery.lead = { $in: leadIds };
        }

        // ===== Overview Counts =====
        const totalLeads = await Lead.countDocuments(leadQuery);
        const totalDeals = await Deal.countDocuments(dealQuery);
        const wonDeals = await Deal.countDocuments({
            ...dealQuery,
            stage: "Won",
        });
        const lostDeals = await Deal.countDocuments({
            ...dealQuery,
            stage: "Lost",
        });

        // ===== Revenue (Sum of Won Deals) =====
        const revenueResult = await Deal.aggregate([
            { $match: { ...dealQuery, stage: "Won" } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$value" },
                },
            },
        ]);

        const totalRevenue = revenueResult[0]?.totalRevenue || 0;

        // ===== Deals by Stage (Bar Chart) =====
        const dealsByStage = await Deal.aggregate([
            { $match: dealQuery },
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 },
                },
            },
        ]);

        // ===== Leads by Status (Pie Chart) =====
        const leadsByStatus = await Lead.aggregate([
            { $match: leadQuery },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            overview: {
                totalLeads,
                totalDeals,
                wonDeals,
                lostDeals,
                totalRevenue,
            },
            dealsByStage,
            leadsByStatus,
        });
    } catch (error) {
        next(error);
    }
};
