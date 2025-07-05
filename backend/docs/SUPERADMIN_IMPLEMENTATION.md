# SuperAdmin Implementation Guide

## Overview

The SuperAdmin role is responsible for platform-level management, including:
- Tenant management (create, update, delete)
- Plan management (create, update, delete)
- Admin user management (create, update, delete)
- Platform analytics

## Database Schema

### Public Schema Tables

```sql
-- Subscription plans
CREATE TABLE public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_stations INTEGER NOT NULL DEFAULT 5,
  max_pumps_per_station INTEGER NOT NULL DEFAULT 10,
  max_nozzles_per_pump INTEGER NOT NULL DEFAULT 4,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant organizations
CREATE TABLE public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plan_id UUID REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SuperAdmin users
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Backend Implementation

### Services

1. **Tenant Service** (`src/services/tenant.service.ts`)
   - `createTenant(db, input)` - Creates tenant and default users
   - `listTenants(db)` - Lists all tenants
   - `getTenant(db, id)` - Gets tenant by ID
   - `updateTenantStatus(db, id, status)` - Updates tenant status
   - `deleteTenant(db, id)` - Deletes tenant and related data

2. **Plan Service** (`src/services/plan.service.ts`)
   - `createPlan(db, input)` - Creates subscription plan
   - `listPlans(db)` - Lists all plans
   - `getPlan(db, id)` - Gets plan by ID
   - `updatePlan(db, id, input)` - Updates plan
   - `deletePlan(db, id)` - Deletes plan

3. **Admin Service** (`src/services/admin.service.ts`)
   - `createAdminUser(db, input)` - Creates admin user
   - `listAdminUsers(db)` - Lists all admin users
   - `getAdminUser(db, id)` - Gets admin user by ID
   - `updateAdminUser(db, id, input)` - Updates admin user
   - `deleteAdminUser(db, id)` - Deletes admin user
   - `resetAdminPassword(db, id, newPassword)` - Resets admin password

### Controllers

**Admin Controller** (`src/controllers/admin.controller.ts`)
- Tenant management endpoints
- Plan management endpoints
- Admin user management endpoints
- Dashboard metrics endpoint

### Routes

**Admin API Router** (`src/routes/adminApi.router.ts`)
```typescript
// Dashboard
GET /api/v1/admin/dashboard

// Tenant Management
POST /api/v1/admin/tenants
GET /api/v1/admin/tenants
GET /api/v1/admin/tenants/:id
PUT /api/v1/admin/tenants/:id/status
DELETE /api/v1/admin/tenants/:id

// Plan Management
POST /api/v1/admin/plans
GET /api/v1/admin/plans
GET /api/v1/admin/plans/:id
PUT /api/v1/admin/plans/:id
DELETE /api/v1/admin/plans/:id

// Admin User Management
POST /api/v1/admin/users
GET /api/v1/admin/users
GET /api/v1/admin/users/:id
PUT /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
POST /api/v1/admin/users/:id/reset-password
```

## Frontend Requirements

### Pages

1. **Dashboard**
   - Platform metrics (tenant count, active tenants, plans, admin users)
   - Recent tenant activity
   - System status

2. **Tenants**
   - List of tenants with status
   - Create tenant form
   - Edit tenant status
   - Delete tenant option
   - View tenant details

3. **Plans**
   - List of subscription plans
   - Create plan form
   - Edit plan details
   - Delete plan option

4. **Admin Users**
   - List of admin users
   - Create admin user form
   - Edit admin user details
   - Reset password option
   - Delete admin user option

### Components

1. **TenantForm**
   ```typescript
   interface TenantFormProps {
     onSubmit: (data: { name: string; planId: string }) => void;
     plans: Plan[];
     isLoading?: boolean;
   }
   ```

2. **PlanForm**
   ```typescript
   interface PlanFormProps {
     onSubmit: (data: {
       name: string;
       maxStations?: number;
       maxPumpsPerStation?: number;
       maxNozzlesPerPump?: number;
       priceMonthly?: number;
       features?: string[];
     }) => void;
     initialData?: Plan;
     isLoading?: boolean;
   }
   ```

3. **AdminUserForm**
   ```typescript
   interface AdminUserFormProps {
     onSubmit: (data: { email: string; password?: string; role?: string }) => void;
     initialData?: AdminUser;
     isLoading?: boolean;
   }
   ```

4. **StatusBadge**
   ```typescript
   interface StatusBadgeProps {
     status: 'active' | 'suspended' | 'cancelled';
   }
   ```

5. **MetricsCard**
   ```typescript
   interface MetricsCardProps {
     title: string;
     value: number;
     icon: React.ReactNode;
     description?: string;
   }
   ```

### API Hooks

1. **useTenants**
   ```typescript
   const { data: tenants, isLoading, error } = useTenants();
   ```

2. **usePlans**
   ```typescript
   const { data: plans, isLoading, error } = usePlans();
   ```

3. **useAdminUsers**
   ```typescript
   const { data: adminUsers, isLoading, error } = useAdminUsers();
   ```

4. **useDashboardMetrics**
   ```typescript
   const { data: metrics, isLoading, error } = useDashboardMetrics();
   ```

## Implementation Steps

### Backend

1. ✅ Create tenant service with default user setup
2. ✅ Create plan service
3. ✅ Create admin user service
4. ✅ Create admin controller
5. ✅ Create admin API router
6. ✅ Update seed script with proper plan features

### Frontend

1. Create API client for admin endpoints
2. Create hooks for admin data
3. Create tenant management page
4. Create plan management page
5. Create admin user management page
6. Create dashboard page
7. Add navigation for SuperAdmin role

## Testing

### API Testing

```bash
# Create plan
curl -X POST http://localhost:3003/api/v1/admin/plans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Premium Plan", "maxStations": 20, "priceMonthly": 199.99, "features": ["Advanced Analytics", "API Access"]}'

# Create tenant
curl -X POST http://localhost:3003/api/v1/admin/tenants \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"name": "Test Tenant", "planId": "PLAN_ID"}'

# List tenants
curl -X GET http://localhost:3003/api/v1/admin/tenants \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Frontend Testing

1. Login as SuperAdmin
2. Navigate to Tenants page
3. Create a new tenant
4. Verify tenant appears in list
5. Test tenant status update
6. Test tenant deletion
