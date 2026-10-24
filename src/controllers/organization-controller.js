const bcrypt = require("bcryptjs");
const Organization = require("../models/organization");
const User = require("../models/user");

const makeSlug = (value) => String(value)
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const registerOrganization = async (req, res) => {
    let createdOrganization;
    try {
        const { organizationName, organizationSlug, contactEmail, adminName, adminEmail, password } = req.body;
        if (!organizationName || !contactEmail || !adminName || !adminEmail || !password) {
            return res.status(400).json({
                message: "Organization name, contact email, administrator name/email and password are required"
            });
        }
        if (String(password).length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const slug = makeSlug(organizationSlug || organizationName);
        if (!slug) {
            return res.status(400).json({ message: "A valid organization slug could not be created" });
        }

        const normalizedAdminEmail = String(adminEmail).trim().toLowerCase();
        const normalizedContactEmail = String(contactEmail).trim().toLowerCase();

        if (await Organization.findOne({ slug })) {
            return res.status(409).json({ message: "Organization slug is already in use" });
        }
        if (await User.findOne({ email: normalizedAdminEmail })) {
            return res.status(409).json({ message: "Administrator email is already registered" });
        }

        createdOrganization = await Organization.create({
            name: String(organizationName).trim(),
            slug,
            contactEmail: normalizedContactEmail
        });

        const admin = await User.create({
            name: String(adminName).trim(),
            email: normalizedAdminEmail,
            password: await bcrypt.hash(password, 10),
            role: "admin",
            organization: createdOrganization._id
        });

        return res.status(201).json({
            message: "Organization and administrator account created successfully",
            organization: {
                id: createdOrganization._id,
                name: createdOrganization.name,
                slug: createdOrganization.slug,
                contactEmail: createdOrganization.contactEmail
            },
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        if (createdOrganization) {
            await Organization.deleteOne({ _id: createdOrganization._id }).catch(() => {});
        }
        console.error("Organization registration error:", error.message);
        if (error.code === 11000) {
            return res.status(409).json({ message: "Organization slug or email is already in use" });
        }
        return res.status(500).json({ message: "Server error" });
    }
};

const getMyOrganization = async (req, res) => {
    const organization = await Organization.findById(req.user.organizationId)
        .select("name slug contactEmail isActive createdAt updatedAt");
    if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
    }
    return res.json(organization);
};

const updateMyOrganization = async (req, res) => {
    try {
        const { name, contactEmail } = req.body;
        const organization = await Organization.findById(req.user.organizationId);
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        if (name !== undefined) {
            if (!String(name).trim()) {
                return res.status(400).json({ message: "Organization name cannot be empty" });
            }
            organization.name = String(name).trim();
        }
        if (contactEmail !== undefined) {
            if (!String(contactEmail).trim()) {
                return res.status(400).json({ message: "Contact email cannot be empty" });
            }
            organization.contactEmail = String(contactEmail).trim().toLowerCase();
        }
        await organization.save();
        return res.json({
            message: "Organization updated successfully",
            organization: {
                id: organization._id,
                name: organization.name,
                slug: organization.slug,
                contactEmail: organization.contactEmail
            }
        });
    } catch (error) {
        console.error("Update organization error:", error.message);
        return res.status(500).json({ message: "Server error" });
    }
};

module.exports = { registerOrganization, getMyOrganization, updateMyOrganization };
