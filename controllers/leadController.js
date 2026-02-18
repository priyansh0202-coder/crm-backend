import Lead from "../models/Lead.js";
import User from "../models/User.js";

export const createLead = async (req, res, next) => {
    try {
        const { name, email, phone, company, status } = req.body;

        let assignedUser;

        if (req.user.role === "admin") {
            const salesUsers = await User.find({ role: "user" });

            if (salesUsers.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "No sales users available for assignment",
                });
            }

            const randomIndex = Math.floor(Math.random() * salesUsers.length);
            assignedUser = salesUsers[randomIndex]._id;
        } else {
            assignedUser = req.user._id;
        }

        const lead = await Lead.create({
            name,
            email,
            phone,
            company,
            status,
            assignedTo: assignedUser,
            createdBy: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: "Lead created successfully",
            lead,
        });
    } catch (error) {
        next(error);
    }
};


// GET LEADS
export const getLeads = async (req, res, next) => {
    try {
        const { search, status, page = 1, limit = 10 } = req.query;

        const query = {};

        if (req.user.role === "user") {
            query.assignedTo = req.user._id;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        if (status) {
            query.status = status;
        }

        const skip = (page - 1) * limit;

        const leads = await Lead.find(query)
            .populate("assignedTo", "name email")
            .skip(skip)
            .limit(Number(limit))
            .sort({ createdAt: -1 })
            .lean();

        const total = await Lead.countDocuments(query);

        res.status(200).json({
            success: true,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            count: leads.length,
            leads,
        });
    } catch (error) {
        next(error);
    }
};


// single lead

export const getLeadById = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);

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

        res.status(200).json({
            success: true,
            lead,
        });
    } catch (error) {
        next(error);
    }
};

//UPDATE lead

export const updateLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);

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

        const updatedLead = await Lead.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            updatedLead,
        });
    } catch (error) {
        next(error);
    }
};

//DELETE lead
export const deleteLead = async (req, res, next) => {
    try {
        const lead = await Lead.findById(req.params.id);

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

        await lead.deleteOne();

        res.status(200).json({
            success: true,
            message: "Lead deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};
