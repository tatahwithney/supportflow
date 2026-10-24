const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema(
    {
        organization: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Organization",
            required: true,
            index: true
        },
        request: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SupportRequest",
            required: true
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        }
    },
    { timestamps: true }
);

responseSchema.index({ organization: 1, request: 1, createdAt: 1 });

module.exports = mongoose.model("Response", responseSchema);
