const express = require("express");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/health", (req, res) => {
    res.json({
        status: "OK",
        message: "SupportFlow API is running"
    });
});

app.listen(PORT, () => {
    console.log(`SupportFlow server running on port ${PORT}`);
});