const express = require("express");
require("dotenv").config();

console.log("JWT_SECRET loaded:", process.env.JWT_SECRET ? "YES" : "NO");

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");

const authorizeRoles = require("./middleware/role-middleware");
const authenticateUser = require("./middleware/auth-middleware");

const path = require("path");

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home route
app.get("/", (req, res) => {
    res.render("home");
});

// Health check
app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "SupportFlow API is running"
    });
});

// Authentication routes
app.use("/api/auth", authRoutes);

// User management routes
app.use("/api/users", userRoutes);

// Temporary RBAC test route
app.get(
    "/api/admin-test",
    authenticateUser,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Admin access granted"
        });
    }
);

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`SupportFlow server running on port ${PORT}`);
    });
};

startServer();