import User from "../models/User.js";


export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password").lean();

        res.status(200).json({
            success: true,
            count: users.length,
            users,
        });
    } catch (error) {
        next(error);
    }
};



export const getSalesUsersWithLeads = async (req, res, next) => {
    try {
        const salesUsers = await User.aggregate([
            {
                $match: { role: "user" },
            },
            {
                $lookup: {
                    from: "leads", // MongoDB collection name (lowercase plural)
                    localField: "_id",
                    foreignField: "assignedTo",
                    as: "leads",
                },
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    role: 1,
                    leads: {
                        _id: 1,
                        name: 1,
                        status: 1,
                        createdAt: 1,
                    },
                },
            },
        ]);

        res.status(200).json({
            success: true,
            count: salesUsers.length,
            salesUsers,
        });
    } catch (error) {
        next(error);
    }
};
