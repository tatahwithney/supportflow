const bcrypt = require("bcryptjs");
const User = require("../models/user");

const tenantUserFilter = (req) => ({ organization: req.user.organizationId });

const getUsers = async (req, res) => {
    try {
        const users = await User.find(tenantUserFilter(req))
            .select("-password")
            .sort({ createdAt: -1 });
        return res.json(users);
    } catch (error) {
        console.error("Get users error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        }).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found in your organization" });
        }
        return res.json(user);
    } catch (error) {
        console.error("Get user error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

const updateUser = async (req, res) => {
    try {
        const { name, email, password, role, isActive } = req.body;
        const user = await User.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        });

        if (!user) {
            return res.status(404).json({ message: "User not found in your organization" });
        }
        if (req.user.role === "manager" && ["admin", "manager"].includes(user.role)) {
            return res.status(403).json({ message: "Managers cannot modify administrator or manager accounts" });
        }
        if (name !== undefined) {
            if (!String(name).trim()) return res.status(400).json({ message: "Name cannot be empty" });
            user.name = String(name).trim();
        }
        if (email !== undefined) {
            if (!String(email).trim()) return res.status(400).json({ message: "Email cannot be empty" });
            user.email = String(email).trim().toLowerCase();
        }
        if (password !== undefined) {
            if (String(password).length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });
            user.password = await bcrypt.hash(password, 10);
        }
        if (role !== undefined) {
            if (req.user.role !== "admin") {
                return res.status(403).json({ message: "Only organization administrators can change user roles" });
            }
            if (!["customer", "agent", "manager", "admin"].includes(role)) {
                return res.status(400).json({ message: "Invalid user role" });
            }
            if (user._id.toString() === req.user.userId) {
                return res.status(400).json({ message: "You cannot change your own role" });
            }
            user.role = role;
        }
        if (isActive !== undefined) {
            if (typeof isActive !== "boolean") {
                return res.status(400).json({ message: "isActive must be a boolean" });
            }
            if (user._id.toString() === req.user.userId && isActive === false) {
                return res.status(400).json({ message: "You cannot deactivate your own account" });
            }
            user.isActive = isActive;
        }

        await user.save();
        return res.json({
            message: "User updated successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                organization: user.organization,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error("Update user error:", error.message);
        if (error.code === 11000) return res.status(409).json({ message: "Email is already registered" });
        return res.status(500).json({ message: "Server error" });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            _id: req.params.id,
            organization: req.user.organizationId
        });
        if (!user) {
            return res.status(404).json({ message: "User not found in your organization" });
        }
        if (user._id.toString() === req.user.userId) {
            return res.status(400).json({ message: "You cannot deactivate your own account" });
        }
        if (req.user.role === "manager" && ["admin", "manager"].includes(user.role)) {
            return res.status(403).json({ message: "Managers cannot deactivate administrator or manager accounts" });
        }

        user.isActive = false;
        await user.save();
        return res.json({ message: "User deactivated successfully" });
    } catch (error) {
        console.error("Delete user error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };
