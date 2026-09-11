const express = require("express");

const {
    getUsers,
    getUserById,
    updateUser,
    deleteUser
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

router.put(
    "/:id",
    authenticateUser,
    authorizeRoles("admin", "manager"),
    updateUser
);

router.delete(
    "/:id",
    authenticateUser,
    authorizeRoles("admin", "manager"),
    deleteUser
);

module.exports = router;