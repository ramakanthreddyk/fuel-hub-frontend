# API Contract Synchronization Guide

This guide outlines the steps to synchronize the frontend API contract with the backend OpenAPI specification.

## Overview

The frontend API contract (`api-contract.ts`) and the backend OpenAPI specification (`openapi.yaml`) need to be kept in sync to ensure smooth operation of the application. This guide identifies key mismatches and provides solutions.

## Key Mismatches and Solutions

### 1. Payment Methods

**Issue**: Inconsistent payment method types across different interfaces.

**Solution**: Standardize payment methods using a shared type:

```typescript
export type PaymentMethod = 'cash' | 'card' | 'upi' | 'credit' | 'bank_transfer' | 'check' | 'cheque';
```

Update all interfaces to use this type.

### 2. Analytics Endpoints

**Issue**: Missing or incomplete analytics interfaces.

**Solution**: Add the following interfaces from `api-contract-updates.ts`:
- `StationComparison`
- `HourlySales`
- `PeakHour`
- `FuelPerformance`

### 3. Dashboard Endpoints

**Issue**: Incomplete dashboard interfaces.

**Solution**: Add/update the following interfaces:
- `SalesSummary`
- `PaymentMethodBreakdown`
- `FuelTypeBreakdown`
- `TopCreditor`
- `DailySalesTrend`
- `StationMetric`
- `SystemHealth`

### 4. Reconciliation Endpoints

**Issue**: Missing reconciliation interfaces.

**Solution**: Add the following interfaces:
- `ReconciliationRecord`
- `CreateReconciliationRequest`
- `DailyReadingSummary`

### 5. Reports Endpoints

**Issue**: Incomplete report interfaces.

**Solution**: Add/update the following interfaces:
- `SalesReportData`
- `SalesReportSummary`

### 6. Fuel Inventory Endpoints

**Issue**: Missing or incomplete fuel inventory interfaces.

**Solution**: Add/update the following interfaces:
- `FuelInventory`
- `FuelDelivery`
- `CreateFuelDeliveryRequest`

### 7. Alert Endpoints

**Issue**: Incomplete alert interfaces.

**Solution**: Add/update the following interfaces:
- `Alert`
- `CreateAlertRequest`

## Implementation Steps

1. Copy the interfaces from `api-contract-updates.ts` to `api-contract.ts`
2. Update existing interfaces to match the backend specification
3. Update service files to handle both camelCase and snake_case property names
4. Update components to handle edge cases gracefully

## Backend Updates

The backend needs to be updated to include the `lastReading` field in the nozzle response:

1. Replace `src/services/nozzle.service.ts` with `src/services/nozzle.service.patch.ts`
2. Restart the backend server

## Verification

After implementing these changes:

1. Test each endpoint to ensure it works correctly
2. Verify that components display data correctly
3. Check for any console errors related to missing or mismatched fields

## Maintenance

To keep the API contract in sync:

1. Update the API contract whenever the backend API changes
2. Use TypeScript's strict type checking to catch mismatches
3. Implement comprehensive error handling in services
4. Add data transformation to handle inconsistencies