const express = require("express");
const {
    registerOrganization,
    getMyOrganization,
    updateMyOrganization
} = require("../controllers/organization-controller");
const authenticateUser = require("../middleware/auth-middleware");
const authorizeRoles = require("../middleware/role-middleware");

const router = express.Router();

router.post("/register", registerOrganization);
router.get("/me", authenticateUser, getMyOrganization);
router.patch("/me", authenticateUser, authorizeRoles("admin"), updateMyOrganization);

module.exports = router;
