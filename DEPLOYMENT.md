# Deployment Guide: Nonprofit CRM

This guide outlines various options for deploying the Nonprofit CRM application to a production environment, covering both Manus's built-in hosting and considerations for external platforms.

## 1. Manus Built-in Hosting (Recommended)

This project is designed for seamless deployment on the Manus platform, which offers managed hosting solutions tailored for web applications.

### Autoscale Hosting (Default)

By default, your project is configured for **Autoscale hosting**. This serverless model automatically scales resources up or down based on demand, including scaling down to zero instances during periods of inactivity. This is ideal for most nonprofit applications, providing cost-efficiency and hands-off management.

-   **Automatic Publishing:** Every successful `webdev_save_checkpoint` action automatically publishes the latest version of your application to production.
-   **Custom Domains:** You can bind custom domains directly through the Manus Management UI (Settings -> Domains).
-   **Managed Database:** The database (MySQL/TiDB) is managed by the Manus platform, requiring only the `DATABASE_URL` environment variable.

### Reserved Hosting

For workloads that require consistent uptime, fixed resources, or specific configurations not supported by Autoscale, you can upgrade to **Reserved hosting**. This provides dedicated instances that do not spin down.

-   **When to Consider:** If your application experiences high, continuous traffic, requires a fixed IP address, or needs background jobs that must run constantly.
-   **Upgrade Process:** This can be initiated through the Manus Management UI or by requesting an upgrade from your Manus agent.

## 2. Custom Dockerfile

While Manus hosting typically auto-generates the Dockerfile, you have the option to provide a custom `Dockerfile` at the project root. This is necessary only if your production environment requires:

-   **Extra System Binaries:** Such as `ffmpeg` for video processing or `chromium` for headless browser operations.
-   **Another Language Runtime:** If your application integrates components written in Python, Java, Go, etc.

**Important Considerations:**

-   A custom `Dockerfile` **replaces** the default auto-generated one. Ensure it is complete and correctly configured.
-   Refer to the Manus documentation on custom Dockerfiles for best practices and the deployment contract.

## 3. External Hosting Providers

While Manus provides robust built-in hosting, you can deploy the application to external providers like Railway, Render, Vercel, or Netlify. However, be aware of potential compatibility issues and additional configuration steps.

### General Steps for External Hosting

1.  **Environment Variables:** Ensure all necessary environment variables (e.g., `DATABASE_URL`, `JWT_SECRET`, OAuth credentials, `WIX_WEBHOOK_SECRET`) are correctly configured in your chosen hosting environment.
2.  **Database:** You will need to provision and manage your own MySQL-compatible database instance with the external provider.
3.  **Build Process:** Configure your CI/CD pipeline to run `pnpm build` to create the optimized production assets.
4.  **Start Command:** The application's start command is `pnpm start` (which executes `node dist/index.js`).
5.  **Port Configuration:** Ensure the application is configured to listen on the port specified by the hosting provider (often `PORT` environment variable).

### Docker-based Deployment

For external providers that support Docker, you can use the `Dockerfile` (custom or auto-generated) to containerize your application. This offers a consistent deployment artifact.

## 4. Database Considerations

As noted in the `INSTALLATION.md`, the CRM currently uses **MySQL/TiDB**. If your chosen deployment environment or preference leans towards **PostgreSQL**, a database refactoring effort would be required to adapt the Drizzle schema and database drivers.

## 5. Security Best Practices

-   **Environment Variables:** Always store sensitive information (API keys, secrets, database credentials) in environment variables. Never hardcode them or commit them to version control.
-   **HTTPS:** Ensure your production deployment uses HTTPS to encrypt all communication.
-   **Wix Webhook Secret:** If using the Wix integration, configure the `WIX_WEBHOOK_SECRET` environment variable in your production environment to secure your webhook endpoint.

## References

[1] [Manus Hosting Documentation](https://docs.manus.im/hosting) - Official documentation for Manus built-in hosting solutions.
[2] [Manus Custom Dockerfile Guide](https://docs.manus.im/custom-dockerfile) - Details on using custom Dockerfiles with Manus deployments.
