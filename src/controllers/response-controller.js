const Response = require("../models/response");
const SupportRequest = require("../models/support-request");

const canAccessRequest = (request, user) => {
    if (request.organization.toString() !== user.organizationId.toString()) return false;
    if (user.role === "customer") return request.customer.toString() === user.userId.toString();
    if (user.role === "agent") {
        return Boolean(request.assignedAgent) &&
            request.assignedAgent.toString() === user.userId.toString();
    }
    return ["manager", "admin"].includes(user.role);
};

const getAccessibleRequest = async (id, user) => {
    const request = await SupportRequest.findOne({
        _id: id,
        organization: user.organizationId
    });
    if (!request) return { error: "not-found" };
    if (!canAccessRequest(request, user)) return { error: "forbidden" };
    return { request };
};

const createResponse = async (req, res) => {
    try {
        const { message } = req.body;
        if (!message || !String(message).trim()) {
            return res.status(400).json({ message: "Message is required" });
        }

        const result = await getAccessibleRequest(req.params.id, req.user);
        if (result.error === "not-found") return res.status(404).json({ message: "Support request not found in your organization" });
        if (result.error === "forbidden") return res.status(403).json({ message: "Access denied" });

        const response = await Response.create({
            organization: req.user.organizationId,
            request: result.request._id,
            sender: req.user.userId,
            message: String(message).trim()
        });
        const populatedResponse = await Response.findById(response._id)
            .populate("sender", "name email role");
        return res.status(201).json({ message: "Response added successfully", response: populatedResponse });
    } catch (error) {
        console.error("Create response error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getResponses = async (req, res) => {
    try {
        const result = await getAccessibleRequest(req.params.id, req.user);
        if (result.error === "not-found") return res.status(404).json({ message: "Support request not found in your organization" });
        if (result.error === "forbidden") return res.status(403).json({ message: "Access denied" });

        const responses = await Response.find({
            request: result.request._id,
            organization: req.user.organizationId
        })
            .populate("sender", "name email role")
            .sort({ createdAt: 1 });
        return res.json(responses);
    } catch (error) {
        console.error("Get responses error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { createResponse, getResponses };
