const bcrypt = require("bcryptjs");
const User = require("../models/user");

const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(users);
    } catch (error) {
        console.error(
            "Get users error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user =
            await User.findById(
                req.params.id
            ).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        console.error(
            "Get user error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            isActive
        } = req.body;

        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (name !== undefined) {
            user.name = name;
        }

        if (email !== undefined) {
            user.email =
                email.trim().toLowerCase();
        }

        if (password !== undefined) {
            user.password =
                await bcrypt.hash(
                    password,
                    10
                );
        }

        if (role !== undefined) {
            if (req.user.role !== "admin") {
                return res.status(403).json({
                    message:
                        "Only administrators can change user roles"
                });
            }

            const allowedRoles = [
                "customer",
                "agent",
                "manager",
                "admin"
            ];

            if (!allowedRoles.includes(role)) {
                return res.status(400).json({
                    message: "Invalid user role"
                });
            }

            user.role = role;
        }

        if (isActive !== undefined) {
            user.isActive = isActive;
        }

        await user.save();

        res.json({
            message:
                "User updated successfully",

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isActive: user.isActive
            }
        });
    } catch (error) {
        console.error(
            "Update user error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user =
            await User.findById(
                req.params.id
            );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isActive = false;

        await user.save();

        res.json({
            message:
                "User deactivated successfully"
        });
    } catch (error) {
        console.error(
            "Delete user error:",
            error.message
        );

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
};