const express = require("express");

const {
    registerUser,
    registerStaff,
    loginUser
} = require("../controllers/auth-controller");

const router = express.Router();

router.post("/register", registerUser);

router.post("/staff/register", registerStaff);

router.post("/login", loginUser);

module.exports = router;