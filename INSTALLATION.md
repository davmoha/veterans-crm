# Installation Guide: Self-Hosting the Nonprofit CRM

This guide provides detailed instructions for self-hosting the Nonprofit CRM application. It covers prerequisites, database setup, environment configuration, and running the application locally or via Docker.

## 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

-   **Node.js (v18 or higher):** The JavaScript runtime for the application.
-   **pnpm (v8 or higher):** The package manager used in this project.
    ```bash
    npm install -g pnpm
    ```
-   **MySQL-compatible Database:** The application is configured to use a MySQL-compatible database (e.g., MySQL, TiDB). You will need access to a running instance of such a database.
    -   **For local development:** You can use Docker to run a local MySQL instance:
        ```bash
        docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -p 3306:3306 -d mysql:latest
        ```

## 2. Get the Code

Clone the project repository from GitHub:

```bash
git clone <repository-url>
cd nonprofit-crm-guide
```

## 3. Install Dependencies

Navigate to the project directory and install all required dependencies:

```bash
pnpm install
```

## 4. Environment Configuration

Create a `.env` file in the root of your project. This file will store sensitive information and configuration variables. You will need to define at least the following:

```dotenv
# Database Connection
DATABASE_URL="mysql://user:password@host:port/database"

# JWT Secret for session management (generate a strong, random string)
JWT_SECRET="your_super_secret_jwt_key"

# Manus OAuth Configuration (provided by your Manus project settings)
VITE_APP_ID="your_manus_app_id"
OAUTH_SERVER_URL="https://oauth.manus.im"
VITE_OAUTH_PORTAL_URL="https://portal.manus.im"
OWNER_OPEN_ID="your_manus_owner_open_id"
OWNER_NAME="Your Name"

# Wix Webhook Security (optional, but highly recommended)
WIX_WEBHOOK_SECRET="your_wix_webhook_secret"

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT="https://analytics.manus.im"
VITE_ANALYTICS_WEBSITE_ID="your_analytics_website_id"

# Forge API (for built-in Manus services like LLM, Storage, etc.)
BUILT_IN_FORGE_API_URL="https://forge.manus.im"
BUILT_IN_FORGE_API_KEY="your_forge_api_key"
VITE_FRONTEND_FORGE_API_KEY="your_frontend_forge_api_key"
VITE_FRONTEND_FORGE_API_URL="https://forge.manus.im"
```

**Security Note:** Never commit your `.env` file to version control. Ensure it is listed in your `.gitignore`.

## 5. Database Setup and Migrations

The project uses [Drizzle ORM](https://orm.drizzle.team/) for database schema management. The database currently uses **MySQL/TiDB**.

1.  **Ensure your database is running** and accessible via the `DATABASE_URL` provided in your `.env` file.

2.  **Apply migrations:**
    ```bash
    pnpm db:push
    ```
    This command will generate and apply the necessary SQL to create all tables (constituents, volunteer profiles, board profiles, membership profiles, webhook logs, etc.) in your database.

    *If you encounter issues with `pnpm db:push` (e.g., related to specific database versions or JSON defaults), you can manually run the migration script:* 
    ```bash
    node migrate-crm.mjs
    ```

## 6. Running the Application

### Development Mode

To run the application in development mode (with hot-reloading and debugging features):

```bash
pnpm dev
```

The application will typically be accessible at `http://localhost:3000`.

### Production Build

To create an optimized production build of the application:

```bash
pnpm build
```

To start the production build:

```bash
pnpm start
```

### Using Docker (Recommended for Production)

For self-hosting in a production environment, using Docker is recommended for consistency and ease of deployment.

1.  **Build the Docker image:**
    ```bash
    docker build -t nonprofit-crm .
    ```

2.  **Run the Docker container:**
    Ensure your `.env` file is properly configured and accessible to the container. You can mount it as a volume or pass environment variables directly.

    ```bash
    docker run -d --name nonprofit-crm-app -p 3000:3000 --env-file ./.env nonprofit-crm
    ```
    Replace `3000:3000` with your desired host port if needed. The application will be accessible on the specified port.

## 7. Database Choice: MySQL/TiDB vs. PostgreSQL

This project is currently configured to use **MySQL/TiDB** as its database backend, leveraging Drizzle ORM's MySQL dialect. 

If you prefer to use **PostgreSQL**, it would require:

-   **Schema Adaptation:** Adjusting the `drizzle/schema.ts` file to use PostgreSQL-specific data types and syntax.
-   **Drizzle Configuration:** Updating `drizzle.config.ts` to specify `dialect: "postgresql"` and potentially `pgCredentials`.
-   **Driver Change:** Replacing `mysql2` with a PostgreSQL driver (e.g., `pg` or `postgres-js`) in `package.json` and `server/db.ts`.
-   **Migration:** Running new migrations for the PostgreSQL schema.

This is a feasible change but would require a dedicated effort to refactor the database layer.
