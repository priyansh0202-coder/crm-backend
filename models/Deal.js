import mongoose from "mongoose";

const dealSchema = new mongoose.Schema(
    {
        lead: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Lead",
            required: true,
        },
        value: {
            type: Number,
            required: true,
        },
        stage: {
            type: String,
            enum: ["Prospect", "Negotiation", "Won", "Lost"],
            default: "Prospect",
        },
        expectedCloseDate: {
            type: Date,
        },
    },
    { timestamps: true }
);

dealSchema.index({ stage: 1 });
dealSchema.index({ lead: 1 });

const Deal = mongoose.model("Deal", dealSchema);

export default Deal;
