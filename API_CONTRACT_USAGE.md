# API Contract - Single Source of Truth

## 🎯 **Purpose**

The `api-contract.ts` file is the **single source of truth** for all API types between frontend and backend. This ensures:

- ✅ **Type Safety** - Frontend and backend use identical interfaces
- ✅ **Consistency** - No mismatched field names or types
- ✅ **Maintainability** - Changes in one place update everywhere
- ✅ **Documentation** - All API structures are clearly defined

## 📁 **File Structure**

```
src/api/api-contract.ts - Single source of truth for all API types
```

## 🔧 **How to Use**

### 1. **In API Hooks**
```typescript
import { TodaysSalesSummary, ApiResponse } from '@/api/api-contract';

export const useTodaysSales = () => {
  return useQuery({
    queryFn: async (): Promise<TodaysSalesSummary> => {
      return handleApiResponse(() => 
        apiClient.get('/todays-sales/summary')
      );
    }
  });
};
```

### 2. **In Components**
```typescript
import { TodaysSalesSummary } from '@/api/api-contract';

interface Props {
  salesData: TodaysSalesSummary;
}

export function SalesComponent({ salesData }: Props) {
  return (
    <div>
      <h1>Total: {salesData.totalAmount}</h1>
      {salesData.salesByFuel.map(fuel => (
        <div key={fuel.fuel_type}>
          {fuel.fuel_type}: {fuel.total_amount}
        </div>
      ))}
    </div>
  );
}
```

### 3. **In Services**
```typescript
import { Station, CreateStationRequest } from '@/api/api-contract';

export const stationsService = {
  getStations: async (): Promise<Station[]> => {
    return handleApiResponse(() => apiClient.get('/stations'));
  },
  
  createStation: async (data: CreateStationRequest): Promise<Station> => {
    return handleApiResponse(() => apiClient.post('/stations', data));
  }
};
```

## 🚀 **Backend Integration**

### For Backend Developers:

1. **Import the contract** in your backend project
2. **Use the same interfaces** for request/response types
3. **Follow the ApiResponse wrapper** pattern:

```typescript
// Backend controller example
import { TodaysSalesSummary, ApiResponse } from './api-contract';

export async function getTodaysSales(): Promise<ApiResponse<TodaysSalesSummary>> {
  const data = await calculateTodaysSales();
  
  return {
    success: true,
    data: {
      date: data.date,
      totalAmount: data.totalAmount,
      totalVolume: data.totalVolume,
      totalEntries: data.totalEntries,
      paymentBreakdown: data.paymentBreakdown,
      salesByFuel: data.salesByFuel,
      salesByStation: data.salesByStation,
      nozzleEntries: data.nozzleEntries,
      creditSales: data.creditSales
    }
  };
}
```

## 📋 **Key Interfaces**

### **Core Dashboard Data:**
- `TodaysSalesSummary` - /todays-sales/summary
- `SalesTrendData[]` - /dashboard/sales-trend
- `PaymentMethodData[]` - /dashboard/payment-methods
- `FuelBreakdownData[]` - /dashboard/fuel-breakdown
- `DashboardSalesSummary` - /dashboard/sales-summary

### **Entity Types:**
- `Station` - Station data with optional metrics
- `Pump` - Pump information
- `Nozzle` - Nozzle details
- `User` - User authentication
- `Creditor` - Credit customer data

### **Request Types:**
- `CreateStationRequest` - Creating new stations
- `CreatePumpRequest` - Creating new pumps
- `CreateNozzleRequest` - Creating new nozzles
- `LoginRequest` - User authentication

## 🔄 **Sync Process**

### **When Adding New Endpoints:**

1. **Add types to api-contract.ts**
```typescript
export interface NewFeatureData {
  id: string;
  name: string;
  value: number;
}

export interface CreateNewFeatureRequest {
  name: string;
  value: number;
}
```

2. **Create API hook**
```typescript
import { NewFeatureData } from '@/api/api-contract';

export const useNewFeature = () => {
  return useQuery({
    queryFn: (): Promise<NewFeatureData[]> => {
      return handleApiResponse(() => apiClient.get('/new-feature'));
    }
  });
};
```

3. **Backend implements same interface**
```typescript
import { NewFeatureData, ApiResponse } from './api-contract';

export async function getNewFeature(): Promise<ApiResponse<NewFeatureData[]>> {
  // Implementation
}
```

## ✅ **Benefits**

1. **No More Mismatches** - Field names and types are guaranteed to match
2. **IntelliSense Support** - Full autocomplete in both frontend and backend
3. **Refactoring Safety** - Changing a type updates all usages
4. **Clear Documentation** - All API structures are self-documenting
5. **Version Control** - API changes are tracked in git

## 🚨 **Rules**

1. **Never duplicate interfaces** - Always import from api-contract.ts
2. **Update contract first** - Before implementing new endpoints
3. **Use ApiResponse wrapper** - All responses must follow the standard format
4. **Follow naming conventions** - Use consistent field naming (snake_case from backend)
5. **Add type guards** - For runtime type checking when needed

## 🎯 **Result**

With this system:
- ✅ Frontend hooks are type-safe and consistent
- ✅ Backend responses match frontend expectations
- ✅ No more "property doesn't exist" errors
- ✅ Easy to maintain and extend
- ✅ Self-documenting API structure