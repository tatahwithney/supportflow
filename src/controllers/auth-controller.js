const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Organization = require("../models/organization");

const publicUser = (user, organization) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    organization: organization
        ? { id: organization._id, name: organization.name, slug: organization.slug }
        : undefined
});

const registerUser = async (req, res) => {
    try {
        const { name, email, password, organizationSlug } = req.body;

        if (!name || !email || !password || !organizationSlug) {
            return res.status(400).json({
                message: "Name, email, password and organization slug are required"
            });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const organization = await Organization.findOne({
            slug: String(organizationSlug).trim().toLowerCase(),
            isActive: true
        });
        if (!organization) {
            return res.status(404).json({ message: "Active organization not found. Check the organization slug." });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        if (await User.findOne({ email: normalizedEmail })) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: await bcrypt.hash(password, 10),
            role: "customer",
            organization: organization._id
        });

        return res.status(201).json({
            message: "Customer account created successfully",
            user: publicUser(user, organization)
        });
    } catch (error) {
        console.error("Registration error:", error.message);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email is already registered" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};

const registerStaff = async (req, res) => {
    try {
        const { name, email, password, role, registrationKey, organizationSlug } = req.body;

        if (!name || !email || !password || !role || !registrationKey || !organizationSlug) {
            return res.status(400).json({
                message: "Name, email, password, role, organization slug and registration key are required"
            });
        }

        // Public registration cannot create organization administrators.
        if (!["agent", "manager"].includes(role)) {
            return res.status(400).json({
                message: "Public staff registration is limited to agents and managers"
            });
        }
        if (!process.env.STAFF_REGISTRATION_KEY ||
            registrationKey !== process.env.STAFF_REGISTRATION_KEY) {
            return res.status(403).json({ message: "Invalid staff registration key" });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const organization = await Organization.findOne({
            slug: String(organizationSlug).trim().toLowerCase(),
            isActive: true
        });
        if (!organization) {
            return res.status(404).json({ message: "Active organization not found. Check the organization slug." });
        }

        const normalizedEmail = String(email).trim().toLowerCase();
        if (await User.findOne({ email: normalizedEmail })) {
            return res.status(409).json({ message: "Email is already registered" });
        }

        const user = await User.create({
            name: String(name).trim(),
            email: normalizedEmail,
            password: await bcrypt.hash(password, 10),
            role,
            organization: organization._id
        });

        return res.status(201).json({
            message: `${role} account created successfully`,
            user: publicUser(user, organization)
        });
    } catch (error) {
        console.error("Staff registration error:", error.message);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Email is already registered" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({
            email: String(email).trim().toLowerCase()
        }).populate("organization", "name slug isActive");

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (!user.isActive) {
            return res.status(403).json({ message: "This account is inactive" });
        }
        if (!user.organization || !user.organization.isActive) {
            return res.status(403).json({ message: "This organization is inactive or unavailable" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if (role && user.role !== role) {
            return res.status(403).json({
                message: `This account is registered as ${user.role}. Please use the correct login portal.`
            });
        }

        const token = jwt.sign(
            {
                userId: user._id.toString(),
                role: user.role,
                organizationId: user.organization._id.toString()
            },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        return res.json({
            message: "Login successful",
            token,
            user: publicUser(user, user.organization)
        });
    } catch (error) {
        console.error("Login error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerUser, registerStaff, loginUser };
