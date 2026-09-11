const express = require("express");

const {
    createResponse,
    getResponses
} = require("../controllers/response-controller");

const authenticateUser = require("../middleware/auth-middleware");
const authorizeRoles = require("../middleware/role-middleware");

const router = express.Router();

router.post(
    "/:id/responses",
    authenticateUser,
    authorizeRoles("customer", "agent", "manager", "admin"),
    createResponse
);

router.get(
    "/:id/responses",
    authenticateUser,
    authorizeRoles("customer", "agent", "manager", "admin"),
    getResponses
);

module.exports = router;