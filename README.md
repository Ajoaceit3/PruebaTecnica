# Vending Machine Backend API

Backend service developed as a technical assessment for managing vending machines installed across different buildings.

The API allows authenticated users to:

- Access only the buildings they are authorized to see.
- Retrieve vending machines and their current status.
- Update machine status when the user has control permissions.
- Request actions on vending machines.
- Retrieve previously requested actions and their current status.

Authorization is handled at building level, allowing the same user to have different permissions depending on the building.

## Tech Stack

- Node.js
- Express
- PostgreSQL
- Sequelize
- Docker / Docker Compose
- JSON Web Tokens (JWT)
- Zod
- Pino
- Jest
- Supertest

## Requirements

The complete application can be run using:

- Docker
- Docker Compose

Node.js and PostgreSQL do not need to be installed locally when running the application entirely through Docker.

For local development or for running npm commands directly from the host machine, Node.js and npm are also required.

## Environment Configuration

For this technical assessment, a `.env` file is included in the repository to make the project easier to start and review.

The values included in this file are intended only for local development and do not contain real production credentials or reusable secrets.

> In a real project, `.env` files should not be committed to version control. 

The application uses environment variables for application, database, authentication and logging configuration.

## Running the Application with Docker

Build and start the API and PostgreSQL:

```bash
docker compose up -d --build
```

Check that both containers are running:

```bash
docker compose ps
```

Apply the database migrations:

```bash
docker compose exec api npm run db:migrate
```

Load the development seed data:

```bash
docker compose exec api npm run db:seed
```

The API will then be available at:

```text
http://localhost:3000
```

### Health Check

```http
GET /health
```

Example:

```text
http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected"
}
```

## Postman Collection

The repository includes the Postman collections used to manually test the API during development.

They are located in:

```text
postman/
├── Actions.postman_collection.json
├── Buildings.postman_collection.json
├── Health.postman_collection.json
├── Machines.postman_collection.json
└── New Environment.postman_environment.json
```

These files contain ready-to-use requests for the Health, Buildings, Machines and Actions modules.

They are intended for manual API exploration. Automated integration tests are provided separately under the `tests/` directory.

### Importing into Postman

1. Open Postman.
2. Click **Import**.
3. Select the JSON files from the `postman/` directory.
4. Import the four collection files and the environment file.
5. Select the imported environment in Postman.
6. Verify that the API base URL points to:

```text
http://localhost:3000
```

7. Generate a JWT for one of the seeded users.

For Alice:

```bash
docker compose exec api npm run token -- 1
```

For Bob:

```bash
docker compose exec api npm run token -- 2
```

8. Copy the generated JWT into the `token` variable used by the Postman requests.
9. The imported requests can now be executed directly against the local API.

The JWT itself is intentionally not stored in the exported Postman files. A fresh token can be generated at any time using the commands above.

## Authentication

User registration and password management are intentionally outside the scope of this exercise.

The application assumes that users already exist. Authentication is implemented using signed JWTs.

The seed data contains two example users with different building permissions.

Protected endpoints expect the token using the standard Bearer authentication header:

```http
Authorization: Bearer <token>
```

### Seeded Permissions

| User | Building A | Building B | Building C |
|---|---|---|---|
| Alice | Read | Read + Control | No access |
| Bob | Read + Control | No access | Read |

This data is intentionally designed to make resource-level authorization easy to verify.

## API Endpoints

All endpoints except `/health` require authentication.

### Buildings

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/buildings` | Returns the buildings accessible to the authenticated user |
| `GET` | `/buildings/:buildingId` | Returns a specific building when the user has read access |

### Machines

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/buildings/:buildingId/machines` | Lists machines belonging to an accessible building |
| `GET` | `/machines/:machineId` | Returns a specific accessible machine and its current status |
| `PATCH` | `/machines/:machineId/status` | Updates machine status when the user has control permission |

Example request body:

```json
{
  "status": "MAINTENANCE"
}
```

Supported machine statuses:

```text
ONLINE
OFFLINE
OUT_OF_SERVICE
ERROR
MAINTENANCE
DISABLED
```

### Machine Actions

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/machines/:machineId/actions` | Requests an action when the user has control permission |
| `GET` | `/machines/:machineId/actions` | Lists actions for a machine the user can access |
| `GET` | `/actions/:actionId` | Retrieves an accessible action and its current status |

Example action request:

```json
{
  "actionType": "RESTART"
}
```

Supported action types:

```text
RESTART
ENABLE
DISABLE
SET_MAINTENANCE
```

New actions are initially stored with the status:

```text
PENDING
```

Execution of actions by the physical vending machines is outside the scope of this exercise.

## Running Tests

The project contains integration tests implemented with Jest and Supertest.

The tests use a separate PostgreSQL database:

```text
vending_test_db
```

This prevents automated tests from modifying development data.

When running tests locally, first make sure PostgreSQL is running:

```bash
docker compose up -d postgres
```

Then run:

```bash
npm test
```

The test suite focuses on the behaviours considered most relevant for this exercise:

- Authentication of protected resources.
- Resource-level authorization.
- Read vs. control permissions.
- Input validation.
- Persistence of machine changes and requested actions.
- Prevention of access to resources belonging to unauthorized buildings.

The goal is to test important behaviour rather than target a specific code coverage percentage.

## Project Structure

```text
src/
├── config/
│   ├── database.js
│   ├── env.js
│   └── sequelize.config.js
│
├── database/
│   ├── migrations/
│   ├── models/
│   └── seeders/
│
├── middleware/
│   ├── authentication.js
│   ├── errorHandler.js
│   └── validate.js
│
├── modules/
│   ├── actions/
│   ├── buildings/
│   └── machines/
│
├── shared/
│   ├── errors/
│   └── logger.js
│
├── app.js
└── server.js

postman/
├── Actions.postman_collection.json
├── Buildings.postman_collection.json
├── Health.postman_collection.json
├── Machines.postman_collection.json
└── New Environment.postman_environment.json

scripts/
└── generateToken.js

tests/
├── helpers/
├── actions.test.js
├── authentication.test.js
├── buildings.test.js
├── machines.test.js
└── setup.js
```

Each business module follows a simple separation of responsibilities:

```text
Route
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Sequelize
  ↓
PostgreSQL
```

This structure was chosen to keep HTTP concerns, business rules and persistence logic separated without introducing unnecessary architectural complexity.

## Data Model

The main entities are:

- `User`
- `Building`
- `UserBuildingPermission`
- `Machine`
- `MachineAction`

A building can contain multiple machines.

Users and buildings have a many-to-many relationship represented explicitly through `UserBuildingPermission`.

This relation stores the permissions granted to each user for each building:

- `canRead`
- `canControl`

A machine belongs to one building.

A machine action belongs to one machine and stores the user who requested it.

Database schema changes are managed through Sequelize migrations rather than `sequelize.sync()`. This keeps schema evolution explicit, versioned and reproducible between environments.

## Authentication and Authorization

Authentication and authorization are deliberately handled as separate concerns.

Authentication verifies the JWT and identifies the user making the request.

Authorization is evaluated afterwards according to the building associated with the requested resource.

A valid JWT therefore does not automatically grant access to every building or machine.

Two permission levels are currently implemented:

- **Read:** allows the user to retrieve buildings, machines and actions.
- **Control:** allows the user to perform operations that modify or control machines.

When a user cannot access a resource at all, the API generally returns `404 Not Found` instead of revealing whether the resource exists.

When the user can read a resource but does not have sufficient permission to modify it, the API returns `403 Forbidden`.

## Error Handling and Validation

Request parameters and bodies are validated using Zod.

Validation errors return a consistent `400 Bad Request` response.

Application errors use a centralized error structure:

```json
{
  "error": {
    "code": "MACHINE_NOT_FOUND",
    "message": "Machine not found"
  }
}
```

Errors are handled by a global Express error-handling middleware.

Logging is implemented using Pino and Pino HTTP.

Sensitive values such as authorization headers and authentication tokens are configured to be redacted from logs.

## Technical Decisions and Trade-offs

### Sequelize migrations instead of `sequelize.sync()`

Migrations make database changes explicit and reproducible and allow the database schema to evolve together with the application code.

### Explicit permission entity

`UserBuildingPermission` is represented as its own entity instead of being treated as a purely technical join table because the relationship contains domain information: read and control permissions.

### JWT without login or registration endpoints

The exercise focuses on authenticated and authorized API access rather than identity management. Users therefore already exist in the database and development JWTs can be generated using the provided script.

In a production system, authentication would normally be delegated to an external identity provider using OAuth/OIDC or a similar mechanism.

### Controller / Service / Repository separation

The project uses a lightweight layered structure to separate:

- HTTP handling.
- Application and authorization rules.
- Database access.

A more complex architecture was intentionally avoided because the size of the exercise does not justify additional abstraction.

### Machine actions are asynchronous requests

Creating a machine action records the request with a `PENDING` status.

The API does not pretend that the physical machine has already executed the operation.

In a real system, another component could consume pending actions, communicate with the machine and update their status asynchronously.

## Assumptions

- Users already exist and identity registration is outside the scope of the exercise.
- Permissions are granted at building level.
- `CONTROL` operations are considered more privileged than read operations.
- Updating machine status requires control permission.
- Machine actions are stored as requests and are not executed against real hardware.
- PostgreSQL is the source of truth for the current exercise.

## Possible Improvements

Given more time or production requirements, possible improvements would include:

- Integration with an external OAuth/OIDC identity provider.
- Asynchronous machine communication using MQTT or a message broker.
- Background workers for processing machine actions.
- Action status transitions from `PENDING` to `IN_PROGRESS`, `SUCCEEDED` or `FAILED`.
- Redis caching for frequently accessed data where appropriate.
- Pagination for machine and action lists.
- Rate limiting.
- Request correlation IDs and additional observability.
- More granular roles or permissions if the authorization model grows.
- OpenAPI / Swagger API documentation.
- CI pipeline for automated migrations, linting and tests.

## AI-Assisted Development

ChatGPT was used as a support tool during the development of this technical assessment.

It was not integrated into the IDE and was not used as an autonomous coding agent. Instead, the development was carried out incrementally: each part of the solution was discussed first, implemented manually in the project, and then tested before moving on to the next step.

ChatGPT was mainly used for:

- Discussing project structure and implementation alternatives.
- Reviewing technical decisions and possible trade-offs.
- Providing initial examples of Sequelize, Express, Zod and Jest/Supertest usage.
- Identifying relevant test scenarios.
- Reviewing documentation and README structure.

AI-generated suggestions were reviewed and adapted before being included in the project.

Some suggestions were intentionally simplified or rejected when they introduced unnecessary complexity for the scope of the exercise. For example, the solution avoids implementing a complete authentication platform, unnecessary CRUD operations, additional infrastructure such as Redis or MQTT, and excessive automated test coverage when those elements were not required to demonstrate the expected behaviour.
