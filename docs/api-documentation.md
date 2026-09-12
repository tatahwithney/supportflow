# SupportFlow API Documentation

## Overview

SupportFlow provides a REST API for authentication, user management, support request management, and support request responses.

The API is implemented using Express.js and MongoDB/Mongoose.

Protected endpoints use JWT authentication.

## Authentication

Protected requests require a JWT in the `Authorization` header.

```text
Authorization: Bearer <token>
```

A valid token contains the authenticated user's ID and role.

## Authentication Endpoints

### Register Customer

```http
POST /api/auth/register
```

Creates a new customer account.

Example request:

```json
{
  "name": "Tatah Withney",
  "email": "customer@example.com",
  "password": "password123"
}
```

### Register Staff

```http
POST /api/auth/staff/register
```

Creates an agent or administrator account.

The request requires a valid staff registration key.

Example:

```json
{
  "name": "Support Agent",
  "email": "agent@example.com",
  "password": "password123",
  "role": "agent",
  "registrationKey": "your_staff_registration_key"
}
```

Supported staff roles:

* `agent`
* `admin`

### Login

```http
POST /api/auth/login
```

Authenticates a user and returns a JWT.

Example:

```json
{
  "email": "customer@example.com",
  "password": "password123",
  "role": "customer"
}
```

The `role` value is used to ensure the correct login portal is being used.

## User Endpoints

All user management endpoints require authentication.

### Get Users

```http
GET /api/users
```

Access:

* Admin
* Manager

Returns a list of users without exposing their passwords.

### Get User

```http
GET /api/users/:id
```

Access:

* Admin
* Manager

Returns information for a specific user.

### Update User

```http
PUT /api/users/:id
```

Access:

* Admin
* Manager

Updates user information.

Administrators can manage user roles.

### Deactivate User

```http
DELETE /api/users/:id
```

Access:

* Admin
* Manager

The endpoint deactivates the account rather than permanently deleting the user record.

## Support Request Endpoints

### Create Support Request

```http
POST /api/requests
```

Access:

* Customer

Example:

```json
{
  "title": "Unable to access account",
  "description": "I cannot log into my account.",
  "category": "Account",
  "priority": "high"
}
```

The authenticated customer's ID is automatically used as the request owner.

### Get Support Requests

```http
GET /api/requests
```

Access depends on the user's role.

* Customers see their own requests.
* Agents see requests assigned to them.
* Managers and administrators can view all requests.

### Get Support Request

```http
GET /api/requests/:id
```

Returns a specific support request if the authenticated user has permission to access it.

### Update Support Request

```http
PUT /api/requests/:id
```

Updates request information such as:

* title
* description
* category
* priority

Access is restricted according to the user's relationship to the request and role.

### Close Support Request

```http
DELETE /api/requests/:id
```

The request is closed by changing its status to `closed`.

### Assign Support Agent

```http
PUT /api/requests/:id/assign
```

Assigns an active support agent to a request.

Access:

* Admin
* Manager

Assigning an agent changes an open request to `in-progress`.

### Update Request Status

```http
PUT /api/requests/:id/status
```

Updates the status of a support request.

Supported statuses:

```text
open
in-progress
resolved
closed
```

Agents can update requests assigned to them, while managers and administrators can manage requests according to their permissions.

## Response Endpoints

### Add Response

```http
POST /api/requests/:id/responses
```

Adds a response to a support request.

Example:

```json
{
  "message": "I am following up on this support request."
}
```

The authenticated user is recorded as the sender.

### Get Responses

```http
GET /api/requests/:id/responses
```

Returns the response history for a support request.

Responses include sender information and are returned chronologically.

## HTTP Status Codes

Common responses include:

| Status | Meaning                                  |
| ------ | ---------------------------------------- |
| `200`  | Request completed successfully           |
| `201`  | Resource created successfully            |
| `400`  | Invalid or missing request data          |
| `401`  | Authentication required or token invalid |
| `403`  | User does not have permission            |
| `404`  | Resource not found                       |
| `409`  | Resource already exists                  |
| `500`  | Server error                             |

## Access Control

SupportFlow uses middleware to protect API routes.

### Authentication Middleware

Verifies the JWT supplied in the request.

Requests without a valid token are rejected with HTTP `401`.

### Role Authorization Middleware

Checks whether the authenticated user's role is permitted to access the requested operation.

Users attempting to access a restricted operation receive HTTP `403`.

## API Security

The API implements:

* JWT authentication.
* bcryptjs password hashing.
* Role-based authorization.
* Account active-status checks.
* Request ownership and assignment checks.
* Password exclusion from user responses.
* Environment variables for sensitive configuration.

## Base URL

### Local Development

```text
http://localhost:3000
```

### Production

```text
https://supportflow-qj5w.onrender.com
```

The production API endpoints use the same `/api/...` paths under the deployed application.

## Health Check

```http
GET /health
```

Expected response:

```json
{
  "status": "OK",
  "message": "SupportFlow API is running"
}
```
