const SupportRequest = require("../models/support-request");
const User = require("../models/user");

const canAccessRequest = (request, user) => {
    if (request.organization.toString() !== user.organizationId.toString()) return false;

    if (user.role === "customer") {
        return request.customer.toString() === user.userId.toString();
    }
    if (user.role === "agent") {
        return Boolean(request.assignedAgent) &&
            request.assignedAgent.toString() === user.userId.toString();
    }
    return ["manager", "admin"].includes(user.role);
};

const createRequest = async (req, res) => {
    try {
        const { title, description, priority, category } = req.body;
        if (!title || !String(title).trim() ||
            !description || !String(description).trim() ||
            !category || !String(category).trim()) {
            return res.status(400).json({ message: "Title, description and category are required" });
        }
        if (priority !== undefined && !["low", "medium", "high", "urgent"].includes(priority)) {
            return res.status(400).json({ message: "Invalid priority" });
        }
        const request = await SupportRequest.create({
            title: String(title).trim(),
            description: String(description).trim(),
            customer: req.user.userId,
            organization: req.user.organizationId,
            priority: priority || "medium",
            category: String(category).trim()
        });
        return res.status(201).json({
            message: "Support request created successfully",
            request
        });
    } catch (error) {
        console.error("Create request error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getRequests = async (req, res) => {
    try {
        const query = { organization: req.user.organizationId };
        if (req.user.role === "customer") query.customer = req.user.userId;
        if (req.user.role === "agent") query.assignedAgent = req.user.userId;

        const requests = await SupportRequest.find(query)
            .populate("customer", "name email")
            .populate("assignedAgent", "name email")
            .sort({ createdAt: -1 });
        return res.json(requests);
    } catch (error) {
        console.error("Get requests error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getRequestById = async (req, res) => {
    try {
        const request = await SupportRequest.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        })
            .populate("customer", "name email")
            .populate("assignedAgent", "name email");
        if (!request) return res.status(404).json({ message: "Support request not found in your organization" });
        if (!canAccessRequest(request, req.user)) return res.status(403).json({ message: "Access denied" });
        return res.json(request);
    } catch (error) {
        console.error("Get request error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateRequest = async (req, res) => {
    try {
        const request = await SupportRequest.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        });
        if (!request) return res.status(404).json({ message: "Support request not found in your organization" });
        if (!canAccessRequest(request, req.user)) return res.status(403).json({ message: "Access denied" });

        if (req.body.title !== undefined) {
            if (!String(req.body.title).trim()) return res.status(400).json({ message: "Title cannot be empty" });
            request.title = String(req.body.title).trim();
        }
        if (req.body.description !== undefined) {
            if (!String(req.body.description).trim()) return res.status(400).json({ message: "Description cannot be empty" });
            request.description = String(req.body.description).trim();
        }
        if (req.body.category !== undefined) {
            if (!String(req.body.category).trim()) return res.status(400).json({ message: "Category cannot be empty" });
            request.category = String(req.body.category).trim();
        }
        if (req.body.priority !== undefined) {
            if (!["low", "medium", "high", "urgent"].includes(req.body.priority)) {
                return res.status(400).json({ message: "Invalid priority" });
            }
            request.priority = req.body.priority;
        }

        await request.save();
        return res.json({ message: "Support request updated successfully", request });
    } catch (error) {
        console.error("Update request error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteRequest = async (req, res) => {
    try {
        const request = await SupportRequest.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        });
        if (!request) return res.status(404).json({ message: "Support request not found in your organization" });

        request.status = "closed";
        await request.save();
        return res.json({ message: "Support request closed successfully" });
    } catch (error) {
        console.error("Close request error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const assignAgent = async (req, res) => {
    try {
        const { agentId } = req.body;
        if (!agentId) return res.status(400).json({ message: "Agent ID is required" });

        const [agent, request] = await Promise.all([
            User.findOne({
                _id: agentId,
                organization: req.user.organizationId,
                role: "agent",
                isActive: true
            }),
            SupportRequest.findOne({
                _id: req.params.id,
                organization: req.user.organizationId
            })
        ]);

        if (!agent) return res.status(404).json({ message: "Active support agent not found in your organization" });
        if (!request) return res.status(404).json({ message: "Support request not found in your organization" });

        request.assignedAgent = agent._id;
        if (request.status === "open") request.status = "in-progress";
        await request.save();

        const updatedRequest = await SupportRequest.findById(request._id)
            .populate("customer", "name email")
            .populate("assignedAgent", "name email");
        return res.json({ message: "Support request assigned successfully", request: updatedRequest });
    } catch (error) {
        console.error("Assign agent error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!["open", "in-progress", "resolved", "closed"].includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        const request = await SupportRequest.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        });
        if (!request) return res.status(404).json({ message: "Support request not found in your organization" });
        if (req.user.role === "agent" &&
            (!request.assignedAgent || request.assignedAgent.toString() !== req.user.userId.toString())) {
            return res.status(403).json({ message: "You can only update requests assigned to you" });
        }

        request.status = status;
        await request.save();
        return res.json({ message: "Support request status updated successfully", request });
    } catch (error) {
        console.error("Update status error:", error.message);
        return res.status(500).json({ message: "Server error" });
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
