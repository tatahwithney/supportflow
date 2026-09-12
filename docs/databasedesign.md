# SupportFlow Database Design

## Overview

SupportFlow uses MongoDB as its database and Mongoose as the Object Data Modeling (ODM) library for Node.js.

The system uses three main models:

* User
* SupportRequest
* Response

MongoDB Atlas is used for the production database.

## User Model

The `User` model stores customer and staff account information.

### Fields

| Field       | Type    | Description                             |
| ----------- | ------- | --------------------------------------- |
| `name`      | String  | User's name                             |
| `email`     | String  | Unique user email address               |
| `password`  | String  | Hashed user password                    |
| `role`      | String  | User's system role                      |
| `isActive`  | Boolean | Indicates whether the account is active |
| `createdAt` | Date    | Automatically created timestamp         |
| `updatedAt` | Date    | Automatically updated timestamp         |

### Roles

The supported roles are:

* `customer`
* `agent`
* `manager`
* `admin`

New users registered through the normal registration endpoint are assigned the `customer` role by default.

Staff registration supports the `agent` and `admin` roles and requires the configured staff registration key.

## Support Request Model

The `SupportRequest` model stores customer support tickets.

### Fields

| Field           | Type     | Description                                       |
| --------------- | -------- | ------------------------------------------------- |
| `title`         | String   | Short title of the support request                |
| `description`   | String   | Detailed description of the issue                 |
| `customer`      | ObjectId | Reference to the customer who created the request |
| `assignedAgent` | ObjectId | Reference to the assigned support agent           |
| `status`        | String   | Current state of the request                      |
| `priority`      | String   | Priority level of the request                     |
| `category`      | String   | Support request category                          |
| `createdAt`     | Date     | Automatically created timestamp                   |
| `updatedAt`     | Date     | Automatically updated timestamp                   |

### Request Statuses

* `open`
* `in-progress`
* `resolved`
* `closed`

### Request Priorities

* `low`
* `medium`
* `high`
* `urgent`

The default request status is `open`, while the default priority is `medium`.

## Response Model

The `Response` model stores messages associated with support requests.

### Fields

| Field       | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `request`   | ObjectId | Reference to the related support request    |
| `sender`    | ObjectId | Reference to the user who sent the response |
| `message`   | String   | Response content                            |
| `createdAt` | Date     | Automatically created timestamp             |
| `updatedAt` | Date     | Automatically updated timestamp             |

## Relationships

The models use MongoDB ObjectId references to connect related records.

```text
User
 │
 ├── creates ──→ SupportRequest
 │                  │
 │                  ├── assignedAgent ──→ User
 │                  │
 │                  └── has many ──→ Response
 │                                      │
 │                                      └── sender ──→ User
```

### Relationship Summary

* One customer can create multiple support requests.
* Each support request belongs to one customer.
* A support request can be assigned to one support agent.
* One support agent can be assigned multiple support requests.
* A support request can have multiple responses.
* Each response belongs to one support request.
* Each response is associated with the user who sent it.

## Data Validation

Mongoose schema validation is used for required fields and controlled values.

Examples include:

* Required user name, email, and password.
* Unique user email addresses.
* Restricted user roles.
* Restricted request statuses.
* Restricted request priorities.
* Required support request category.
* Required response message.

User passwords are hashed before storage and are not returned in user API responses.

## Database Environment

### Development

The application can connect to a local MongoDB database during development.

```text
mongodb://127.0.0.1:27017/supportflow
```

### Production

The deployed application uses MongoDB Atlas through the `MONGO_URI` environment variable.

Sensitive database credentials are not stored in the source code.
