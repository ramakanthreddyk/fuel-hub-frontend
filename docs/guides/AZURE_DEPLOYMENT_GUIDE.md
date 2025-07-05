---
title: Azure Deployment Guide
lastUpdated: 2025-07-05
category: guides
---

# Azure Deployment Guide

## Database Setup

### 1. Set Environment Variables in Azure

In the Azure Portal, go to your App Service and add these environment variables:

```
DB_HOST=fuelsync-server.postgres.database.azure.com
DB_PORT=5432
DB_NAME=fuelsync_db
DB_USER=fueladmin
DB_PASSWORD=your_actual_password
```

**Note:** The backend reads these `DB_*` variables as its database configuration. See `src/utils/db.ts` for details.

### 2. Deploy the Application

Push your code to the Azure Git repository:

```bash
git add .
git commit -m "Fix deployment issues"
git push azure master
```

### 3. Run Database Setup Scripts

Connect to the Azure App Service console and run:

```bash
cd /home/site/wwwroot
npm run azure-seed        # Create initial database
npm run update-azure-seed # Add SuperAdmin test data
```

## Testing the Deployment

### Login Credentials

```
SuperAdmin: admin@fuelsync.com / Admin@123
SuperAdmin: admin2@fuelsync.com / Admin@123
Admin: support@fuelsync.com / Admin@123

Owner: owner@fuelsync.com / Admin@123
Manager: manager@fuelsync.com / Admin@123
Attendant: attendant@fuelsync.com / Admin@123
```

### Test API Endpoints

**SuperAdmin Endpoints:**
```
GET /api/v1/admin/dashboard
GET /api/v1/admin/tenants
GET /api/v1/admin/plans
GET /api/v1/admin/users
```

**Tenant Endpoints:**
```
GET /api/v1/stations
GET /api/v1/pumps
GET /api/v1/nozzles
GET /api/v1/fuel-prices
GET /api/v1/sales
GET /api/v1/creditors
```

## Troubleshooting

### Database Connection Issues

If you see connection errors:

1. Check Azure PostgreSQL firewall rules
2. Verify environment variables are set correctly
3. Ensure SSL is enabled for the connection

### Missing Tables or Data

If tables or data are missing:

1. Run the Azure seed script again
2. Check for errors in the console output
3. Verify the database user has proper permissions

### API 502 Errors

If you see 502 Bad Gateway errors:

1. Check if the tenant ID header is included in requests
2. Verify the database connection is working
3. Check Azure App Service logs for errors

## Maintenance

### Regular Backups

Set up automated backups for the Azure PostgreSQL database:

1. Go to Azure Portal > PostgreSQL server
2. Navigate to Backups
3. Configure backup retention and frequency

### Monitoring

Set up monitoring for the Azure App Service:

1. Go to Azure Portal > App Service
2. Navigate to Monitoring
3. Configure alerts for errors and performance issues