# Task Management Application

A modern task management application built with Next.js, Redux Toolkit, and Tailwind CSS.

## Features

- 🔐 User authentication with JWT
- 📝 Task management (create, read, update, delete)
- 📁 Category organization
- 👤 User profile management
- 🌓 Dark/Light mode support
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui
- ✨ Form validation with Zod
- 📱 Responsive design

## Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## Getting Started

1. Clone the repository:
```bash
git clone <repository-url>
cd task-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Authentication

The application uses JWT-based authentication with the following features:
- Token storage in cookies for security
- Automatic token refresh
- Protected routes
- Persistent sessions

## State Management

Redux Toolkit is used for state management with the following slices:
- `auth` - Authentication state
- `tasks` - Tasks management
- `categories` - Categories management

## API Integration

The application communicates with a RESTful API using Axios. The API client is configured to:
- Automatically attach authentication tokens
- Handle token expiration
- Manage request/response interceptors

## Styling

- Tailwind CSS for utility-first styling
- shadcn/ui for pre-built components
- Custom theme configuration
- Dark mode support

## Best Practices

- TypeScript for type safety
- Form validation with Zod
- Error boundaries for error handling
- Responsive design patterns
- Accessibility considerations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request
