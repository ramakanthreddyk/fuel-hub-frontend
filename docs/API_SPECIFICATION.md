
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

## 1. DASHBOARD ENDPOINTS

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

## 2. STATION MANAGEMENT

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

### GET /stations/compare
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

### GET /stations/ranking
**Query Parameters:**
- `metric`: "sales" | "volume" | "growth"
- `period`: "today" | "week" | "month"

**Expected Response:**
```typescript
Array<{
  id: string;
  name: string;
  sales: number;
  volume: number;
  growth: number;
  efficiency: number;
  rank: number;
}>
```

---

## 3. ANALYTICS ENDPOINTS

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

### GET /analytics/peak-hours
**Query Parameters:** `stationId?`: string
**Expected Response:**
```typescript
Array<{
  timeRange: string; // "09:00-10:00"
  avgSales: number;
  avgVolume: number;
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

## 4. INVENTORY MANAGEMENT

### GET /fuel-inventory
**Query Parameters:**
- `stationId?`: string
- `fuelType?`: "petrol" | "diesel"

**Expected Response:**
```typescript
Array<{
  id: string;
  stationId: string;
  stationName: string;
  fuelType: "petrol" | "diesel";
  currentVolume: number;
  lastUpdated: string; // ISO date
}>
```

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

### PATCH /alerts/{alertId}/read
**Purpose:** Mark alert as read
**Expected Response:** `204 No Content`

### DELETE /alerts/{alertId}
**Purpose:** Dismiss alert
**Expected Response:** `204 No Content`

---

## 5. REPORTS & EXPORT

### GET /reports/sales
**Query Parameters:**
- `startDate?`: ISO date
- `endDate?`: ISO date
- `paymentMethod?`: string
- `nozzleId?`: string
- `stationId?`: string

**Expected Response:**
```typescript
{
  data: Array<{
    id: string;
    date: string;
    fuelType: "petrol" | "diesel" | "premium";
    volume: number;
    pricePerLitre: number;
    amount: number;
    paymentMethod: "cash" | "card" | "upi" | "credit";
    attendant: string;
    stationName: string;
    nozzleNumber: number;
  }>;
  summary: {
    totalVolume: number;
    totalRevenue: number;
    fuelTypeBreakdown: {
      petrol: { volume: number; revenue: number };
      diesel: { volume: number; revenue: number };
      premium: { volume: number; revenue: number };
    };
    paymentMethodBreakdown: {
      cash: number;
      card: number;
      upi: number;
      credit: number;
    };
  };
}
```

### GET /reports/sales/export
**Query Parameters:** Same as sales report
**Expected Response:** CSV file blob

### POST /reports/export
**Request Body:**
```typescript
{
  type: "sales" | "inventory" | "creditors" | "performance" | "reconciliation";
  format: "pdf" | "excel" | "csv";
  stationId?: string;
  dateRange?: { from: Date; to: Date };
}
```
**Expected Response:** File blob

### POST /reports/schedule
**Request Body:**
```typescript
{
  type: string;
  stationId?: string;
  frequency: "daily" | "weekly" | "monthly";
}
```
**Expected Response:** `201 Created`

---

## 6. ERROR HANDLING

All endpoints should return consistent error responses:

### 400 Bad Request
```typescript
{
  error: "VALIDATION_ERROR";
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
  error: "UNAUTHORIZED";
  message: "Invalid or expired token";
}
```

### 403 Forbidden
```typescript
{
  error: "FORBIDDEN";
  message: "Insufficient permissions";
}
```

### 404 Not Found
```typescript
{
  error: "NOT_FOUND";
  message: "Resource not found";
}
```

### 500 Internal Server Error
```typescript
{
  error: "INTERNAL_ERROR";
  message: "An unexpected error occurred";
}
```

---

## 7. PAGINATION

For large datasets, use cursor-based pagination:

**Query Parameters:**
- `limit?`: number (default: 50, max: 500)
- `cursor?`: string

**Response Format:**
```typescript
{
  data: Array<T>;
  pagination: {
    hasNext: boolean;
    nextCursor?: string;
    total?: number;
  };
}
```

---

## 8. REAL-TIME UPDATES

Frontend expects WebSocket support for:
- Alert notifications
- Live sales updates
- Inventory level changes

**WebSocket Events:**
```typescript
// Alerts
{
  type: "ALERT_CREATED";
  data: Alert;
}

// Sales updates
{
  type: "SALE_COMPLETED";
  data: {
    stationId: string;
    amount: number;
    timestamp: string;
  };
}
```

---

## Notes for Backend Implementation

1. **Multi-tenancy:** All data must be scoped by `x-tenant-id` header
2. **Role-based access:** Endpoints should respect user roles (superadmin, owner, manager, attendant)
3. **Data validation:** Validate all inputs and return 400 with details for validation errors
4. **Performance:** Implement caching for dashboard endpoints
5. **Audit logs:** Track all data modifications for compliance
6. **Rate limiting:** Implement appropriate rate limits per tenant/user
7. **File uploads:** Support multipart/form-data for bulk imports
8. **Date handling:** Always use ISO 8601 format for dates
