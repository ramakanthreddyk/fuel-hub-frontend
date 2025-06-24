
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
  email: string; // Supports formats: user@domain.com, user@tenant_name.com
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

## 2. SUPERADMIN ANALYTICS ENDPOINTS

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
  totalUsers: number; // Users across all tenants
  totalStations: number; // Stations across all tenants
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

## 3. DASHBOARD ENDPOINTS

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

## 4. STATION MANAGEMENT

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

## 5. SUPERADMIN MANAGEMENT

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
  schemaName: string; // Auto-generated from name
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
  role: "superadmin" | "admin";
  createdAt: string;
  lastLogin?: string;
}>
```

---

## 6. ANALYTICS ENDPOINTS

### GET /analytics/station-comparison
**Query Parameters:**
- `stationIds`: comma-separated UUIDs
- `period`: "today" | "week" | "month"

**Expected Response:**
```typescript
Array<{
  id: string;
  stationName: string;
  sales: number;
  volume: number;
  transactions: number;
  growth: number;
}>
```

### GET /analytics/hourly-sales
**Query Parameters:**
- `stationId?`: string
- `dateFrom?`: ISO date
- `dateTo?`: ISO date

**Expected Response:**
```typescript
Array<{
  hour: string; // "00", "01", ..., "23"
  sales: number;
  volume: number;
  transactions: number;
}>
```

### GET /analytics/fuel-performance
**Expected Response:**
```typescript
Array<{
  fuelType: "petrol" | "diesel" | "premium";
  volume: number;
  sales: number;
  margin: number;
  growth: number;
}>
```

### GET /analytics/superadmin
**Purpose:** Platform-wide analytics for superadmin
**Role Required:** superadmin

**Expected Response:**
```typescript
{
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  salesVolume: number;
  totalRevenue: number;
  monthlyGrowth: Array<{
    month: string;
    tenants: number;
    revenue: number;
  }>;
  topTenants: Array<{
    id: string;
    name: string;
    stationsCount: number;
    revenue: number;
  }>;
}
```

---

## 7. INVENTORY & ALERTS

### GET /inventory/alerts
**Query Parameters:** `unreadOnly?: boolean`
**Expected Response:**
```typescript
Array<{
  id: string;
  type: "inventory" | "credit" | "maintenance" | "sales" | "system";
  severity: "info" | "warning" | "critical";
  title: string;
  message: string;
  stationId: string;
  stationName: string;
  isRead: boolean;
  isActive: boolean;
  createdAt: string;
  metadata?: Record<string, any>;
}>
```

---

## 8. ERROR HANDLING

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

## 9. SUPPORTED EMAIL FORMATS

The authentication system supports these email formats:
- Standard: `user@domain.com`
- Tenant-specific: `user@tenant_name.com` (e.g., `owner@production_tenant.com`)
- Demo accounts: `admin@fuelsync.dev`, `owner@demo.com`, etc.

---

## 10. MULTI-TENANCY & SECURITY

- **Tenant Isolation:** All data is scoped by `x-tenant-id` header
- **Role-based Access:** Endpoints respect user roles (superadmin, owner, manager, attendant)
- **SuperAdmin Access:** SuperAdmin can access cross-tenant data for platform management
- **Data Validation:** All inputs validated with detailed error responses
- **Audit Logs:** All data modifications tracked for compliance

---

## 11. PERFORMANCE & CACHING

- **Caching:** Dashboard endpoints implement appropriate caching
- **Rate Limiting:** Per tenant/user rate limits applied
- **Pagination:** Large datasets use cursor-based pagination
- **Compression:** All responses use gzip compression

---

## Notes for Frontend Implementation

1. **Error Handling:** Always check `success` field in responses
2. **Loading States:** Implement proper loading skeletons
3. **Retry Logic:** Implement exponential backoff for failed requests
4. **Type Safety:** Use TypeScript interfaces for all API responses
5. **Multi-tenant Context:** Always include `x-tenant-id` except for SuperAdmin endpoints
6. **Date Handling:** Use ISO 8601 format consistently
