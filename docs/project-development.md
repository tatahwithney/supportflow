# SupportFlow Development Log

## Project Setup

### Objective

Initialize the SupportFlow Node.js project and establish the foundation for development.

### Completed

- Created the SupportFlow Node.js project.
- Initialized npm.
- Installed Express.js.
- Installed EJS for server-side rendering.
- Installed Mongoose for MongoDB interaction.
- Installed dotenv for environment configuration.
- Installed bcryptjs for password hashing.
- Installed jsonwebtoken for authentication.
- Installed Nodemon as a development dependency.
- Created the initial MVC-oriented project structure.
- Created the documentation directory.
- Initialized Git for version control.
- Prepared the project for GitHub and Render deployment.

### Technology Stack

Node.js, Express.js, EJS, MongoDB, Mongoose, JavaScript, REST API, JWT, bcrypt, Git/GitHub and Render.

### Status

Initial project setup completed.

## Database Design

### Objective

Define the main MongoDB collections and their relationships before implementing the Mongoose models.

### Core Collections

#### Users

Stores customer, support agent, manager, and administrator accounts.

Main fields:

- name
- email
- password
- role
- isActive
- timestamps

User roles:

- customer
- agent
- manager
- admin

#### Support Requests

Stores customer support requests/tickets.

Main fields:

- title
- description
- customer
- assignedAgent
- status
- priority
- category
- timestamps

Request statuses:

- open
- in-progress
- resolved
- closed

Request priorities:

- low
- medium
- high
- urgent

#### Responses

Stores responses and messages related to support requests.

Main fields:

- request
- sender
- message
- timestamps

### Relationships

- A customer can create multiple support requests.
- A support request belongs to one customer.
- A support request can be assigned to a support agent.
- A support request can have multiple responses.
- Each response belongs to a support request and a user.

### Status

Database design completed. Mongoose models will be implemented next.

## Mongoose Models

### Completed

Implemented the three core Mongoose models:

- User model for system users and role management.
- Support Request model for customer support tickets.
- Response model for ticket conversations and history.

### Relationships

- Support requests reference customers and assigned agents through User IDs.
- Responses reference their support request and the user who sent the response.
- Mongoose references will allow related data to be retrieved using population.

### Status

Core Mongoose models implemented and verified.


## API Requirements

### Authentication and User APIs

- POST /api/auth/register
- POST /api/auth/login
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Support Request APIs

- POST /api/requests
- GET /api/requests
- GET /api/requests/:id
- PUT /api/requests/:id
- DELETE /api/requests/:id

### Response APIs

- POST /api/requests/:id/responses
- GET /api/requests/:id/responses

### Status

Initial API requirements defined. Authentication, authorization, controllers, and routes will be implemented next.

## Authentication and Authorization

### Completed

Implemented JWT-based authentication and role-based authorization.

* Added customer registration.
* Added staff registration for agents and administrators.
* Added login for users.
* Passwords are hashed using bcryptjs.
* JWT tokens are generated after successful login.
* Added authentication middleware to verify JWT tokens.
* Added role-based authorization middleware.
* Added account status checking for inactive users.
* Added role validation for customer, agent, manager, and admin accounts.
* Added a staff registration key through environment variables to restrict staff account creation.

### Status

Authentication and authorization implemented and tested.

## User Management

### Completed

Implemented user management functionality for administrators and managers.

* Retrieve all users.
* Retrieve a specific user.
* Update user information.
* Update passwords securely.
* Administrators can manage user roles.
* Users can be deactivated without permanently deleting their records.
* User passwords are excluded from API responses.

### Status

User management API implemented and protected using authentication and role authorization.

## Support Request Management

### Completed

Implemented support request management and access control.

* Customers can create support requests.
* Customers can view their own requests.
* Support agents can view requests assigned to them.
* Managers and administrators can view all requests.
* Requests can be updated.
* Requests can be closed through the delete operation.
* Support requests can be assigned to active support agents.
* Request status can be updated.
* Request priority and category are supported.
* Access checks prevent users from viewing or modifying requests outside their permitted role or ownership.

### Status

Core support request management functionality implemented and tested.

## Response and Ticket History

### Completed

Implemented responses for support requests.

* Users with access to a request can add responses.
* Responses are linked to the support request and the sender.
* Response history can be retrieved.
* Sender information is populated when retrieving responses.
* Responses are stored in chronological order.

### Status

Response creation and ticket history tested successfully.

## API Testing and Security Verification

### Completed

Tested the main authentication, authorization, user, request, and response endpoints.

Verified:

* Successful customer registration.
* Successful login and JWT generation.
* Invalid and expired JWT rejection.
* Unauthorized requests return HTTP 401.
* Users without the required role receive HTTP 403.
* Customer access is restricted to their own support requests.
* Protected user management routes require appropriate roles.
* Support request creation is restricted to customers.
* Response creation and retrieval work correctly.

### Status

Core API functionality and access control verified.

## Frontend and EJS Views

### Completed

Implemented server-rendered EJS pages for the main user roles.

### Customer Interface

* Customer login.
* Customer registration.
* Customer dashboard.
* Support request creation form.
* Support request details and response history.

### Agent Interface

* Staff login.
* Agent dashboard.
* Assigned support request details.
* Request response and status management.

### Administrator Interface

* Administrator dashboard.
* User management page.
* Support request management page.
* Agent assignment.
* Request status management.
* User status and role management.

### Additional Frontend Work

* Added shared header, footer, and HTML head partials.
* Added role-aware navigation.
* Added client-side authentication handling.
* Added logout functionality.
* Added shared CSS styling.
* Added unauthorized-session handling.

### Status

Role-specific frontend interfaces implemented and connected to the backend APIs.

## MongoDB Atlas Configuration

### Completed

Configured MongoDB Atlas for production database hosting.

* Created a MongoDB Atlas cluster.
* Created a database user.
* Configured the SupportFlow database connection.
* Updated the MongoDB connection URI to use the `supportflow` database.
* Verified that the application connects successfully to MongoDB Atlas.
* Verified that application data is stored in the `supportflow` database.

The local development environment can continue using MongoDB, while the deployed application uses MongoDB Atlas.

### Status

MongoDB Atlas connection successfully tested.

## Environment Configuration

### Completed

Moved sensitive configuration values into environment variables.

Configured:

* `MONGO_URI`
* `JWT_SECRET`
* `STAFF_REGISTRATION_KEY`
* `PORT`

The `.env` file is excluded from Git using `.gitignore`, while `.env.example` provides the required environment variable structure without exposing actual credentials.

### Status

Environment configuration prepared for deployment.

## Git and GitHub

### Completed

Prepared the project for remote version control and deployment.

* Initialized Git.
* Added project files to the repository.
* Added `.gitignore` rules for environment files and generated files.
* Created the GitHub repository.
* Connected the local project to GitHub.
* Committed the completed development work.
* Pushed the project to GitHub.

GitHub repository:

`tatahwithney/supportflow`

### Status

Source code available on GitHub and prepared for deployment.

## Render Deployment

### Completed

Started deployment of SupportFlow as a Node.js web service on Render.

Deployment configuration:

* Service type: Web Service
* Repository: `tatahwithney/supportflow`
* Live url: `https://supportflow-qj5w.onrender.com/`
* Branch: `main`
* Build command: `npm install`
* Start command: `npm start`
* Health check path: `/health`

Production environment variables were configured in Render, including the MongoDB Atlas connection and authentication secrets.

### Deployment Verification

The initial Render build completed successfully and the application started successfully.

The deployment logs confirmed:

* GitHub repository was cloned successfully.
* Dependencies were installed successfully.
* Build completed without vulnerabilities.
* `npm start` launched the Express application.
* MongoDB Atlas connection was successful.

The first deployment attempt experienced a timeout related to Render's service port detection. A subsequent restart detected the running service on port `3000`, and deployment troubleshooting is ongoing.

### Status

Render deployment in progress. Final production URL and live application testing remain to be completed.

## Current Development Status

The SupportFlow MVP has progressed from initial project setup to a functional backend and role-based web interface.

Completed areas include:

* Project architecture.
* Database design.
* Mongoose models.
* REST APIs.
* Authentication.
* JWT authorization.
* Role-based access control.
* User management.
* Support request management.
* Support responses and ticket history.
* EJS frontend interfaces.
* API testing.
* MongoDB Atlas configuration.
* Git/GitHub version control.
* Render deployment setup.

### Next Steps

* Complete Render deployment.
* Verify the live `/health` endpoint.
* Test customer, agent, and administrator workflows on the deployed application.
* Fix any production-specific issues discovered during live testing.
* Confirm MongoDB Atlas production data flow.
* Complete final documentation.
* Prepare the application for the project presentation.

## Render Deployment

### Completed

Deployed SupportFlow as a Node.js web service on Render.

Deployment configuration:

* Service type: Web Service
* Repository: `tatahwithney/supportflow`
* Live URL: https://supportflow-qj5w.onrender.com/
* Branch: `main`
* Build command: `npm install`
* Start command: `npm start`
* Health check path: `/health`

Production environment variables were configured in Render, including the MongoDB Atlas connection and authentication secrets.

### Deployment Verification

The Render deployment completed successfully.

The deployment process confirmed:

* GitHub repository was cloned successfully.
* Project dependencies were installed successfully.
* Build completed successfully with no reported vulnerabilities.
* `npm start` launched the Express application.
* MongoDB Atlas connection was established successfully.
* Render detected the running web service.
* The deployed application became accessible through the Render URL.

### Deployment Issue Resolved

The initial deployment attempt experienced a timeout during Render's service port detection.

The application subsequently restarted successfully and Render detected the running service on port `3000`. The deployment was then completed successfully.

### Status

Render deployment completed successfully.

## Current Development Status

The SupportFlow MVP has been implemented, tested, and successfully deployed.

Completed areas include:

* Project architecture and MVC structure.
* Database design and Mongoose models.
* REST API development.
* JWT authentication.
* Password hashing with bcryptjs.
* Role-based access control.
* User management.
* Support request management.
* Request assignment and status management.
* Support responses and ticket history.
* Role-specific EJS interfaces.
* API testing and security verification.
* MongoDB Atlas production database configuration.
* Environment variable configuration.
* Git/GitHub version control.
* Render deployment.

### Production Architecture

```text
User Browser
     ↓
Render
     ↓
Express.js / EJS
     ↓
Mongoose
     ↓
MongoDB Atlas
```

### Current Status

The SupportFlow MVP is deployed and available through the Render production URL: `https://supportflow-qj5w.onrender.com/`

## Final Documentation

The main project documentation has been prepared to cover:

* Database design
* API endpoints and usage
* Deployment configuration and process
* Chronological project development

Documentation files are located in the `docs/` directory.

## Remaining Work

* Complete final project presentation preparation.
* Record any final improvements or production issues discovered during live use.
* Maintain the deployed application and documentation as required.

