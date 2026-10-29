# SupportFlow

**SupportFlow** is a multi-tenant support management platform developed as the Skye8 backend internship capstone project. It allows multiple organizations to use one application while keeping organization users, support requests, and responses isolated by tenant.

## Live Application

https://supportflow-qj5w.onrender.com/

## Technology Stack

- Node.js and Express.js
- MongoDB and Mongoose
- EJS, HTML, CSS, and JavaScript
- JWT authentication and role-based authorization
- bcryptjs password hashing
- Git/GitHub and Render

## Multi-Tenant Design

Each organization has a unique slug and its own users and support data.

```text
SupportFlow
├── Organization A
│   ├── Organization Administrator / Manager
│   ├── Agents and Customers
│   └── Support Requests and Responses
├── Organization B
│   ├── Organization Administrator / Manager
│   ├── Agents and Customers
│   └── Support Requests and Responses
└── Organization C
    └── Separate users and support data
```

Every user belongs to an organization. Every support request and response stores an organization reference. Authenticated API queries use the organization ID carried in the signed JWT, and request, user, agent assignment, and response lookups are scoped to that organization.

## Roles

- **Customer:** Creates and tracks their own support requests and replies to accessible requests.
- **Agent:** Views requests assigned to them and updates their status or replies.
- **Manager:** Views and manages support operations within their organization.
- **Organization Administrator:** Manages organization users and requests, assigns agents, and updates organization details.

Organization registration creates the first organization administrator. Public staff registration is limited to agents and managers and requires the configured staff registration key. An organization slug is required when a customer or staff member registers.

## Features

- Organization registration and organization profile retrieval/update
- Organization-scoped customer and staff registration
- Password hashing and JWT authentication
- Role-based route authorization
- Organization-scoped user listing, lookup, updates, and deactivation
- Support request creation, listing, updates, assignment, and status changes
- Request responses and response history
- Tenant-aware authorization for request and response access
- EJS web interface and health endpoint
- Legacy single-tenant data migration to a `Legacy SupportFlow` organization on startup, when legacy records are found

## API Endpoints

### Organizations

```text
POST  /api/organizations/register
GET   /api/organizations/me
PATCH /api/organizations/me
```

`POST /api/organizations/register` accepts `organizationName`, optional `organizationSlug`, `contactEmail`, `adminName`, `adminEmail`, and `password`.

### Authentication

```text
POST /api/auth/register
POST /api/auth/staff/register
POST /api/auth/login
```

Customer registration accepts `organizationSlug`, `name`, `email`, and `password`. Staff registration accepts `organizationSlug`, `name`, `email`, `password`, `role` (`agent` or `manager`), and `registrationKey`.

### Users

```text
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

These endpoints are restricted to organization administrators and managers and operate only within the authenticated user's organization.

### Support Requests

```text
POST   /api/requests
GET    /api/requests
GET    /api/requests/:id
PUT    /api/requests/:id
DELETE /api/requests/:id
PUT    /api/requests/:id/assign
PUT    /api/requests/:id/status
```

### Responses

```text
POST /api/requests/:id/responses
GET  /api/requests/:id/responses
```

Protected endpoints require:

```text
Authorization: Bearer <JWT>
```

## Data Models

- **Organization:** name, unique slug, contact email, active status, timestamps.
- **User:** name, globally unique email, password hash, organization reference, role, active status, timestamps.
- **SupportRequest:** organization reference, title, description, customer, assigned agent, status, priority, category, timestamps.
- **Response:** organization reference, request, sender, message, timestamps.

The current implementation uses a globally unique user email address. This avoids duplicate identities across organizations while still isolating their application data.

## Environment Variables

Create a local `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_jwt_secret
STAFF_REGISTRATION_KEY=your_staff_registration_key
```

Never commit `.env` or share its values. `.env.example` should contain placeholders only.

## Run Locally

```bash
npm install
npm run dev
```

Production start command:

```bash
npm start
```

Open `http://localhost:3000`.

## Health Check

`GET /health`

```json
{
  "status": "OK",
  "message": "SupportFlow API is running"
}
```

## Database Migration Note

On startup, records created by the earlier single-tenant version that do not have an organization reference are assigned to a `Legacy SupportFlow` organization. New registration and creation flows assign organization references directly. Back up the production database before deploying schema changes, and verify the migration logs and tenant separation after deployment.

## Deployment

The application is configured for Render and MongoDB Atlas. Render environment variables must include `MONGO_URI`, `JWT_SECRET`, and `STAFF_REGISTRATION_KEY`. Do not commit production credentials.

## Project Structure

```text
supportflow/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── views/
│   ├── public/
│   └── app.js
├── docs/
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Current Scope and Future Work

The core multi-tenant boundary is implemented in the data models, registration flows, and API query patterns. Before final acceptance, verify the deployed database migration, cross-organization denial cases, registration flows, and role permissions with separate test organizations.

Potential future work includes subscription billing, organization invitations, email verification, notifications, attachments, analytics, and more advanced search/filtering.
