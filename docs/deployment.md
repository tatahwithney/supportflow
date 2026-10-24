# SupportFlow Deployment Documentation

## Overview

SupportFlow is deployed as a Node.js web service using Render.

The production database is hosted on MongoDB Atlas, while the source code is maintained in GitHub.

## Production Architecture

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

## Source Repository

The SupportFlow source code is stored in GitHub:

```text
https://github.com/tatahwithney/supportflow
```

The deployment uses the `main` branch.

## MongoDB Atlas

MongoDB Atlas was configured as the production database.

### Configuration

* Created a MongoDB Atlas cluster.
* Created a database user.
* Configured the SupportFlow database.
* Updated the connection URI to use the `supportflow` database.
* Verified the application connection.
* Verified that application data is stored in the production database.

The MongoDB connection string is stored in the `MONGO_URI` environment variable and is not committed to GitHub.

## Render Configuration

SupportFlow was deployed as a Render Web Service.

### Service Configuration

| Setting       | Value                      |
| ------------- | -------------------------- |
| Service Type  | Web Service                |
| Repository    | `tatahwithney/supportflow` |
| Branch        | `main`                     |
| Language      | Node                       |
| Build Command | `npm install`              |
| Start Command | `npm start`                |
| Health Check  | `/health`                  |

Render provides the production `PORT` environment variable for the web service.

## Environment Variables

The following environment variables are configured in the production environment:

```text
MONGO_URI
JWT_SECRET
STAFF_REGISTRATION_KEY
PORT
```

Sensitive values are stored in Render's environment configuration and are not included in the repository.

The local `.env` file is excluded from Git using `.gitignore`.

## Deployment Process

The deployment process was:

1. Complete and test the application locally.
2. Configure MongoDB Atlas.
3. Prepare environment variables.
4. Commit the project to Git.
5. Push the project to GitHub.
6. Connect the GitHub repository to Render.
7. Configure the Render build and start commands.
8. Add the required production environment variables.
9. Deploy the application.
10. Verify the deployed service and database connection.

## Deployment Issue

During the initial Render deployment, the build completed successfully and the application started, but the deployment initially timed out while Render was detecting the service port.

The application subsequently restarted and Render detected the running service on port `3000`.

The deployment then completed successfully.

## Deployment Verification

The successful deployment confirmed:

* GitHub source retrieval worked.
* Dependencies installed successfully.
* The application started with `npm start`.
* MongoDB Atlas connected successfully.
* Render detected the running web service.
* The application became accessible through the production URL.

## Live Application

SupportFlow is deployed at:

```text
https://supportflow-qj5w.onrender.com/
```

## Health Check

The production health endpoint is:

```text
https://supportflow-qj5w.onrender.com/health
```

It is used to confirm that the deployed application is running correctly.

## Security Considerations

Production credentials must not be committed to GitHub.

The following files and values are kept out of source control:

* `.env`
* MongoDB credentials
* JWT secret
* Staff registration key

The repository contains `.env.example` with placeholder values for development configuration.

## Deployment Status

SupportFlow has been successfully deployed to Render and connected to MongoDB Atlas.

The production environment is available for live application testing and demonstration.


## Multi-Tenant Release Checklist

Before deploying the multi-tenant version:

1. Confirm `.env` remains untracked and production secrets are configured in Render.
2. Back up the MongoDB Atlas `supportflow` database.
3. Push the reviewed source to the configured deployment branch.
4. Confirm the Render build and startup logs show a successful MongoDB connection.
5. Confirm the legacy data migration runs if legacy records lack organization references.
6. Register two test organizations and one administrator in each.
7. Register separate customers and staff in each organization.
8. Verify each organization's users, requests, assignments, and responses are isolated.
9. Attempt cross-organization user/request/response lookups and confirm no data is returned.
10. Re-test existing login and role permissions after users sign in again, because old JWTs do not contain an organization ID.

Do not describe the multi-tenant production deployment as verified until these checks have passed.
