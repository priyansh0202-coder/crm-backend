import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true,
        },
        type: {
            type: String,
            enum: ["Call", "Meeting", "Note", "Follow-up"],
            required: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        activityDate: {
            type: Date,
            default: Date.now,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    { timestamps: true }
);

// Index for faster queries
activitySchema.index({ lead: 1 });
activitySchema.index({ activityDate: -1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
