# Docker Deployment Guide

This guide covers running the Veterans CRM with Docker and Docker Compose.

## Quick start

1. Copy the example environment file and edit it:
   ```bash
   cp .env.example .env
   nano .env   # or your preferred editor
   ```

2. Review `docker-compose.yml`. The database credentials there must match `DATABASE_URL` in your `.env`.

3. Build and start everything:
   ```bash
   docker compose up -d --build
   ```

4. Open the app at http://your-server-ip:3000

## What Docker Compose does

- Builds the Node.js app image.
- Runs a MySQL 8 database container.
- Automatically runs database migrations when the app starts.
- Persists database data in a Docker volume named `db_data`.

## Updating to a new version

Pull the latest code, then rebuild and restart:

```bash
git pull
docker compose down
docker compose up -d --build
```

## Useful commands

```bash
# View logs
docker compose logs -f app

# Restart
docker compose restart app

# Stop
docker compose down

# Stop and delete database volume (destroys all data!)
docker compose down -v

# Run migrations manually
docker compose exec app node migrate-crm.mjs
```

## Changing the database password

Edit both `docker-compose.yml` and `.env` so the credentials match. After changing, restart the containers.

## Production checklist

- Use strong, random passwords in `.env` and `docker-compose.yml`.
- Expose the app through a reverse proxy (Nginx, Caddy, Traefik) with HTTPS.
- Place the containers behind a firewall; only expose ports 80 and 443 publicly.
- Back up the `db_data` volume regularly.

## Migration

This setup is portable. To move the CRM to another host:

1. Copy the repository folder and `.env`.
2. On the new host, run `docker compose up -d --build`.
3. Restore the database volume backup if needed.
