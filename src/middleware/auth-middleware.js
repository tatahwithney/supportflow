const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;

        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = authenticateUser;

//curl http://localhost:3000/api/protected -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTlhYzYzNzdmZDcyOWU0NmI2MWQ5YzUiLCJyb2xlIjoiY3VzdG9tZXIiLCJpYXQiOjE3ODg4ODQxNDgsImV4cCI6MTc4ODk3MDU0OH0.UGKPc6lAMonrW9VKabMrjSZBInGST6ytgpo_FuLXfcc"
