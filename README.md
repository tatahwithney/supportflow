# SupportFlow

SupportFlow is a web-based Support Management System developed as the August Backend Capstone Project at Skye8 Company LTD.

## Description

SupportFlow provides a centralized platform for managing customer support requests.

Customers can create and track support requests, while support agents can manage assigned requests, respond to customers, and update request statuses. Administrators and managers can manage users, assign requests, and monitor support activities.

## Live Application

SupportFlow is available at: `https://supportflow-qj5w.onrender.com/`

## Technology Stack

* Node.js
* Express.js
* EJS
* MongoDB
* Mongoose
* JavaScript
* REST API
* JWT
* bcryptjs
* Git/GitHub
* Render

## Project Architecture

The application follows the MVC (Model-View-Controller) architecture.

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

## User Roles

SupportFlow supports four user roles:

* Customer
* Support Agent
* Manager
* Administrator

Each role has different permissions based on the user's responsibilities.

## Main Features

### Authentication and Authorization

* Customer registration and login
* Staff registration for supported staff roles
* JWT-based authentication
* Password hashing with bcryptjs
* Role-based access control
* Active/inactive account management
* Protected API routes

### Support Request Management

* Create support requests
* View support requests
* Update request information
* Assign requests to support agents
* Update request status
* Set request priority and category
* Restrict request access based on user role

### Responses and Ticket History

* Add responses to support requests
* View response history
* Track communication between customers and support staff

### User Management

* View users
* Update user information
* Manage user roles
* Deactivate user accounts

### Web Interface

Role-specific EJS interfaces are provided for:

* Customers
* Support Agents
* Administrators

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/staff/register
POST /api/auth/login
```

### Users

```text
GET    /api/users
GET    /api/users/:id
PUT    /api/users/:id
DELETE /api/users/:id
```

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

## Database

SupportFlow uses MongoDB with Mongoose.

The main collections are:

* Users
* Support Requests
* Responses

MongoDB Atlas is used as the production database.

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
STAFF_REGISTRATION_KEY=your_staff_registration_key
```

Never commit the `.env` file or expose sensitive credentials.

An `.env.example` file is included to show the required configuration structure.

## Running Locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

For production:

```bash
npm start
```

The application runs locally at:

```text
http://localhost:3000
```

## Health Check

The application provides a health check endpoint:

```text
GET /health
```

Expected response:

```json
{
  "status": "OK",
  "message": "SupportFlow API is running"
}
```

## Testing

The application was tested during development using API testing tools.

Testing covered:

* Customer registration and login
* JWT authentication
* Invalid and expired token handling
* Role-based access control
* User management
* Support request creation and management
* Agent assignment
* Request status updates
* Support responses and response history
* Protected API access

## Deployment

SupportFlow has been successfully deployed as a Node.js web service on Render.

Production architecture:

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

The application source code is maintained on GitHub and deployed from the `main` branch.

## Version Control

Git and GitHub are used for source-code management and development tracking.

GitHub repository:

https://github.com/tatahwithney/supportflow

## Documentation

Detailed project documentation is available in the `docs` directory:

* `docs/project-development.md` — chronological development progress
* `docs/database-design.md` — database structure and relationships
* `docs/api-documentation.md` — API endpoints and usage
* `docs/deployment.md` — deployment configuration and process

## Development Status

The SupportFlow MVP has been implemented, tested, and successfully deployed.

Completed:

* Project setup and MVC structure
* Database design and Mongoose models
* REST API development
* Authentication and JWT authorization
* Role-based access control
* User management
* Support request management
* Request assignment and status management
* Responses and ticket history
* Role-specific EJS interfaces
* API testing
* MongoDB Atlas configuration
* Git/GitHub integration
* Render deployment

## Future Improvements

Possible future improvements include:

* Email notifications
* Advanced search and filtering
* File attachments
* Support analytics and reporting
* Additional request categories and workflow features