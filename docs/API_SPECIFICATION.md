# FuelSync Hub - Frontend-Backend API Contract

## Overview
This document defines the API contract between the FuelSync Hub frontend and backend systems. The frontend is built with React + TypeScript and expects REST API endpoints with JSON responses.

**IMPORTANT: All data isolation is handled by tenant_id (UUID) only. Never use schema_name for routing or access.**

## Authentication & Headers
All API requests include:
```
Authorization: Bearer <jwt_token>
Content-Type: application/json
x-tenant-id: <tenant_uuid>
```

## Base URL
All endpoints are prefixed with `/api/v1`

---

## 1. AUTHENTICATION ENDPOINTS

### POST /auth/login
**Purpose:** Authenticate user and get JWT token
**Request Body:**
```typescript
{
  email: string; // Standard email format
  password: string;
}
```

**Expected Response:**
```typescript
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "superadmin" | "owner" | "manager" | "attendant";
    tenantId?: string;      // UUID for data isolation
    tenantName?: string;    // Display name only
  };
}
```

---

## 2. USER MANAGEMENT ENDPOINTS

### GET /users
**Purpose:** List all users in tenant
**Roles Required:** owner, manager

**Expected Response:**
```typescript
{
  users: Array<{
    id: string;
    name: string;
    email: string;
    role: "owner" | "manager" | "attendant";
    createdAt: string;
    stationId?: string;
    stationName?: string;
  }>;
}
```

### GET /users/:id
**Purpose:** Get specific user details
**Roles Required:** owner, manager

**Expected Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: "owner" | "manager" | "attendant";
  createdAt: string;
  stationId?: string;
  stationName?: string;
}
```

### POST /users
**Purpose:** Create new user
**Roles Required:** owner only

**Request Body:**
```typescript
{
  name: string;
  email: string;
  password: string;
  role: "manager" | "attendant";
  stationId?: string;
}
```

**Expected Response:**
```typescript
{
  id: string;
  name: string;
  email: string;
  role: "manager" | "attendant";
  createdAt: string;
}
```

### PUT /users/:id
**Purpose:** Update user details
**Roles Required:** owner only

**Request Body:**
```typescript
{
  name?: string;
  role?: "manager" | "attendant";
  stationId?: string;
}
```

### POST /users/:id/change-password
**Purpose:** Change user's own password
**Roles Required:** any authenticated user (for own account)

**Request Body:**
```typescript
{
  currentPassword: string;
  newPassword: string;
}
```

### POST /users/:id/reset-password
**Purpose:** Reset user password (admin action)
**Roles Required:** owner only

**Request Body:**
```typescript
{
  newPassword: string;
}
```

### DELETE /users/:id
**Purpose:** Delete user
**Roles Required:** owner only

---

## 3. SUPERADMIN ENDPOINTS

### GET /admin/organizations
**Purpose:** List all tenant organizations
**Role Required:** superadmin

**Expected Response:**
```typescript
Array<{
  id: string;                    // tenant_id (UUID)
  name: string;                  // Display name
  planName: string;
  status: "active" | "suspended" | "cancelled";
  createdAt: string;
  adminUser?: {
    id: string;
    name: string;
    email: string;
  };
}>
```

### POST /admin/organizations
**Purpose:** Create new tenant organization
**Role Required:** superadmin

**Request Body:**
```typescript
{
  name: string;           // Organization display name
  planId: string;         // Subscription plan ID
  adminEmail: string;     // Admin user email
  adminPassword: string;  // Admin user password
}
```

**Expected Response:**
```typescript
{
  id: string;        // tenant_id (UUID)
  name: string;
  planId: string;
  status: "active";
  createdAt: string;
  adminUser: {
    id: string;
    email: string;
    name: string;
  };
}
```

### PUT /admin/organizations/:id/status
**Purpose:** Update tenant status
**Role Required:** superadmin

**Request Body:**
```typescript
{
  status: "active" | "suspended" | "cancelled";
}
```

### GET /admin/plans
**Purpose:** List all subscription plans
**Role Required:** superadmin

**Expected Response:**
```typescript
Array<{
  id: string;
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}>
```

### POST /admin/plans
**Purpose:** Create new subscription plan
**Role Required:** superadmin

**Request Body:**
```typescript
{
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
}
```

### GET /admin/users
**Purpose:** List all admin users
**Role Required:** superadmin

**Expected Response:**
```typescript
Array<{
  id: string;
  name: string;
  email: string;
  role: "superadmin";
  createdAt: string;
  lastLogin?: string;
}>
```

---

## 4. DASHBOARD ENDPOINTS

### GET /dashboard/sales-summary
**Purpose:** Get sales overview with profit metrics
**Query Parameters:**
- `range`: "daily" | "weekly" | "monthly" | "yearly"
- `stationId?`: string (optional station filter)
- `dateFrom?`: ISO date string
- `dateTo?`: ISO date string

**Expected Response:**
```typescript
{
  totalSales: number;
  totalVolume: number;
  transactionCount: number;
  totalProfit: number;
  profitMargin: number;
  period: string;
}
```

### GET /dashboard/payment-methods
**Query Parameters:** Same as sales-summary
**Expected Response:**
```typescript
Array<{
  paymentMethod: "cash" | "card" | "upi" | "credit";
  amount: number;
  percentage: number;
}>
```

### GET /dashboard/fuel-breakdown
**Expected Response:**
```typescript
Array<{
  fuelType: "petrol" | "diesel" | "premium";
  volume: number;
  amount: number;
}>
```

### GET /dashboard/top-creditors
**Query Parameters:** `limit?: number`, station filters
**Expected Response:**
```typescript
Array<{
  id: string;
  partyName: string;
  outstandingAmount: number;
  creditLimit?: number;
}>
```

### GET /dashboard/sales-trend
**Query Parameters:** `days?: number`, station filters
**Expected Response:**
```typescript
Array<{
  date: string; // ISO date
  amount: number;
  volume: number;
}>
```

---

## 5. STATION MANAGEMENT

### GET /stations
**Query Parameters:**
- `includeMetrics?: boolean`

**Expected Response:**
```typescript
Array<{
  id: string;
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
  // If includeMetrics=true:
  todaySales?: number;
  monthlySales?: number;
  salesGrowth?: number;
  activePumps?: number;
  totalPumps?: number;
}>
```

### GET /stations/:id
**Expected Response:**
```typescript
{
  id: string;
  name: string;
  address: string;
  status: "active" | "inactive" | "maintenance";
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
}
```

### GET /pumps
**Query Parameters:**
- `stationId?: string`

**Expected Response:**
```typescript
Array<{
  id: string;
  label: string;
  serialNumber: string;
  status: "active" | "inactive" | "maintenance";
  stationId: string;
}>
```

### GET /nozzles
**Query Parameters:**
- `pumpId?: string`

**Expected Response:**
```typescript
Array<{
  id: string;
  nozzleNumber: number;
  fuelType: "petrol" | "diesel" | "premium";
  status: "active" | "inactive" | "maintenance";
  pumpId: string;
}>
```

---

## 6. ERROR HANDLING

All endpoints should return consistent error responses:

### 400 Bad Request
```typescript
{
  success: false;
  message: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
}
```

### 401 Unauthorized
```typescript
{
  success: false;
  message: "Invalid or expired token" | "User not found: email@domain.com";
}
```

### 403 Forbidden
```typescript
{
  success: false;
  message: "Insufficient permissions";
}
```

### 404 Not Found
```typescript
{
  success: false;
  message: "Resource not found";
}
```

### 500 Internal Server Error
```typescript
{
  success: false;
  message: "An unexpected error occurred";
}
```

---

## TENANT CONTEXT & DATA ISOLATION

### How Tenant Context Works

1. **Authentication:**
   - User logs in with email/password
   - JWT token contains `tenantId` (UUID) for non-superadmin users
   - Frontend stores both `tenantId` and `tenantName`

2. **API Requests:**
   - All tenant-scoped requests include `x-tenant-id` header
   - Backend filters all data by this tenant_id
   - No schema switching or dynamic database contexts

3. **Data Access:**
   - Database uses row-level security with tenant_id columns
   - Each tenant's data is completely isolated
   - SuperAdmin can access cross-tenant data via special endpoints

### Supported User Types

- **SuperAdmin**: Platform-wide access, manages tenants and plans
- **Owner**: Full tenant access (tenant_id in JWT)
- **Manager**: Limited tenant access (tenant_id in JWT)  
- **Attendant**: Basic tenant access (tenant_id in JWT)

### Automatic User Creation

When a tenant is created:
- An owner user is automatically created
- Email format: provided admin email
- Password: provided admin password
- Role: `owner`
- tenantId: assigned automatically

---

## REMOVED CONCEPTS

The following concepts have been completely removed from the API:

❌ **schema_name, schemaName, tenant_schema**
❌ **Dynamic schema switching endpoints**
❌ **Schema-based routing or filtering**
❌ **Per-tenant database schemas**

---

## Notes for Frontend Implementation

1. **Tenant Context**: Use `tenantId` for all data operations, `tenantName` for display only
2. **API Headers**: Always include `x-tenant-id` from auth context (handled by apiClient)
3. **State Management**: Track tenants by `tenantId` (UUID), not schema names
4. **Error Handling**: Handle 403 Forbidden responses gracefully
5. **SuperAdmin Features**: Only show cross-tenant features to superadmin users

**Remember: All data isolation is by tenant_id (UUID), not DB schema.**
