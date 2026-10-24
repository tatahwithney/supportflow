const Organization = require("./src/models/organization");
const User = require("./src/models/user");
const SupportRequest = require("./src/models/support-request");
const Response = require("./src/models/response");

console.log("Organization model loaded:", Organization.modelName);
console.log("User model loaded:", User.modelName);
console.log("SupportRequest model loaded:", SupportRequest.modelName);
console.log("Response model loaded:", Response.modelName);
