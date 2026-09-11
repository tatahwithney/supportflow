const SupportRequest = require("../models/support-request");
const User = require("../models/user");

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

const createRequest = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            category
        } = req.body;

        if (!title || !description || !category) {
            return res.status(400).json({
                message:
                    "Title, description and category are required"
            });
        }

        const supportRequest =
            await SupportRequest.create({
                title,
                description,
                customer: req.user.userId,
                priority: priority || "medium",
                category
            });

        res.status(201).json({
            message:
                "Support request created successfully",

            request: supportRequest
        });
    } catch (error) {
        console.error(
            "Create request error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getRequests = async (req, res) => {
    try {
        let filter = {};

        if (req.user.role === "customer") {
            filter.customer = req.user.userId;
        }

        if (req.user.role === "agent") {
            filter.assignedAgent =
                req.user.userId;
        }

        const requests =
            await SupportRequest.find(filter)
                .populate(
                    "customer",
                    "name email"
                )
                .populate(
                    "assignedAgent",
                    "name email"
                )
                .sort({ createdAt: -1 });

        res.json(requests);
    } catch (error) {
        console.error(
            "Get requests error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getRequestById = async (req, res) => {
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

        await request.populate([
            {
                path: "customer",
                select: "name email"
            },
            {
                path: "assignedAgent",
                select: "name email"
            }
        ]);

        res.json(request);
    } catch (error) {
        console.error(
            "Get request error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateRequest = async (req, res) => {
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

        const {
            title,
            description,
            priority,
            category
        } = req.body;

        if (title !== undefined) {
            request.title = title;
        }

        if (description !== undefined) {
            request.description = description;
        }

        if (priority !== undefined) {
            request.priority = priority;
        }

        if (category !== undefined) {
            request.category = category;
        }

        await request.save();

        res.json({
            message:
                "Support request updated successfully",

            request
        });
    } catch (error) {
        console.error(
            "Update request error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteRequest = async (req, res) => {
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

        request.status = "closed";

        await request.save();

        res.json({
            message:
                "Support request closed successfully"
        });
    } catch (error) {
        console.error(
            "Delete request error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const assignAgent = async (req, res) => {
    try {
        const { agentId } = req.body;

        if (!agentId) {
            return res.status(400).json({
                message: "Agent ID is required"
            });
        }

        const agent =
            await User.findOne({
                _id: agentId,
                role: "agent",
                isActive: true
            });

        if (!agent) {
            return res.status(404).json({
                message:
                    "Active support agent not found"
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

        request.assignedAgent = agent._id;

        if (request.status === "open") {
            request.status = "in-progress";
        }

        await request.save();

        const updatedRequest =
            await SupportRequest.findById(
                request._id
            )
                .populate(
                    "customer",
                    "name email"
                )
                .populate(
                    "assignedAgent",
                    "name email"
                );

        res.json({
            message:
                "Support request assigned successfully",

            request: updatedRequest
        });
    } catch (error) {
        console.error(
            "Assign agent error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateRequestStatus = async (
    req,
    res
) => {
    try {
        const { status } = req.body;

        const allowedStatuses = [
            "open",
            "in-progress",
            "resolved",
            "closed"
        ];

        if (
            !status ||
            !allowedStatuses.includes(status)
        ) {
            return res.status(400).json({
                message: "Invalid status"
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
            req.user.role === "agent" &&
            (
                !request.assignedAgent ||
                request.assignedAgent.toString() !==
                    req.user.userId.toString()
            )
        ) {
            return res.status(403).json({
                message:
                    "You can only update requests assigned to you"
            });
        }

        request.status = status;

        await request.save();

        res.json({
            message:
                "Support request status updated successfully",

            request
        });
    } catch (error) {
        console.error(
            "Update status error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    assignAgent,
    updateRequestStatus
};