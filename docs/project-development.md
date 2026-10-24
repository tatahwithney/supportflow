# SupportFlow Development Log

## Original MVP

The original single-organization SupportFlow MVP was developed with Node.js, Express.js, EJS, MongoDB/Mongoose, JWT, and bcryptjs. It included customer and staff authentication, role-based access, user management, support request workflows, request assignment/status changes, responses, a browser interface, API documentation, and deployment to Render with MongoDB Atlas.

The original MVP was deployed at `https://supportflow-qj5w.onrender.com/`. The multi-tenant changes below are a new release and must be deployed and verified separately.

## Multi-Tenant Upgrade

### Objective

Upgrade SupportFlow so multiple independent organizations can use one application while keeping their users, support requests, and responses isolated.

### Implemented in the source update

- Added an `Organization` model with a unique slug, contact email, and active status.
- Added organization references to the `User`, `SupportRequest`, and `Response` models.
- Added organization registration and automatic creation of the first organization administrator.
- Added organization slug requirements to customer and staff registration.
- Restricted public staff registration to agent and manager roles.
- Added organization ID to newly issued JWTs.
- Scoped user management queries to the authenticated organization.
- Scoped support request lookup/listing and agent assignment to the authenticated organization.
- Scoped response creation and history to the same organization as the request.
- Added a startup migration that assigns earlier records without an organization reference to a `Legacy SupportFlow` organization.
- Added an organization profile endpoint and administrator-only organization profile update.
- Added an organization registration page and updated registration forms.
- Updated README, database design, API documentation, and deployment notes.
- Added static regression tests and a manual end-to-end tenant isolation checklist.

## Verification Status

JavaScript syntax checks and six static source-guard tests have passed in the prepared source package. A full dependency install could not be completed in the packaging environment, so runtime/database integration tests have not been run here. Because the upgrade changes production data and token contents, the database migration and cross-tenant workflows must also be tested with two separate organizations before the release is considered complete.

The current code changes are not confirmed as deployed to Render. Deployment should follow a database backup and code review. Do not record successful production tenant-isolation testing until the manual checklist in `docs/multi-tenant-testing.md` has passed.

## Release Steps

1. Review the source changes and `.env.example`; never include `.env` or credentials.
2. Run `npm ci`, `npm test`, and JavaScript syntax checks in the project environment.
3. Back up MongoDB Atlas.
4. Deploy the reviewed changes to the configured branch.
5. Verify startup and migration logs.
6. Run the manual checklist using two test organizations.
7. Fix any issues, rerun checks, and document actual results.
