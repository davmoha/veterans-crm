# Veterans CRM

[![CI](https://github.com/davmoha/veterans-crm/actions/workflows/ci.yml/badge.svg)](https://github.com/davmoha/veterans-crm/actions/workflows/ci.yml)

## Quick Start (Docker)

The fastest way to run the app is with Docker Compose:

```bash
cp .env.example .env          # fill in DATABASE_URL and secrets
docker compose up -d --build  # or: pnpm compose:up
```

Open **http://localhost:3000**.  
To stop: `docker compose down` (or `pnpm compose:down`).

> **Need a plain Node setup?** See [INSTALLATION.md](INSTALLATION.md) for the manual dev-environment steps.

---

## Deploy

| Guide | When to use |
|-------|-------------|
| [DOCKER_DEPLOYMENT.md](DOCKER_DEPLOYMENT.md) | Self-hosted Docker / VPS |
| [RENDER_DEPLOYMENT.md](RENDER_DEPLOYMENT.md) | Render.com managed hosting |
| [DEPLOYMENT.md](DEPLOYMENT.md) | General deployment notes |

---

## Overview

This is a full-stack CRM (Constituent Relationship Management) system designed specifically for nonprofit organizations to manage their Volunteers, Board Members, and general Members. It provides a centralized platform for tracking constituent data, managing communication preferences, and integrating with external form submissions (e.g., Wix).

## Key Features

- **Core Constituent Profiles:** Comprehensive profiles for all individuals, including contact information, household/organization links, and communication preferences.
- **Volunteer Management:** Track volunteer skills, availability, background check status, and total hours worked.
- **Board of Directors Governance:** Manage board roles, committee assignments, term tracking, and financial stewardship (personal giving targets).
- **Membership Management:** Oversee member tiers, status, key dates (join, renewal, expiration), and financial details.
- **Wix Webhook Integration:** Seamlessly ingest form submissions from Wix, with intelligent deduplication and automatic record creation/updates.
- **Inline Editing:** Directly edit constituent records from the UI with real-time updates and field-level validation.
- **Advanced Search & Mass Email:** Filter constituents by various criteria (location, contact type, opt-in status) and send mass emails via your device's default email application.

## Technical Stack

- **Frontend:** React 19, Tailwind CSS 4, shadcn/ui, Wouter (router)
- **Backend:** Express 4, tRPC 11
- **Database:** MySQL/TiDB (Drizzle ORM)
- **Authentication:** Manus OAuth

## Architecture

The application follows a client-server architecture:

- **Client (Frontend):** A React application built with Vite, providing an interactive user interface for managing constituents. It communicates with the backend via tRPC.
- **Server (Backend):** An Express.js server handling API requests, database interactions, and the Wix webhook endpoint. It uses tRPC for type-safe API calls and Drizzle ORM for database management.
- **Database:** A MySQL-compatible database (e.g., TiDB) stores all constituent data, including core profiles, volunteer details, board information, membership data, and webhook logs.

## Local Development (without Docker)

To get the project running locally for development:

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd nonprofit-crm-guide
    ```

2.  **Install dependencies:**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the project root based on `.env.example` (if available) or the required environment variables from the `webdev_add_feature` output. Key variables include `DATABASE_URL`, `JWT_SECRET`, and OAuth-related variables.

4.  **Run database migrations:**
    The project uses Drizzle ORM. Ensure your `DATABASE_URL` is correctly configured in your `.env` file, then run:
    ```bash
    pnpm db:push
    ```
    *Note: If you encounter issues with `pnpm db:push` due to specific database requirements (e.g., TiDB JSON defaults), you may need to use the `migrate-crm.mjs` script directly: `node migrate-crm.mjs`.*

5.  **Start the development server:**
    ```bash
    pnpm dev
    ```
    This will start both the frontend and backend development servers. The application will typically be accessible at `http://localhost:3000`.

## Testing

To run unit tests:

```bash
pnpm test
```

## Contributing

Feel free to contribute to this project. Please follow standard Git practices for branching, committing, and pull requests.

## License

MIT License
