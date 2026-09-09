const User = require("../models/user");

const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password");

        res.json(users);
    } catch (error) {
        console.error("Get users error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);
    } catch (error) {
        console.error("Get user error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    getUsers,
    getUserById
};