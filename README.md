# Astro Custom Auth

Welcome to Astro Custom Auth, a minimal app for an authentication system with Astro, React, and Tailwind CSS. This app demonstrates how to set up user registration, login, and session management using modern web technologies.

## Quick Start

```bash
# Copy env.example to .env
cp .env.example .env

# Install dependencies
bun install

# Add sqlite.db
mkdir data
touch data/sqlite.db

# Apply database migrations
bun run migrate

# Start the development server
bun run dev
```

## 🚀 Project Structure

Inside the Astro project, you'll find the following folders and files:

```text
/
├── public/
├── src/
│   ├── components/
│   │   ├── ui/
│   │   └── layout.astro
│   ├── db/
│   │   ├── schema.ts
│   │   ├── index.ts
│   │   └── session.ts
│   ├── pages/
│   │   ├── api/
│   │   │   └── logout.ts
│   │   ├── index.astro
│   │   ├── login.astro
│   │   └── register.astro
│   └── lib/
│       └── utils.ts
└── package.json
```

- **`public/`**: Static assets like images and icons.
- **`src/components/`**: Reusable UI components and layout files.
- **`src/db/`**: Database schema, connection, and session management.
- **`src/pages/`**: Main pages for the application, including API routes.
- **`src/lib/`**: Utility functions.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `bun install`             | Installs dependencies                            |
| `bun run dev`             | Starts local dev server at `localhost:4321`      |
| `bun run build`           | Build your production site to `./dist/`          |
| `bun run preview`         | Preview your build locally, before deploying     |
| `bun run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `bun run astro -- --help` | Get help using the Astro CLI                     |
| `bun run generate`        | Generate database migrations                     |
| `bun run migrate`         | Apply database migrations                        |

## 🛠️ Core Features

- **User Registration**: Register new users with email and password.
- **User Login**: Authenticate users and create sessions.
- **Session Management**: Handle user sessions with cookies.
- **Database Integration**: Use SQLite with Drizzle ORM for data storage.
- **UI Components**: Pre-built UI components using Tailwind CSS.
