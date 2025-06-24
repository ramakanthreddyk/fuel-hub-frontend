
# FuelSync Hub - Frontend-Backend API Contract

## Overview
This document defines the API contract between the FuelSync Hub frontend and backend systems. The frontend is built with React + TypeScript and expects REST API endpoints with JSON responses.

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
  email: string; // Supports formats: user@domain.com, owner@tenant-schema-name.com
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
    tenantId?: string;
    tenantName?: string;
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

## 3. SUPERADMIN ANALYTICS ENDPOINTS

### GET /analytics/dashboard
**Purpose:** Get SuperAdmin dashboard metrics
**Role Required:** superadmin

**Expected Response:**
```typescript
{
  totalTenants: number;
  activeTenants: number;
  totalPlans: number;
  totalAdminUsers: number;
  totalUsers: number;
  totalStations: number;
  signupsThisMonth: number;
  recentTenants: Array<{
    id: string;
    name: string;
    createdAt: string;
    status: "active" | "suspended" | "cancelled";
  }>;
  tenantsByPlan: Array<{
    planName: string;
    count: number;
    percentage: number;
  }>;
}
```

### GET /analytics/tenant/:id
**Purpose:** Get detailed analytics for a specific tenant
**Role Required:** superadmin

**Expected Response:**
```typescript
{
  tenant: {
    id: string;
    name: string;
    status: string;
    planName: string;
    createdAt: string;
  };
  metrics: {
    totalUsers: number;
    totalStations: number;
    totalSales: number;
    totalVolume: number;
    monthlyGrowth: number;
  };
  stationMetrics: Array<{
    stationId: string;
    stationName: string;
    sales: number;
    volume: number;
    transactions: number;
  }>;
  userActivity: Array<{
    userId: string;
    userName: string;
    lastLogin: string;
    role: string;
    isActive: boolean;
  }>;
}
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

## 6. SUPERADMIN MANAGEMENT

### GET /admin/tenants
**Purpose:** List all tenant organizations
**Role Required:** superadmin

**Expected Response:**
```typescript
Array<{
  id: string;
  name: string;
  schemaName: string;
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

### POST /admin/tenants
**Purpose:** Create new tenant organization
**Role Required:** superadmin

**Request Body:**
```typescript
{
  name: string;
  planId: string;
  adminEmail: string;
  adminPassword: string;
  schemaName: string;
}
```

### PUT /admin/tenants/:id/status
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

## 7. ERROR HANDLING

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

## 8. SUPPORTED EMAIL FORMATS

The authentication system supports these email formats:
- Standard: `user@domain.com`
- Tenant-specific: `owner@tenant-schema-name.com` (e.g., `owner@acme-fuels.com`)
- Auto-created owners use format: `owner@tenant-schema-name.com` with password `tenant123`

---

## 9. ROLE-BASED ACCESS CONTROL

### User Roles Hierarchy:
1. **SuperAdmin**: Platform-wide access, can manage tenants and plans
2. **Owner**: Full tenant access, can manage all users and data
3. **Manager**: Can view users, manage stations and operations
4. **Attendant**: Limited access, can record readings and sales

### Permission Matrix:
- **User Management**: Owner only (create/edit/delete users)
- **View Users**: Owner, Manager
- **Password Management**: Users can change own password, Owner can reset any password
- **Station Management**: Owner, Manager
- **Sales/Readings**: Owner, Manager, Attendant

---

## 10. AUTOMATIC USER CREATION

When a tenant is created:
- An owner user is automatically created
- Email format: `owner@tenant-schema-name.com` (underscores become hyphens)
- Default password: `tenant123`
- Role: `owner`

Example: Tenant with schema `acme_fuels` gets owner email `owner@acme-fuels.com`

---

## Notes for Frontend Implementation

1. **Role-based UI**: Show/hide features based on user role
2. **Permission Checks**: Validate user permissions before API calls
3. **Password Management**: Provide change password functionality in settings
4. **Error Handling**: Handle 403 Forbidden responses gracefully
5. **User Creation**: Only show create user option to owners
6. **Auto-generated Credentials**: Display auto-generated credentials when creating tenants
