const express = require("express");

const {
    createRequest,
    getRequests,
    getRequestById,
    updateRequest,
    deleteRequest,
    assignAgent,
    updateRequestStatus
} = require("../controllers/support-request-controller");

const authenticateUser = require("../middleware/auth-middleware");
const authorizeRoles = require("../middleware/role-middleware");

const router = express.Router();

router.post(
    "/",
    authenticateUser,
    authorizeRoles("customer"),
    createRequest
);

router.get(
    "/",
    authenticateUser,
    authorizeRoles("customer", "agent", "manager", "admin"),
    getRequests
);

router.put(
    "/:id/assign",
    authenticateUser,
    authorizeRoles("manager", "admin"),
    assignAgent
);

router.put(
    "/:id/status",
    authenticateUser,
    authorizeRoles("agent", "manager", "admin"),
    updateRequestStatus
);

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("customer", "agent", "manager", "admin"),
    getRequestById
);

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("customer", "agent", "manager", "admin"),
    updateRequest
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("manager", "admin"),
    deleteRequest
);

module.exports = router;