# Task Management Application

A full-stack task management application built with TypeScript, NestJS, MongoDB, and Puppeteer that allows users to organize and track their tasks efficiently.

## Features

- **User Authentication**
  - User registration and login
  - JWT-based authentication

- **Task Dashboard**
  - Personalized dashboard displaying tasks
  - Tasks with title, description, and due date

- **Task Management**
  - Create, read, update, and delete tasks
  - Mark tasks as completed

- **Task Categories**
  - Organize tasks with custom categories
  - Filter and sort tasks by category

## Tech Stack

- **Backend**
  - TypeScript 4.9+
  - NestJS 10.0+
  - MongoDB 6.0+
  - Mongoose 7.0+
  - JWT for authentication
  - Swagger for API documentation

- **Testing**
  - Puppeteer 21.0+ for E2E testing
  - Jest for unit and integration testing

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (v6.0 or higher)
- Git

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd todo-app-server
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Database Setup

Ensure MongoDB is running on your system. The application will automatically create the required collections.

```bash
# Start MongoDB (if not running as a service)
mongod
```

### 5. Start the Development Server

```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The server will start on http://localhost:3000 by default.

### 6. API Documentation

The API documentation is available via Swagger UI at:

```
http://localhost:3000/api
```

## Project Structure

```
task-management-app/
├── src/
│   ├── auth/           # Authentication module
│   ├── categories/     # Categories module
│   ├── tasks/          # Tasks module
│   ├── users/          # Users module
│   ├── main.ts         # Application entry point
│   └── app.module.ts   # Root module
├── test/               # Test files
└── nest-cli.json       # NestJS configuration
```

## Development Commands

```bash
# Generate a new module
npm run nest g module module-name

# Generate a new controller
npm run nest g controller controller-name

# Generate a new service
npm run nest g service service-name

# Run tests
npm run test            # Unit tests
npm run test:e2e        # E2E tests
npm run test:cov        # Test coverage

# Format code
npm run format
```

## Testing

### Unit and Integration Tests

```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:cov
```

### E2E Testing with Puppeteer

```bash
# Run E2E tests
npm run test:e2e
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Users

- `GET /users/profile` - Get current user profile

### Categories

- `GET /categories` - Get all categories
- `POST /categories` - Create a new category
- `GET /categories/:id` - Get a specific category
- `PATCH /categories/:id` - Update a category
- `DELETE /categories/:id` - Delete a category

### Tasks

- `GET /tasks` - Get all tasks
- `POST /tasks` - Create a new task
- `GET /tasks/:id` - Get a specific task
- `PATCH /tasks/:id` - Update a task
- `DELETE /tasks/:id` - Delete a task
- `PATCH /tasks/:id/status` - Update task status

## Performance Optimization

- MongoDB indexes for frequently queried fields
- Proper error handling and validation
- Rate limiting to prevent abuse
- JWT token-based authentication for stateless operation
- Optimized database queries using Mongoose

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request