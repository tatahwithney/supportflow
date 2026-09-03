const User = require("./models/user");
const SupportRequest = require("./models/support-request");
const Response = require("./models/response");

console.log("User model loaded:", User.modelName);
console.log("SupportRequest model loaded:", SupportRequest.modelName);
console.log("Response model loaded:", Response.modelName);