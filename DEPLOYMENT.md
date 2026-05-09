# Hayatseed Deployment

## Local Development

Copy the example env file if you want to override ports or credentials:

```sh
cp .env.dev.example .env.dev
docker compose --env-file .env.dev -f docker-compose.dev.yml up --build
```

Local URLs:

- Frontend: http://localhost:3000
- Backend health: http://localhost:4000/api/health
- Postgres: localhost:5432

## Production Server

Point the DNS `A` record for `hayatseed.openzey.com` to your server IP before starting Caddy.
Ports `80` and `443` must be open on the server.

Create a production env file:

```sh
cp .env.production.example .env.production
```

Edit `.env.production` and replace:

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `CADDY_EMAIL`

Start production:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

Caddy will request and renew HTTPS certificates automatically for:

```txt
https://hayatseed.openzey.com
```

Useful commands:

```sh
docker compose --env-file .env.production -f docker-compose.prod.yml ps
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f caddy
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f frontend
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.production -f docker-compose.prod.yml pull
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

## Architecture

- `caddy`: public entrypoint, HTTPS, security headers, `/api/*` reverse proxy, and frontend proxy.
- `frontend`: private static web container on port `3000`.
- `backend`: private Nest API on port `4000`.
- `postgres`: private PostgreSQL 16 database.

Only Caddy exposes public ports. Frontend, backend, and Postgres stay on an internal Docker network.
