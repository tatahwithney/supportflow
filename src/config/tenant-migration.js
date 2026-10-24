const Organization = require("../models/organization");
const User = require("../models/user");
const SupportRequest = require("../models/support-request");
const Response = require("../models/response");

// Keep existing single-tenant records available by placing them in a legacy tenant.
// New records must always be assigned an organization by their controller.
const migrateLegacyTenantData = async () => {
    const [users, requests, responses] = await Promise.all([
        User.countDocuments({ $or: [{ organization: null }, { organization: { $exists: false } }] }),
        SupportRequest.countDocuments({ $or: [{ organization: null }, { organization: { $exists: false } }] }),
        Response.countDocuments({ $or: [{ organization: null }, { organization: { $exists: false } }] })
    ]);

    if (!users && !requests && !responses) {
        return;
    }

    let legacyOrganization = await Organization.findOne({
        slug: "legacy-supportflow"
    });

    if (!legacyOrganization) {
        legacyOrganization = await Organization.create({
            name: "Legacy SupportFlow",
            slug: "legacy-supportflow",
            contactEmail: "legacy@supportflow.local",
            isActive: true
        });
    }

    await Promise.all([
        User.updateMany(
            { $or: [{ organization: null }, { organization: { $exists: false } }] },
            { $set: { organization: legacyOrganization._id } }
        ),
        SupportRequest.updateMany(
            { $or: [{ organization: null }, { organization: { $exists: false } }] },
            { $set: { organization: legacyOrganization._id } }
        ),
        Response.updateMany(
            { $or: [{ organization: null }, { organization: { $exists: false } }] },
            { $set: { organization: legacyOrganization._id } }
        )
    ]);

    console.log("Legacy SupportFlow data assigned to the legacy organization.");
};

module.exports = migrateLegacyTenantData;
