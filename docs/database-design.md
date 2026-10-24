# SupportFlow Database Design

## Overview

SupportFlow uses MongoDB and Mongoose. The multi-tenant version has four primary models: `Organization`, `User`, `SupportRequest`, and `Response`.

## Organization

| Field | Type | Description |
|---|---|---|
| `name` | String | Organization display name |
| `slug` | String | Unique organization identifier used during registration |
| `contactEmail` | String | Organization contact address |
| `isActive` | Boolean | Whether the organization can be used |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

## User

| Field | Type | Description |
|---|---|---|
| `name` | String | User's name |
| `email` | String | Globally unique email address |
| `password` | String | bcryptjs password hash |
| `organization` | ObjectId | Required reference to the user's organization |
| `role` | String | `customer`, `agent`, `manager`, or `admin` |
| `isActive` | Boolean | Whether the account is active |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

An organization registration creates the first `admin` account. Public staff registration is restricted to `agent` and `manager` and requires the staff registration key. Customer and staff registration must include an organization slug.

## SupportRequest

| Field | Type | Description |
|---|---|---|
| `organization` | ObjectId | Required tenant reference |
| `title` | String | Short request title |
| `description` | String | Detailed issue description |
| `customer` | ObjectId | User who created the request |
| `assignedAgent` | ObjectId | Assigned agent, if any |
| `status` | String | `open`, `in-progress`, `resolved`, or `closed` |
| `priority` | String | `low`, `medium`, `high`, or `urgent` |
| `category` | String | Request category |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

An index on organization and creation time supports tenant-scoped listing.

## Response

| Field | Type | Description |
|---|---|---|
| `organization` | ObjectId | Required tenant reference |
| `request` | ObjectId | Related support request |
| `sender` | ObjectId | User who sent the response |
| `message` | String | Response content |
| `createdAt`, `updatedAt` | Date | Mongoose timestamps |

## Relationships

```text
Organization
 ├── has many Users
 ├── has many SupportRequests
 └── has many Responses

User
 ├── belongs to Organization
 ├── creates SupportRequests
 ├── may be assigned SupportRequests
 └── sends Responses

SupportRequest
 ├── belongs to Organization
 ├── belongs to a customer
 ├── may have an assigned agent
 └── has many Responses
```

## Tenant Isolation

Authenticated JWTs include the user ID, role, and organization ID. Controllers scope user, request, agent, and response queries by the authenticated organization. Access to a request is additionally checked by role: customers can access their own requests, agents can access assigned requests, and managers/administrators can access requests within their organization.

The organization ID is assigned by the server from the authenticated token or looked up by the supplied organization slug during registration. Clients cannot choose another organization ID when creating requests or responses.

## Legacy Data Migration

At application startup, records from the earlier single-tenant schema that lack an organization reference are assigned to a `Legacy SupportFlow` organization. Back up the production database before deployment and confirm migration logs and tenant data separation after deployment.

## Environment

Development may use a local MongoDB database. Production uses MongoDB Atlas through `MONGO_URI`. Credentials and secrets must remain outside source control.
