# Frontend API Expectations Analysis

## Summary
This document analyzes what API endpoints the frontend expects based on the API client files. This serves as a contract that the backend must fulfill.

## Base Configuration
- **Base URL**: `/api/v1` (configured in `client.ts`)
- **Authentication**: Bearer token in Authorization header
- **Tenant Context**: `x-tenant-id` header for multi-tenancy
- **Content Type**: `application/json`

## Authentication Flow

### Expected Endpoints
```typescript
POST /auth/login
POST /auth/logout  // ✅ Implemented in backend
POST /auth/refresh // ✅ Implemented in backend
```

### Login Request/Response
```typescript
// Request
{
  email: string;
  password: string;
}

// Response
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    tenantName?: string;
  };
}
```

## Dashboard API Expectations

### Sales Summary
```typescript
GET /dashboard/sales-summary?range=monthly
// Response: SalesSummary
{
  totalSales: number;
  totalVolume: number;
  transactionCount: number;
  period: string;
}
```

### Payment Method Breakdown
```typescript
GET /dashboard/payment-methods
// Response: PaymentMethodBreakdown[]
[{
  paymentMethod: string;
  amount: number;
  percentage: number;
}]
```

### Fuel Type Breakdown
```typescript
GET /dashboard/fuel-breakdown
// Response: FuelTypeBreakdown[]
[{
  fuelType: string;
  volume: number;
  amount: number;
}]
```

### Top Creditors
```typescript
GET /dashboard/top-creditors?limit=5
// Response: TopCreditor[]
[{
  id: string;
  partyName: string;
  outstandingAmount: number;
  creditLimit?: number;
}]
```

### Sales Trend
```typescript
GET /dashboard/sales-trend?days=7
// Response: DailySalesTrend[]
[{
  date: string;
  amount: number;
  volume: number;
}]
```

## Station Management

### Endpoints
```typescript
GET /stations     // ✅ Working
POST /stations    // ✅ Working
GET /stations/:id // ✅ Working (expected by frontend)
PUT /stations/:id // ✅ Working
DELETE /stations/:id // ✅ Working
```

### Station Data Structure
```typescript
{
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;  // ⚠️ May be missing in backend
  pumpCount: number;       // ⚠️ May be missing in backend
  createdAt: string;
}
```

## Sales Management

### Endpoints
```typescript
GET /sales?stationId=X&startDate=Y&endDate=Z&paymentMethod=W
```

### Sales Data Structure
```typescript
{
  id: string;
  nozzleId: string;
  stationId: string;
  volume: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  fuelPrice: number;
  amount: number;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  status: 'draft' | 'posted';
  recordedAt: string;
  createdAt: string;
  station?: { name: string };
  nozzle?: { nozzleNumber: number; fuelType: string };
}
```

### Response Format
Frontend expects:
```typescript
{
  sales: Sale[]  // ⚠️ Backend might return array directly
}
```

## Fuel Prices

### Endpoints
```typescript
GET /fuel-prices     // ✅ Working
POST /fuel-prices    // ✅ Working
PUT /fuel-prices/:id // ⚠️ Frontend expects, backend may not implement
```

### Data Structure
```typescript
{
  id: string;
  stationId: string;
  fuelType: 'petrol' | 'diesel' | 'premium';
  price: number;
  validFrom: string;
  createdAt: string;
  station?: { name: string };
}
```

## Creditor Management

### Endpoints
```typescript
GET /creditors        // ✅ Working
POST /creditors       // ✅ Working
GET /creditors/:id    // ✅ Working
PUT /creditors/:id    // ✅ Working (frontend expects)
DELETE /creditors/:id // ✅ Working (frontend expects)
```

### Data Structure
```typescript
{
  id: string;
  name: string;
  contactNumber?: string;
  address?: string;
  status: 'active' | 'inactive';
  createdAt: string;
  partyName: string;
  creditLimit?: number;
  currentOutstanding?: number;
}
```

## Credit Payments

### Endpoints (URL Mismatch Issue)
```typescript
// Frontend expects:
GET /credit-payments?creditorId=X
POST /credit-payments

// Backend implements:
GET /creditors/payments
POST /creditors/payments
```

### Data Structures
```typescript
// Payment
{
  id: string;
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  referenceNumber?: string;
  notes?: string;
  createdAt: string;
}

// Create Request
{
  creditorId: string;
  amount: number;
  paymentMethod: 'cash' | 'bank_transfer' | 'check';
  referenceNumber?: string;
  notes?: string;
}
```

## Nozzle Readings

### Endpoints
```typescript
POST /nozzle-readings  // ✅ Working
GET /nozzle-readings?nozzleId=X&limit=1  // ✅ Working
```

### Data Structures
```typescript
// Reading
{
  id: string;
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
  createdAt: string;
}

// Create Request
{
  nozzleId: string;
  reading: number;
  recordedAt: string;
  paymentMethod: 'cash' | 'card' | 'upi' | 'credit';
  creditorId?: string;
}
```

## Reconciliation

### Endpoints (Structure Mismatch)
```typescript
// Frontend expects:
GET /reconciliation/daily-summary?stationId=X&date=Y  // ✅ Implemented
POST /reconciliation  // ✅ Working
GET /reconciliation?stationId=X  // ✅ Working

// Backend implements:
GET /reconciliation/:stationId  // Different structure
```

### Daily Summary Data Structure
```typescript
// Frontend expects from /reconciliation/daily-summary:
[{
  nozzleId: string;
  nozzleNumber: number;
  previousReading: number;
  currentReading: number;
  deltaVolume: number;
  pricePerLitre: number;
  saleValue: number;
  paymentMethod: string;
  cashDeclared: number;
  fuelType: string;
}]
```

### Reconciliation Record
```typescript
{
  id: string;
  stationId: string;
  date: string;
  totalExpected: number;
  cashReceived: number;
  reconciliationNotes?: string;
  managerConfirmation: boolean;
  createdAt: string;
  station?: { name: string };
}
```

## Analytics (Super Admin)

### Endpoints
```typescript
GET /admin/analytics  // ✅ Implemented in backend
```

### Data Structure
```typescript
{
  totalTenants: number;
  activeTenants: number;
  totalStations: number;
  salesVolume: number;
  totalRevenue: number;
  topTenants: [{
    id: string;
    name: string;
    revenue: number;
    stationsCount: number;
  }];
  monthlyGrowth: [{
    month: string;
    tenants: number;
    revenue: number;
  }];
}
```

## Error Handling Expectations

### Frontend Error Interceptor
- Automatically redirects to login on 401 errors
- Removes tokens from localStorage on auth failure
- Logs all API errors to console
- Expects consistent error response format

### Expected Error Format
```typescript
{
  error: string;
  message: string;
  code?: number;
}
```

## API Helper Utilities

### ensureArray Function
Frontend uses `ensureArray<T>()` utility to handle inconsistent response formats:
```typescript
// Handles both array and single object responses
return ensureArray<Station>(response.data);
```

This suggests backend responses might be inconsistent in format.

## Authentication Headers

### Required Headers
1. **Authorization**: `Bearer ${token}`
2. **x-tenant-id**: `${tenantId}` (for multi-tenancy)
3. **Content-Type**: `application/json`

### Token Storage
- Token stored in: `localStorage.getItem('fuelsync_token')`
- User data stored in: `localStorage.getItem('fuelsync_user')`

## Critical Mismatches Summary

1. **Base URL**: Frontend and backend now use `/api/v1`
2. **Dashboard Endpoints**: Implemented in backend
3. **Auth Endpoints**: Logout and refresh implemented
4. **Credit Payments URL**: Aligned to `/credit-payments`
5. **Reconciliation**: Daily summary endpoint implemented
6. **Analytics**: Super admin analytics missing
7. **Response Formats**: Some inconsistencies in array vs object responses

## Recommendations for Backend Team

1. **Immediate**: Fix base URL mismatch
2. **High Priority**: Implement all dashboard endpoints
3. **Medium Priority**: Add missing auth endpoints
4. **Low Priority**: Standardize response formats
5. **Documentation**: Keep this contract updated as APIs evolve

This document should serve as the definitive contract between frontend and backend teams.