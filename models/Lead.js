import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Lead name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Lead email is required"],
            lowercase: true,
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
        },
        company: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ["new", "contacted", "qualified", "lost"],
            default: "new",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Indexing for optimization
leadSchema.index({ assignedTo: 1 });
leadSchema.index({ status: 1 });

const Lead = mongoose.model("Lead", leadSchema);

export default Lead;
