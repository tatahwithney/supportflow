const express = require("express");

const {
    getUsers,
    getUserById
} = require("../controllers/user-controller");

const authenticateUser = require("../middleware/auth-middleware");
const authorizeRoles = require("../middleware/role-middleware");

const router = express.Router();

router.get(
    "/",
    authenticateUser,
    authorizeRoles("admin", "manager"),
    getUsers
);

router.get(
    "/:id",
    authenticateUser,
    authorizeRoles("admin", "manager"),
    getUserById
);

module.exports = router;