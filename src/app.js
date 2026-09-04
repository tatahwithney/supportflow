const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 3000;

const authRoutes = require("./routes/auth-routes");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "SupportFlow API is running"
    });
});

app.use("/api/auth", authRoutes)

const startServer = async () => {
    await connectDB();

    app.listen(PORT, () => {
        console.log(`SupportFlow server running on port ${PORT}`);
    });
};

startServer();