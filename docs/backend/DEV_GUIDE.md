---
title: FuelSync Development Guide
lastUpdated: 2025-07-05
category: backend
---

# FuelSync Development Guide

## Overview
This guide covers setting up FuelSync for local development and Azure deployment:
1. **Local Development** (with Azure PostgreSQL)
2. **Azure Production** (using Azure Web App)

## Prerequisites
- Node.js 20.x
- npm or yarn
- Git
- Azure PostgreSQL instance (existing)

---

## 1. Local Development Setup

### Step 1: Environment Configuration
```bash
# Clone and install
git clone <your-repo>
cd fuelsync
npm install

# Create local environment file
cp .env.example .env.development
```

### Step 2: Configure .env.development
```env
NODE_ENV=development

# Azure PostgreSQL Configuration
DB_HOST=fuelsync-server.postgres.database.azure.com
DB_PORT=5432
DB_USER=fueladmin
DB_PASSWORD=xxxxxx
DB_NAME=fuelsync_db

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=1h
```

### Step 3: Database Setup
```bash
# Run migrations
npm run db:migrate

# Seed with demo data
npm run seed:all

# Verify database
npm run db:status
```

### Step 4: Start Development Server
```bash
# Start server
npm run dev

# Server runs on http://localhost:3001
```

### Debug Request Logging

The server includes middleware that logs each request when `DEBUG_REQUESTS=true`.
This middleware runs automatically when `NODE_ENV` is not `production`.
Set `DEBUG_REQUESTS=false` to disable verbose logging.

### Step 5: Test Local API
```bash
# Test health endpoint
curl http://localhost:3001/health

# Test admin login (no tenant header)
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fuelsync.dev","password":"password"}'

# Test tenant user login (with tenant header)
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: demo_tenant_001" \
  -d '{"email":"owner@demo.com","password":"password"}'
```

---

## 4. Development Workflow

### Local Development
```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Run tests
npm test

# 4. Commit changes
git add .
git commit -m "Your changes"
```

### Deployment
```bash
# 1. Push to your Azure remote to deploy
git push azure main

# 2. Verify deployment
curl https://your-app.azurewebsites.net/health

# 3. Run migrations if schema changed
npm run migrate:up
```

---

## 5. API Endpoints

### Authentication
- `POST /v1/auth/login` - User login
- `POST /v1/auth/logout` - User logout

### Admin (SuperAdmin only)
- `GET /v1/admin/tenants` - List all tenants
- `POST /v1/admin/tenants` - Create tenant

### Tenant APIs (Require x-tenant-id header)
- `GET /v1/users` - List users
- `GET /v1/stations` - List stations
- `GET /v1/pumps` - List pumps

### Utility
- `GET /health` - Health check
- `GET /schemas` - Debug database schemas

---

## 6. Default Credentials

### SuperAdmin (No tenant header required)
- Email: `admin@fuelsync.dev`
- Password: `password`

### Demo Tenant Users (Require `x-tenant-id: demo_tenant_001`)
- Owner: `owner@demo.com` / `password`
- Manager: `manager@demo.com` / `password`
- Attendant: `attendant@demo.com` / `password`

---

## 7. Environment Comparison

| Feature | Local | Azure |
|---------|-------|-------|
| Database | Azure PostgreSQL | Azure PostgreSQL |
| Environment | .env.development | Azure App Settings |
| URL | localhost:3001 | your-app.azurewebsites.net |
| CORS | Not needed | Required |
| Migrations | npm scripts | npm scripts |

---

## 8. Next Steps

1. **Complete local setup** and verify all endpoints work
2. **Deploy to Azure** using the steps in `AZURE_DEPLOYMENT.md`
3. **Test production** endpoints
4. **Set up CI/CD** for automated deployments
5. **Add monitoring** and error tracking
6. **Implement proper logging** for production debugging

---

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Verify environment variables
3. Test database connectivity
4. Check Azure deployment logs
5. Consider container redeploy if connectivity issues persist
