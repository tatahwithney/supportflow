const Response = require("../models/response");
const SupportRequest = require("../models/support-request");

const canAccessRequest = (request, user) => {
    if (user.role === "customer") {
        return (
            request.customer.toString() ===
            user.userId.toString()
        );
    }

    if (user.role === "agent") {
        return (
            request.assignedAgent &&
            request.assignedAgent.toString() ===
            user.userId.toString()
        );
    }

    return ["manager", "admin"].includes(
        user.role
    );
};

const createResponse = async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                message: "Message is required"
            });
        }

        const request =
            await SupportRequest.findById(
                req.params.id
            );

        if (!request) {
            return res.status(404).json({
                message:
                    "Support request not found"
            });
        }

        if (
            !canAccessRequest(
                request,
                req.user
            )
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const response =
            await Response.create({
                request: request._id,
                sender: req.user.userId,
                message
            });

        const populatedResponse =
            await Response.findById(
                response._id
            ).populate(
                "sender",
                "name email role"
            );

        res.status(201).json({
            message:
                "Response added successfully",

            response: populatedResponse
        });
    } catch (error) {
        console.error(
            "Create response error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getResponses = async (req, res) => {
    try {
        const request =
            await SupportRequest.findById(
                req.params.id
            );

        if (!request) {
            return res.status(404).json({
                message:
                    "Support request not found"
            });
        }

        if (
            !canAccessRequest(
                request,
                req.user
            )
        ) {
            return res.status(403).json({
                message: "Access denied"
            });
        }

        const responses =
            await Response.find({
                request: req.params.id
            })
                .populate(
                    "sender",
                    "name email role"
                )
                .sort({ createdAt: 1 });

        res.json(responses);
    } catch (error) {
        console.error(
            "Get responses error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createResponse,
    getResponses
};