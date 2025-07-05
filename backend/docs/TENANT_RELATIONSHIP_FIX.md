# Tenant Relationship Fix Guide

## Issues Fixed

### 1. Missing Tenant Context
- Added default tenant middleware to set `production_tenant` when no tenant ID is provided
- Added debug middleware to log request details for troubleshooting
- Enhanced CORS configuration to ensure proper headers

### 2. Tenant-User Relationship
- Created `fix-tenant-relationships.js` script to:
  - Ensure each tenant has a schema
  - Create owner users for each tenant
  - Create test stations for tenants without stations

### 3. SuperAdmin-Tenant Relationship
- SuperAdmin can now see all tenants
- Each tenant has proper owner users
- Each tenant has stations, pumps, and nozzles

## How to Apply the Fix

1. **Deploy the code changes**
   ```bash
   git add .
   git commit -m "Fix tenant relationships and CORS issues"
   git push azure master
   ```

2. **Run the fix script**
   ```bash
   cd /home/site/wwwroot
   npm run fix-tenants
   ```

## Testing the Fix

### 1. SuperAdmin View
- Login as SuperAdmin: `admin@fuelsync.com / Admin@123`
- Navigate to Tenants page
- Verify all tenants are visible
- Click on a tenant to see its details

### 2. Owner View
- Login as Owner: `owner@fuelsync.com / Admin@123`
- Verify stations are visible
- Navigate through stations → pumps → nozzles

### 3. API Testing
```bash
# Test with tenant ID header
curl -H "x-tenant-id: production_tenant" -H "Authorization: Bearer YOUR_TOKEN" https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net/api/v1/stations

# Test without tenant ID header (should default to production_tenant)
curl -H "Authorization: Bearer YOUR_TOKEN" https://fuelsync-api-demo-bvadbhg8bdbmg0ff.germanywestcentral-01.azurewebsites.net/api/v1/stations
```

## Tenant Data Model

```
SuperAdmin
  └── Tenants
       ├── Tenant 1
       │    ├── Owner User
       │    └── Stations
       │         ├── Station 1
       │         │    ├── Pumps
       │         │    │    └── Nozzles
       │         │    └── Inventory
       │         └── Station 2
       │              └── ...
       └── Tenant 2
            └── ...
```

## Troubleshooting

### If stations still don't appear:
1. Check the logs for tenant ID and schema name
2. Verify the tenant ID is being passed in the header
3. Check if the default tenant middleware is working
4. Run the fix-tenants script again

### If CORS issues persist:
1. Check the browser console for specific CORS errors
2. Verify the CORS headers in the response
3. Try using a CORS browser extension for testing