const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("tenant data models require an organization reference", () => {
    for (const file of [
        "src/models/user.js",
        "src/models/support-request.js",
        "src/models/response.js"
    ]) {
        const source = read(file);
        assert.match(source, /organization:\s*\{/);
        assert.match(source, /required:\s*true/);
    }
});

test("JWT includes organization ID and authentication rejects tokens without it", () => {
    assert.match(read("src/controllers/auth-controller.js"), /organizationId:\s*user\.organization\._id\.toString\(\)/);
    assert.match(read("src/middleware/auth-middleware.js"), /!decoded\.organizationId/);
});

test("user management queries are scoped to the authenticated organization", () => {
    const source = read("src/controllers/user-controller.js");
    assert.match(source, /organization:\s*req\.user\.organizationId/);
    assert.match(source, /User\.find\(tenantUserFilter\(req\)\)/);
});

test("support request and response lookups enforce organization scope", () => {
    const requests = read("src/controllers/support-request-controller.js");
    const responses = read("src/controllers/response-controller.js");
    assert.match(requests, /organization:\s*req\.user\.organizationId/);
    assert.match(requests, /organization:\s*req\.user\.organizationId,\s*role:\s*"agent"/);
    assert.match(responses, /organization:\s*user\.organizationId/);
    assert.match(responses, /organization:\s*req\.user\.organizationId/);
});

test("public staff registration cannot create organization administrators", () => {
    const source = read("src/controllers/auth-controller.js");
    assert.match(source, /\["agent",\s*"manager"\]\.includes\(role\)/);
    assert.match(source, /Public staff registration is limited to agents and managers/);
});

test("legacy data migration assigns organization references to existing records", () => {
    const source = read("src/config/tenant-migration.js");
    assert.match(source, /slug:\s*"legacy-supportflow"/);
    assert.match(source, /User\.updateMany/);
    assert.match(source, /SupportRequest\.updateMany/);
    assert.match(source, /Response\.updateMany/);
});
