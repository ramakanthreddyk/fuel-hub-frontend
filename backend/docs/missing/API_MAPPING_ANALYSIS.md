# FuelSync API Mapping Analysis

## Overview
This document provides a comprehensive analysis of the API endpoints expected by the frontend versus what's actually implemented in the backend. It identifies mismatches, missing endpoints, and provides recommendations for alignment.

## Current Architecture
- **Frontend**: React/TypeScript application using Axios for API calls
- **Backend**: Node.js/Express API with PostgreSQL database
- **Base URL**: Frontend expects `/api/v1`, Backend serves `/v1`
- **Authentication**: JWT tokens with tenant-based multi-tenancy

## Critical Mismatches Found

### 1. Base URL Mismatch
- **Frontend expects**: `/api/v1/*`
- **Backend serves**: `/v1/*`
- **Impact**: All API calls will fail with 404
- **Fix**: Update frontend base URL or add `/api` prefix to backend routes

### 2. Missing Dashboard Endpoints
Frontend expects these dashboard endpoints that are **NOT implemented** in backend:

| Frontend Endpoint | Status | Backend Implementation |
|------------------|--------|----------------------|
| `GET /dashboard/sales-summary` | ✅ Implemented | `dashboard.controller.ts` |
| `GET /dashboard/payment-methods` | ✅ Implemented | `dashboard.controller.ts` |
| `GET /dashboard/fuel-breakdown` | ✅ Implemented | `dashboard.controller.ts` |
| `GET /dashboard/top-creditors` | ✅ Implemented | `dashboard.controller.ts` |
| `GET /dashboard/sales-trend` | ✅ Implemented | `dashboard.controller.ts` |

### 3. Missing Analytics Endpoints
| Frontend Endpoint | Status | Backend Implementation |
|------------------|--------|----------------------|
| `GET /admin/analytics` | ✅ Implemented | `adminAnalytics.controller.ts` |

### 4. Missing Auth Endpoints
| Frontend Endpoint | Status | Backend Implementation |
|------------------|--------|----------------------|
| `POST /auth/logout` | ✅ Implemented | `auth.controller.ts` |
| `POST /auth/refresh` | ✅ Implemented | `auth.controller.ts` |

### 5. Reconciliation Endpoint Mismatch
- **Frontend expects**: `GET /reconciliation/daily-summary?stationId=X&date=Y`
- **Backend implements**: `GET /reconciliation/:stationId` (different structure)

### 6. Credit Payments Endpoint Mismatch
- **Frontend expects**: `GET /credit-payments?creditorId=X`
- **Backend implements**: `GET /creditors/payments` (different path structure)

## Complete API Mapping

### ✅ Correctly Implemented Endpoints

| Endpoint | Frontend | Backend | Notes |
|----------|----------|---------|-------|
| `POST /auth/login` | ✅ | ✅ | Working |
| `GET /stations` | ✅ | ✅ | Working |
| `POST /stations` | ✅ | ✅ | Working |
| `PUT /stations/:id` | ✅ | ✅ | Working |
| `DELETE /stations/:id` | ✅ | ✅ | Working |
| `GET /fuel-prices` | ✅ | ✅ | Working |
| `POST /fuel-prices` | ✅ | ✅ | Working |
| `GET /creditors` | ✅ | ✅ | Working |
| `POST /creditors` | ✅ | ✅ | Working |
| `PUT /creditors/:id` | ✅ | ✅ | Working |
| `DELETE /creditors/:id` | ✅ | ✅ | Working |
| `GET /sales` | ✅ | ✅ | Working |
| `POST /nozzle-readings` | ✅ | ✅ | Working |

### ✅ Formerly Missing Backend Endpoints

| Frontend Expectation | Priority | Description |
|---------------------|----------|-------------|
| `GET /dashboard/sales-summary` | HIGH | Implemented |
| `GET /dashboard/payment-methods` | HIGH | Implemented |
| `GET /dashboard/fuel-breakdown` | HIGH | Implemented |
| `GET /dashboard/top-creditors` | HIGH | Implemented |
| `GET /dashboard/sales-trend` | HIGH | Implemented |
| `POST /auth/logout` | MEDIUM | Implemented |
| `POST /auth/refresh` | MEDIUM | Implemented |
| `GET /admin/analytics` | MEDIUM | Implemented |
| `GET /reconciliation/daily-summary` | HIGH | Implemented |

### ⚠️ Endpoint Structure Mismatches

| Issue | Frontend | Backend | Fix Required |
|-------|----------|---------|--------------|
| Credit Payments | `GET /credit-payments?creditorId=X` | `GET /credit-payments` | ✅ Aligned |
| Reconciliation | `GET /reconciliation/daily-summary` | `GET /reconciliation/daily-summary` | ✅ Implemented |

## Data Structure Analysis

### Authentication Response
**Frontend expects**:
```typescript
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

**Backend provides**: ✅ Compatible structure

### Station Response
**Frontend expects**:
```typescript
{
  id: string;
  name: string;
  address: string;
  status: 'active' | 'inactive' | 'maintenance';
  manager?: string;
  attendantCount: number;
  pumpCount: number;
  createdAt: string;
}
```

**Backend provides**: ⚠️ Partial - missing some fields like `attendantCount`, `pumpCount`

## Recommendations

### Immediate Fixes (Priority 1)

1. **Fix Base URL Mismatch**
   ```typescript
   // Option 1: Update frontend
   const API_BASE_URL = '/v1';
   
   // Option 2: Update backend routes
   app.use('/api/v1/auth', createAuthRouter(pool));
   ```

2. **Implement Missing Dashboard Endpoints**
   - Create `dashboard.controller.ts`
   - Add dashboard routes to `app.ts`
   - Implement analytics queries

3. **Fix Reconciliation Endpoint**
   - Add `GET /reconciliation/daily-summary` route
   - Implement daily summary logic

### Medium Priority Fixes

1. **Implement Missing Auth Endpoints**
   - Add logout endpoint (token blacklisting)
   - Add refresh token functionality

2. **Standardize Credit Payments URLs**
   - Decide on URL structure: `/credit-payments` vs `/creditors/payments`
   - Update either frontend or backend consistently

3. **Complete Station Data Structure**
   - Add missing fields to station responses
   - Implement pump/attendant counting

### Long-term Improvements

1. **API Documentation**
   - Complete OpenAPI spec with all endpoints
   - Add request/response schemas
   - Include authentication requirements

2. **Error Handling Standardization**
   - Consistent error response format
   - Proper HTTP status codes
   - Detailed error messages

3. **API Versioning Strategy**
   - Clear versioning scheme
   - Backward compatibility plan
   - Migration strategy for breaking changes

## Implementation Plan

### Phase 1: Critical Fixes (Week 1)
- [ ] Fix base URL mismatch
- [ ] Implement dashboard endpoints
- [ ] Fix reconciliation endpoint structure
- [ ] Test all existing endpoints

### Phase 2: Feature Completion (Week 2)
- [ ] Add missing auth endpoints
- [ ] Implement analytics endpoints
- [ ] Complete data structures
- [ ] Add proper error handling

### Phase 3: Documentation & Testing (Week 3)
- [ ] Complete OpenAPI specification
- [ ] Add comprehensive API tests
- [ ] Create API documentation
- [ ] Performance optimization

## Testing Strategy

1. **API Contract Testing**
   - Use tools like Pact or OpenAPI validators
   - Ensure frontend/backend contract compliance

2. **Integration Testing**
   - Test all API endpoints end-to-end
   - Validate authentication flows
   - Test error scenarios

3. **Load Testing**
   - Test API performance under load
   - Identify bottlenecks
   - Optimize database queries

## Monitoring & Maintenance

1. **API Monitoring**
   - Track endpoint usage
   - Monitor response times
   - Alert on failures

2. **Version Management**
   - Track API changes
   - Maintain changelog
   - Plan deprecation strategy

---

**Next Steps**: 
1. Review this analysis with the development team
2. Prioritize fixes based on business impact
3. Create detailed implementation tickets
4. Set up API testing framework