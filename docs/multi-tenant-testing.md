# Multi-Tenant Verification Checklist

This is the manual integration checklist for local and deployed testing. The static tests in `tests/multi-tenant-guards.test.js` check source-code safeguards; they do not replace these end-to-end tests.

## 1. Organization Registration

- [ ] Register Organization A and confirm it creates an organization and first `admin` account.
- [ ] Record Organization A's slug.
- [ ] Register Organization B with a different slug and administrator.
- [ ] Confirm duplicate organization slugs are rejected.
- [ ] Confirm public staff registration cannot create an `admin`.

## 2. Authentication and Registration

- [ ] Register one customer in each organization using its slug.
- [ ] Register one agent in each organization using the matching slug and staff key.
- [ ] Log in as each user and confirm the JWT contains the correct organization ID.
- [ ] Confirm missing/invalid organization slugs are rejected.
- [ ] Confirm old JWTs without an organization ID are rejected and users can log in again.

## 3. Tenant Isolation

- [ ] Create requests in both organizations.
- [ ] Confirm Organization A's administrator can list only Organization A's users and requests.
- [ ] Confirm Organization B's administrator can list only Organization B's users and requests.
- [ ] Attempt to read, update, close, or respond to a request ID from the other organization; expect no access.
- [ ] Attempt to read/update/deactivate a user from the other organization; expect no access.
- [ ] Attempt to assign an agent from another organization; expect the assignment to be rejected.
- [ ] Confirm responses are visible only to users who can access the request in the same organization.

## 4. Existing Data and Deployment

- [ ] Back up MongoDB Atlas before deploying.
- [ ] Review startup logs for legacy tenant migration, if required.
- [ ] Confirm existing users/requests/responses have an organization reference after migration.
- [ ] Confirm the `/health` endpoint returns HTTP 200.
- [ ] Repeat the cross-tenant checks against the deployed application.

## Result Recording

Record the date, environment (local/production), account roles used, expected result, actual result, and any issue found. Do not mark the release verified until the full tenant-isolation checklist has passed.
