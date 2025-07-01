
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

## Response Format Standardization

### Successful Responses
All successful responses follow this format:
```typescript
{
  success: true;
  data: T; // Actual response data
  message?: string; // Optional success message
}
```

### Error Responses
All error responses follow this format:
```typescript
{
  success: false;
  message: string; // Error description
  details?: Array<{
    field: string;
    message: string;
  }>; // Validation errors
}
```

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
  success: true;
  data: {
    token: string;
    user: {
      id: string;
      name: string;
      email: string;
      role: "superadmin" | "owner" | "manager" | "attendant";
      tenantId?: string;      // UUID for data isolation
      tenantName?: string;    // Display name only
    };
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
  success: true;
  data: {
    users: Array<{
      id: string;
      name: string;
      email: string;
      role: "owner" | "manager" | "attendant";
      createdAt: string;
      stationId?: string;
      stationName?: string;
    }>;
  };
}
```

### GET /users/:id
**Purpose:** Get specific user details
**Roles Required:** owner, manager

**Expected Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    name: string;
    email: string;
    role: "owner" | "manager" | "attendant";
    createdAt: string;
    stationId?: string;
    stationName?: string;
  };
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
  stationId?: string; // Optional station assignment
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

---

## 3. STATION MANAGEMENT

### GET /stations
**Query Parameters:**
- `includeMetrics?: boolean` - Include sales metrics

**Expected Response:**
```typescript
{
  success: true;
  data: {
    stations: Array<{
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
      lastActivity?: string;
      efficiency?: number;
    }>;
  };
}
```

### POST /stations
**Purpose:** Create new station
**Roles Required:** owner only

**Request Body:**
```typescript
{
  name: string;
  address: string;
  status?: "active" | "inactive" | "maintenance"; // Optional, defaults to 'active'
}
```

---

## 4. PUMP & NOZZLE MANAGEMENT

### GET /pumps
**Query Parameters:**
- `stationId?: string` - Filter by station

**Expected Response:**
```typescript
{
  success: true;
  data: {
    pumps: Array<{
      id: string;
      label: string;
      serialNumber: string;
      status: "active" | "inactive" | "maintenance";
      stationId: string;
      nozzleCount?: number;
    }>;
  };
}
```

### POST /pumps
**Request Body:**
```typescript
{
  label: string;
  serialNumber: string;
  status?: "active" | "inactive" | "maintenance"; // Optional, defaults to 'active'
  stationId: string;
}
```

### GET /nozzles
**Query Parameters:**
- `pumpId?: string` - Filter by pump

**Expected Response:**
```typescript
{
  success: true;
  data: {
    nozzles: Array<{
      id: string;
      nozzleNumber: number;
      fuelType: "petrol" | "diesel" | "premium";
      status: "active" | "inactive" | "maintenance";
      pumpId: string;
      createdAt: string;
    }>;
  };
}
```

### POST /nozzles
**Request Body:**
```typescript
{
  pumpId: string;
  nozzleNumber: number;
  fuelType: "petrol" | "diesel" | "premium";
  status?: "active" | "inactive" | "maintenance"; // Optional, defaults to 'active'
}
```

---

## 5. READINGS & SALES

### POST /nozzle-readings
**Request Body:**
```typescript
{
  nozzleId: string;
  reading: number;
  recordedAt?: string; // Optional, defaults to current time
  paymentMethod: "cash" | "card" | "upi" | "credit";
  creditorId?: string; // Required if paymentMethod is 'credit'
}
```

**Expected Response:**
```typescript
{
  success: true;
  data: {
    id: string;
    nozzleId: string;
    reading: number;
    recordedAt: string;
    paymentMethod: string;
    creditorId?: string;
    createdAt: string;
    // Calculated fields
    volume?: number;
    amount?: number;
    pricePerLitre?: number;
  };
}
```

### GET /sales
**Query Parameters:**
- `stationId?: string`
- `startDate?: string` / `dateFrom?: string`
- `endDate?: string` / `dateTo?: string`
- `paymentMethod?: string`

**Expected Response:**
```typescript
{
  success: true;
  data: {
    sales: Array<{
      id: string;
      nozzleId: string;
      stationId: string;
      volume: number;
      fuelType: string;
      fuelPrice: number;
      amount: number;
      paymentMethod: string;
      creditorId?: string;
      status: "posted" | "draft";
      recordedAt: string;
      createdAt: string;
    }>;
  };
}
```

---

## 6. FUEL PRICE MANAGEMENT

### GET /fuel-prices
**Expected Response:**
```typescript
{
  success: true;
  data: {
    prices: Array<{
      id: string;
      stationId: string;
      fuelType: "petrol" | "diesel" | "premium";
      price: number;
      validFrom: string;
      createdAt: string;
      stationName?: string;
    }>;
  };
}
```

### POST /fuel-prices
**Request Body:**
```typescript
{
  stationId: string;
  fuelType: "petrol" | "diesel" | "premium";
  price: number;
  validFrom?: string; // Optional, defaults to current date
}
```

---

## 7. CREDITOR MANAGEMENT

### GET /creditors
**Expected Response:**
```typescript
{
  success: true;
  data: {
    creditors: Array<{
      id: string;
      partyName: string;
      contactPerson?: string;
      phoneNumber?: string;
      creditLimit?: number;
      outstandingAmount: number;
      paymentTerms?: string;
      notes?: string;
      createdAt: string;
    }>;
  };
}
```

### POST /credit-payments
**Request Body:**
```typescript
{
  creditorId: string;
  amount: number;
  paymentDate?: string; // Optional, defaults to current date
  paymentMethod: "cash" | "card" | "upi" | "credit";
  reference?: string;
  referenceNumber?: string;
  notes?: string;
}
```

---

## 8. DASHBOARD ENDPOINTS

### GET /dashboard/sales-summary
**Query Parameters:**
- `range`: "daily" | "weekly" | "monthly" | "yearly"
- `stationId?`: string (optional station filter)
- `dateFrom?`: ISO date string
- `dateTo?`: ISO date string

**Expected Response:**
```typescript
{
  success: true;
  data: {
    totalRevenue: number;
    totalVolume: number;
    salesCount: number;
    averageTicketSize: number;
    cashSales: number;
    creditSales: number;
    growthPercentage: number;
    totalProfit?: number;
    profitMargin?: number;
    period?: string;
    previousPeriodRevenue?: number;
  };
}
```

### GET /dashboard/payment-methods
**Expected Response:**
```typescript
{
  success: true;
  data: {
    paymentMethods: Array<{
      method: string;
      amount: number;
      percentage: number;
      count: number;
    }>;
  };
}
```

---

## 9. ATTENDANT ENDPOINTS

### GET /attendant/stations
**Purpose:** Get assigned stations for attendant
**Role Required:** attendant

**Expected Response:**
```typescript
{
  success: true;
  data: {
    stations: Array<{
      id: string;
      name: string;
      address: string;
      status: "active" | "inactive" | "maintenance";
      assignedAt: string;
    }>;
  };
}
```

### POST /attendant/cash-reports
**Request Body:**
```typescript
{
  stationId: string;
  cashAmount: number;
  reportDate?: string; // Optional, defaults to current date
  shift: "morning" | "afternoon" | "night";
  notes?: string;
}
```

### GET /attendant/alerts
**Expected Response:**
```typescript
{
  success: true;
  data: {
    alerts: Array<{
      id: string;
      type: "warning" | "error" | "info";
      priority: "low" | "medium" | "high" | "critical";
      title: string;
      message: string;
      stationId?: string;
      stationName?: string;
      createdAt: string;
      acknowledged: boolean;
      isActive?: boolean;
    }>;
  };
}
```

---

## 10. SUPERADMIN ENDPOINTS

### GET /admin/tenants
**Purpose:** List all tenant organizations
**Role Required:** superadmin

**Expected Response:**
```typescript
{
  success: true;
  data: {
    tenants: Array<{
      id: string;
      name: string;
      planName: string;
      status: "active" | "suspended" | "cancelled";
      createdAt: string;
      userCount: number;
      stationCount: number;
      lastActivity?: string;
      billingStatus?: "current" | "overdue" | "suspended";
    }>;
  };
}
```

### POST /admin/tenants
**Request Body:**
```typescript
{
  name: string;
  planId: string;
  ownerName: string; // or adminName
  ownerEmail: string; // or adminEmail  
  ownerPassword: string; // or adminPassword
}
```

### GET /admin/plans
**Expected Response:**
```typescript
{
  success: true;
  data: {
    plans: Array<{
      id: string;
      name: string;
      description: string;
      price: number;
      priceMonthly?: number;
      priceYearly?: number;
      maxStations: number;
      maxUsers: number;
      maxPumpsPerStation?: number;
      maxNozzlesPerPump?: number;
      features: string[];
      isActive: boolean;
      createdAt: string;
      tenantCount?: number;
      isPopular?: boolean;
    }>;
  };
}
```

---

## FIELD MAPPING REFERENCE

### Database to API Field Mapping
The backend should convert these `snake_case` database fields to `camelCase` API responses:

- `station_id` → `stationId`
- `pump_id` → `pumpId`
- `nozzle_id` → `nozzleId`
- `fuel_type` → `fuelType`
- `payment_method` → `paymentMethod`
- `creditor_id` → `creditorId`
- `recorded_at` → `recordedAt`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`
- `valid_from` → `validFrom`
- `party_name` → `partyName`
- `contact_person` → `contactPerson`
- `phone_number` → `phoneNumber`
- `credit_limit` → `creditLimit`
- `outstanding_amount` → `outstandingAmount`
- `payment_terms` → `paymentTerms`
- `payment_date` → `paymentDate`
- `reference_number` → `referenceNumber`
- `tenant_id` → `tenantId`
- `tenant_name` → `tenantName`

## ENHANCED FEATURES RECOMMENDATIONS

### 1. Pagination Support
Add to all list endpoints:
```typescript
// Query parameters
{
  page?: number;
  limit?: number;
  offset?: number;
}

// Response format
{
  success: true;
  data: {
    items: Array<T>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
  };
}
```

### 2. Advanced Filtering
Support filter operators:
```
GET /sales?filter[amount][gte]=100&filter[date][between]=2024-01-01,2024-01-31
```

### 3. Field Selection
Support field selection to reduce payload:
```
GET /stations?fields=id,name,status
```

### 4. Sorting
Support sorting on list endpoints:
```
GET /sales?sortBy=createdAt&sortOrder=desc
```

## ERROR HANDLING

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

### Error Response Examples

**Validation Error (400):**
```typescript
{
  success: false;
  message: "Validation failed";
  details: [
    {
      field: "email";
      message: "Email is required";
    },
    {
      field: "password";
      message: "Password must be at least 8 characters";
    }
  ];
}
```

**Authorization Error (401):**
```typescript
{
  success: false;
  message: "Invalid or expired token";
}
```

**Business Logic Error (422):**
```typescript
{
  success: false;
  message: "Cannot delete station with active pumps";
}
```

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

---

## NOTES FOR IMPLEMENTATION

1. **Consistency**: All responses should follow the standardized format
2. **Field Naming**: Use camelCase in API responses, convert from snake_case internally
3. **Optional Fields**: Many create request fields should be optional with sensible defaults
4. **Validation**: Implement proper validation with detailed error messages
5. **Performance**: Consider pagination for large datasets
6. **Security**: Always validate tenant context and user permissions
7. **Backward Compatibility**: Support field aliases where needed during migration

**Remember: All data isolation is by tenant_id (UUID), not DB schema.**
