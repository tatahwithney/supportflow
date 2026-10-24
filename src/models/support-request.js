const mongoose = require("mongoose");

const supportRequestSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true
        },
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160
        },
        description: {
            type: String,
            required: true,
            trim: true
        },
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        assignedAgent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        status: {
            type: String,
            enum: ["open", "in-progress", "resolved", "closed"],
            default: "open"
        },
        priority: {
            type: String,
            enum: ["low", "medium", "high", "urgent"],
            default: "medium"
        },
        category: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

supportRequestSchema.index({ organization: 1, createdAt: -1 });

module.exports = mongoose.model("SupportRequest", supportRequestSchema);
