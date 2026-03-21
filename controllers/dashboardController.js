import Lead from "../models/Lead.js";
import Deal from "../models/Deal.js";

export const getDashboardData = async (req, res, next) => {
    try {
        let leadQuery = {};
        let dealQuery = {};

        if (req.user.role === "user") {
            leadQuery.assignedTo = req.user._id;

            const leads = await Lead.find({ assignedTo: req.user._id }).select("_id");
            const leadIds = leads.map((lead) => lead._id);

            dealQuery.lead = { $in: leadIds };
        }

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

        const dealsByStage = await Deal.aggregate([
            { $match: dealQuery },
            {
                $group: {
                    _id: "$stage",
                    count: { $sum: 1 },
                },
            },
        ]);

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
