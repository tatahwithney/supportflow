const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: "customer"
        });

        res.status(201).json({
            message: "Customer account created successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Registration error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const registerStaff = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            role,
            registrationKey
        } = req.body;

        if (!name || !email || !password || !role || !registrationKey) {
            return res.status(400).json({
                message:
                    "Name, email, password, role and registration key are required"
            });
        }

        if (!["agent", "admin"].includes(role)) {
            return res.status(400).json({
                message: "Invalid staff role"
            });
        }

        if (
            registrationKey !==
            process.env.STAFF_REGISTRATION_KEY
        ) {
            return res.status(403).json({
                message: "Invalid staff registration key"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email is already registered"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role
        });

        res.status(201).json({
            message: `${role} account created successfully`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Staff registration error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (!user.isActive) {
            return res.status(403).json({
                message: "This account is inactive"
            });
        }

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        if (role && user.role !== role) {
            return res.status(403).json({
                message:
                    `This account is registered as ${user.role}. ` +
                    "Please use the correct login portal."
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    registerUser,
    registerStaff,
    loginUser
};