# VenueVista Backend — Step 1

Foundation for the commercial VenueVista backend using Node.js, Express, PostgreSQL and Prisma.

## Prerequisites

- Node.js 20 or newer
- npm
- PostgreSQL 14 or newer, locally or through a managed provider

## Setup

1. Extract this folder into your project, ideally alongside your existing frontend:
   ```
   VenueVista/
     frontend/   # your existing React app (folder name may differ)
     backend/    # this folder's contents
   ```
2. Open a terminal in the backend folder and install dependencies:
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and replace the placeholder password / connection string:
   ```
   cp .env.example .env
   ```
   On Windows PowerShell:
   ```
   Copy-Item .env.example .env
   ```
4. Create a PostgreSQL database named `venuevista` (or update the URL to your chosen database).
5. Generate the Prisma client and create the first migration:
   ```
   npm run db:generate
   npm run db:migrate -- --name init
   ```
6. Start the API:
   ```
   npm run dev
   ```
7. Check:
   - `http://localhost:4000/`
   - `http://localhost:4000/api/health`

The health endpoint checks both the API and database connection.

## Environment

- `NODE_ENV`: `development`, `test`, or `production`
- `PORT`: API port (default `4000`)
- `DATABASE_URL`: PostgreSQL connection string
- `CLIENT_ORIGINS`: comma-separated allowed frontend origins

Never commit `.env`, production credentials, or real secrets. Configure environment variables through your hosting provider in production.

## Security foundations included

- Helmet security headers
- Explicit CORS allowlist
- JSON request-size limits
- API rate limiting
- Validated environment configuration
- Generic production error messages
- Prisma parameterized database access
- Graceful shutdown

## Current scope

This is Step 1 only: server foundation, database schema, and health check. Authentication, event APIs, booking transactions, ticket QR verification, tests, and deployment are subsequent steps. Payments are intentionally not integrated yet.

Before public launch, add automated tests, structured logging and monitoring, secure authentication/session strategy, database backups, and a deployment review. Rate limiting should be tuned to your real traffic and, when deployed behind multiple instances, backed by a shared store.
