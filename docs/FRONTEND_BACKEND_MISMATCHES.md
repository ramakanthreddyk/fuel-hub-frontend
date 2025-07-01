
# Frontend-Backend API Mismatches

## Overview
This document identifies mismatches between the OpenAPI specification and the current frontend implementation, along with recommendations for alignment.

## Key Mismatches Found

### 1. Optional vs Required Fields

**Issue**: Several frontend interfaces mark fields as required that are optional in the backend OpenAPI spec.

**Affected Types**:
- `CreateStationRequest.status` - Should be optional (defaults to 'active')
- `CreatePumpRequest.status` - Should be optional (defaults to 'active') 
- `CreateNozzleRequest.status` - Should be optional (defaults to 'active')
- `CreateReadingRequest.recordedAt` - Should be optional (defaults to current time)
- `CreateFuelPriceRequest.validFrom` - Should be optional (defaults to current date)
- `CreatePaymentRequest.paymentDate` - Should be optional (defaults to current date)
- `CreateCashReportRequest.reportDate` - Should be optional (defaults to current date)
- `CreateReconciliationRequest.reconciliationDate` - Should be optional (defaults to current date)
- `CreateFuelDeliveryRequest.deliveryDate` - Should be optional (defaults to current date)

**Recommendation**: Update frontend forms to make these fields optional with sensible defaults.

### 2. Missing Backend Fields in Frontend Types

**Issue**: Backend provides additional fields not captured in frontend types.

**Missing Fields Added**:
- `NozzleReading`: Added `volume`, `amount`, `pricePerLitre` for calculated sales data
- `CashReport`: Added `reportedByName`, `status` for better display and workflow
- `SystemAlert`: Added `stationName`, `isActive` for better UI display
- `SalesSummary`: Added `period`, `previousPeriodRevenue` for trend analysis
- `FuelTypeBreakdown`: Added `averagePrice` for pricing insights
- `TopCreditor`: Added `lastPaymentDate` for payment tracking
- `DailySalesTrend`: Added `dayOfWeek` for weekly pattern analysis
- `StationMetric`: Added `lastActivity`, `efficiency` for performance tracking
- `FuelInventory`: Added `minimumLevel`, `maximumCapacity`, `status` for inventory management
- `FuelDelivery`: Added `status`, `receivedBy` for delivery workflow
- `ReconciliationRecord`: Added `reconciliationBy`, `approvedBy`, `approvedAt` for audit trail
- `Tenant`: Added `lastActivity`, `billingStatus` for tenant management
- `Plan`: Added `tenantCount`, `isPopular` for plan analytics
- `AdminUser`: Added `isActive`, `permissions` for user management

### 3. Inconsistent Naming Conventions

**Issue**: Some fields use different naming conventions between frontend and backend.

**Examples**:
- Backend uses `snake_case` for database fields but should return `camelCase` in API responses
- Some aliases are needed for backward compatibility (e.g., `totalSales` vs `totalRevenue`)

**Recommendation**: Backend should consistently return `camelCase` field names in API responses.

### 4. Enhanced Filter Parameters

**Issue**: Frontend filters are more limited than what the backend supports.

**Enhanced Filters Added**:
- `AlertsParams`: Added `priority`, `type` filters
- `FuelInventoryParams`: Added `status` filter for inventory alerts
- `StationComparisonParams`: Added `dateFrom`, `dateTo` for time-based comparisons
- `SalesReportFilters`: Added `groupBy` for data aggregation options

### 5. Missing Validation Enums

**Issue**: Some string fields should be constrained to specific values.

**Enums to Add in Backend**:
- `CashReport.shift`: 'morning' | 'afternoon' | 'night'
- `FuelInventory.status`: 'normal' | 'low' | 'critical' | 'overstocked'
- `FuelDelivery.status`: 'pending' | 'delivered' | 'confirmed'
- `Tenant.billingStatus`: 'current' | 'overdue' | 'suspended'

## Backend Recommendations

### 1. Response Format Standardization
```yaml
# All successful responses should follow this format
responses:
  '200':
    description: Success
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: true
            data:
              # Actual response data here
            message:
              type: string
              example: "Operation completed successfully"
```

### 2. Error Response Standardization
```yaml
# All error responses should follow this format
responses:
  '400':
    description: Bad Request
    content:
      application/json:
        schema:
          type: object
          properties:
            success:
              type: boolean
              example: false
            message:
              type: string
              example: "Validation failed"
            details:
              type: array
              items:
                type: object
                properties:
                  field:
                    type: string
                  message:
                    type: string
```

### 3. Field Naming Convention
- All API responses should use `camelCase` for field names
- Database `snake_case` should be converted to `camelCase` at the API layer
- Maintain backward compatibility with aliases where needed

### 4. Additional Endpoints Needed

Based on frontend requirements, consider adding these endpoints:

- `GET /alerts/summary` - Get alert counts by priority
- `GET /dashboard/system-health` - Get system health metrics
- `GET /stations/{id}/efficiency` - Get station efficiency metrics
- `GET /inventory/alerts` - Get inventory level alerts
- `POST /reconciliation/{id}/approve` - Approve reconciliation records

### 5. Enhanced Query Parameters

Add support for:
- Pagination (`page`, `limit`, `offset`)
- Sorting (`sortBy`, `sortOrder`)
- Advanced filtering with operators (`filter[field][operator]=value`)
- Field selection (`fields=field1,field2`)

## Frontend Action Items

1. ✅ Updated `api-contract.ts` with corrected field requirements
2. ⚠️ Update form components to handle optional fields properly
3. ⚠️ Add proper default value handling in forms
4. ⚠️ Update API service calls to use new filter parameters
5. ⚠️ Add error handling for new error response format
6. ⚠️ Update TypeScript interfaces in components to match new contract

## Testing Checklist

- [ ] Verify all create/update forms work with optional fields
- [ ] Test error handling with new error response format
- [ ] Validate filter parameters work correctly
- [ ] Check that all new fields display properly in UI
- [ ] Ensure backward compatibility with existing data

## Notes

This analysis is based on the OpenAPI specification in `docs/openapi-spec.yaml`. The frontend has been updated to better align with the backend contract, but form components and API services may need further updates to fully utilize the enhanced capabilities.

Regular synchronization between frontend and backend teams is recommended to prevent future mismatches.
