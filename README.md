# Auth Service Express

## Description

Auth Service is a dedicated microservice built with Node.js and Express, focused on handling authentication and authorization. It provides secure token issuance, user login, registration, password reset, and identity management functionalities.

## Features

- User login and registration
- Token generation and validation (e.g., JWT)
- Password reset and email verification
- Two-factor authentication support
- Built with TypeScript for type safety
- ESLint and Prettier for code quality and formatting
- Husky for Git hooks

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- pnpm (package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/slyang08/auth-service-express.git
   cd auth-service-express
   ```
2. Install dependencies:
   ```bash
   pnpm install
   ```

### Running the Application

To start the Auth Service in development mode, run:

```bash
pnpm run dev
```

### Linting and Formatting

To lint the code, run:

```bash
pnpm run lint
```

To format the code using Prettier, run:

```bash
pnpm run format:fix
```

## Author

Sheng-Lin Yang
