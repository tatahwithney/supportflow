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