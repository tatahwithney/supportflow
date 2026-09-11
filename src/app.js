const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
// EJS configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");

const authorizeRoles = require("./middleware/role-middleware");
const authenticateUser = require("./middleware/auth-middleware");

const supportRequestRoutes = require("./routes/support-request-routes");

const responseRoutes = require("./routes/response-routes");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.redirect("/customer/login");
});

app.get("/register", (req, res) => {
    res.redirect("/customer/register");
});

app.get("/customer/login", (req, res) => {
    res.render("auth/customer-login");
});

app.get("/customer/register", (req, res) => {
    res.render("auth/customer-register");
});

app.get("/staff/login", (req, res) => {
    res.render("auth/staff-login");
});

app.get("/staff/register", (req, res) => {
    res.render("auth/staff-register");
});

app.get("/customer/dashboard", (req, res) => {
    res.render("customer/dashboard");
});

app.get("/agent/dashboard", (req, res) => {
    res.render("agent/dashboard");
});

app.get("/admin/dashboard", (req, res) => {
    res.render("admin/dashboard");
});

app.get("/admin/users", (req, res) => {
    res.render("admin/users");
});

app.get("/admin/requests", (req, res) => {
    res.render("admin/requests");
});

app.get("/customer/request/new", (req, res) => {
    res.render("customer/request-form");
});

app.get("/customer/requests/:id", (req, res) => {
    res.render("customer/request-details", {
        requestId: req.params.id
    });
});

app.get("/agent/requests/:id", (req, res) => {
    res.render("agent/request-details", {
        requestId: req.params.id
    });
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

//Support request routes
app.use("/api/requests", supportRequestRoutes);

//Support response requests
app.use("/api/requests", responseRoutes);

// Temporary RBAC test route
/*app.get(
    "/api/admin-test",
    authenticateUser,
    authorizeRoles("admin"),
    (req, res) => {
        res.json({
            message: "Admin access granted"
        });
    }
);*/

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`SupportFlow server running on port ${PORT}`);
    });
};

startServer();