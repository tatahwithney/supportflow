# SupportFlow API Documentation

## Authentication

Protected requests require:

```text
Authorization: Bearer <JWT>
```

The signed token contains `userId`, `role`, and `organizationId`. Protected API queries are scoped to the token's organization.

## Organization Endpoints

### Register an Organization

`POST /api/organizations/register` — public.

```json
{
  "organizationName": "Acme Support",
  "organizationSlug": "acme-support",
  "contactEmail": "support@acme.example",
  "adminName": "Organization Admin",
  "adminEmail": "admin@acme.example",
  "password": "replace-with-a-strong-password"
}
```

`organizationSlug` is optional; when omitted, it is generated from the organization name. The response includes the new organization's slug and first administrator. Save the slug because customers and staff use it during registration.

### Get Current Organization

`GET /api/organizations/me` — any authenticated user.

### Update Current Organization

`PATCH /api/organizations/me` — organization administrator only. Accepts `name` and/or `contactEmail`.

## Authentication Endpoints

### Register Customer

`POST /api/auth/register` — public.

```json
{
  "organizationSlug": "acme-support",
  "name": "Customer Name",
  "email": "customer@example.com",
  "password": "replace-with-a-strong-password"
}
```

### Register Staff

`POST /api/auth/staff/register` — public with a valid `STAFF_REGISTRATION_KEY`.

```json
{
  "organizationSlug": "acme-support",
  "name": "Support Agent",
  "email": "agent@example.com",
  "password": "replace-with-a-strong-password",
  "role": "agent",
  "registrationKey": "configured-staff-registration-key"
}
```

Public staff registration supports `agent` and `manager`; it cannot create organization administrators.

### Login

`POST /api/auth/login`

```json
{
  "email": "customer@example.com",
  "password": "replace-with-a-strong-password",
  "role": "customer"
}
```

The `role` field is optional but used by the web login forms to verify the correct portal. Successful login returns a JWT and basic user/organization details.

## User Endpoints

All user endpoints require authentication and the `admin` or `manager` role. They are scoped to the current organization.

- `GET /api/users` — list organization users without password hashes.
- `GET /api/users/:id` — get a user in the current organization.
- `PUT /api/users/:id` — update allowed profile fields; only organization administrators can change roles.
- `DELETE /api/users/:id` — deactivate a user in the current organization.

## Support Request Endpoints

- `POST /api/requests` — customer creates a request. Organization and customer IDs come from the authenticated token.
- `GET /api/requests` — customers see their own requests, agents see assigned requests, and managers/administrators see requests in their organization.
- `GET /api/requests/:id` — get an accessible request in the current organization.
- `PUT /api/requests/:id` — update allowed request fields after tenant and role checks.
- `DELETE /api/requests/:id` — manager/administrator closes a request.
- `PUT /api/requests/:id/assign` — manager/administrator assigns an active agent from the same organization.
- `PUT /api/requests/:id/status` — agent, manager, or administrator updates request status; agents can update only requests assigned to them.

## Response Endpoints

- `POST /api/requests/:id/responses` — add a response to a request the user can access.
- `GET /api/requests/:id/responses` — list responses for a request the user can access.

Responses are filtered by both request and organization. Passwords and secrets must never be included in API responses or source control.
