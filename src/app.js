const express = require("express");
require("dotenv").config();
const connectDB = require("./config/db");
const migrateLegacyTenantData = require("./config/tenant-migration");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const authRoutes = require("./routes/auth-routes");
const userRoutes = require("./routes/user-routes");
const supportRequestRoutes = require("./routes/support-request-routes");
const responseRoutes = require("./routes/response-routes");
const organizationRoutes = require("./routes/organization-routes");

app.get("/", (req, res) => res.render("home"));
app.get("/login", (req, res) => res.redirect("/customer/login"));
app.get("/register", (req, res) => res.redirect("/customer/register"));
app.get("/customer/login", (req, res) => res.render("auth/customer-login"));
app.get("/customer/register", (req, res) => res.render("auth/customer-register"));
app.get("/staff/login", (req, res) => res.render("auth/staff-login"));
app.get("/staff/register", (req, res) => res.render("auth/staff-register"));
app.get("/organizations/register", (req, res) => res.render("auth/organization-register"));
app.get("/customer/dashboard", (req, res) => res.render("customer/dashboard"));
app.get("/agent/dashboard", (req, res) => res.render("agent/dashboard"));
app.get("/admin/dashboard", (req, res) => res.render("admin/dashboard"));
app.get("/admin/users", (req, res) => res.render("admin/users"));
app.get("/admin/requests", (req, res) => res.render("admin/requests"));
app.get("/customer/request/new", (req, res) => res.render("customer/request-form"));
app.get("/customer/requests/:id", (req, res) => res.render("customer/request-details", { requestId: req.params.id }));
app.get("/agent/requests/:id", (req, res) => res.render("agent/request-details", { requestId: req.params.id }));

app.get("/privacy", (req, res) => res.render("legal/privacy"));
app.get("/terms", (req, res) => res.render("legal/terms"));
app.get("/about", (req, res) => res.render("legal/about"));
app.get("/contact", (req, res) => res.render("legal/contact"));
app.get("/help", (req, res) => res.render("legal/help"));

app.get("/health", (req, res) => {
    res.json({ status: "OK", message: "SupportFlow API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/organizations", organizationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", supportRequestRoutes);
app.use("/api/requests", responseRoutes);

app.use((req, res) => {
    if (req.path.startsWith("/api")) {
        return res.status(404).json({ message: "Route not found" });
    }

    res.status(404).render("errors/404");
});

const startServer = async () => {
    try {
        if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
            throw new Error("MONGO_URI and JWT_SECRET environment variables are required");
        }
        await connectDB();
        await migrateLegacyTenantData();
        app.listen(PORT, () => console.log(`SupportFlow server running on port ${PORT}`));
    } catch (error) {
        console.error("Unable to start SupportFlow:", error.message);
        process.exit(1);
    }
};

if (require.main === module) {
    startServer();
}

module.exports = app;
