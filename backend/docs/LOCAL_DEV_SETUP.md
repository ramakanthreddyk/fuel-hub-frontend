# LOCAL_DEV_SETUP.md — Running FuelSync Locally

This guide explains how to set up PostgreSQL, seed the database and run the API
server without Docker.

## 1. Install PostgreSQL

```bash
sudo apt-get update
sudo apt-get install -y postgresql
sudo service postgresql start
```

Set the `postgres` user password and allow password auth:

```bash
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
sudo sed -i 's/peer/md5/' /etc/postgresql/16/main/pg_hba.conf
sudo service postgresql restart
```

If you prefer using the Docker helper scripts, install Docker and Docker Compose first:

```bash
sudo apt-get install -y docker.io docker-compose
```
Then run `./scripts/start-dev-db.sh` to start the database container.

## 2. Create Dev Database

```bash
sudo -u postgres psql -c "CREATE USER fuelsync PASSWORD 'fuelsync';"
sudo -u postgres psql -c "CREATE DATABASE fuelsync_hub OWNER fuelsync;"
```

Run the public schema migration:

```bash
psql -U postgres -d fuelsync_hub -f migrations/schema/001_initial_schema.sql
```

## 3. Seed Data

Set a connection string and run the setup script:

```bash
npm run setup-db
```

This inserts an admin user and a demo tenant with basic accounts.

## 4. Run the Server

```bash
npm exec ts-node src/app.ts
```

Visit `http://localhost:3000/api/docs` for the Swagger docs. Use the sample
credentials to authenticate and test routes.

## 5. Run Unit Tests

Install dependencies and execute the Jest test suites. The `npm test` command will automatically launch the Docker database if it isn't running and wait for a connection before invoking Jest.

```bash
npm install
npm test
```

All tests should pass if the local database is configured correctly.
If you see `Skipping tests: unable to provision test DB`, ensure Docker is installed or that PostgreSQL is running locally before retrying `npm test`.
