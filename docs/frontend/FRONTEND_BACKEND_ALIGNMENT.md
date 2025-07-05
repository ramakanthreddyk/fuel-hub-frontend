---
title: Frontend-Backend Alignment Analysis
lastUpdated: 2025-07-05
category: frontend
---

# Frontend-Backend Alignment Analysis

## ✅ **ALIGNED FEATURES**

### Dashboard APIs
- **Sales Summary**: ✅ Frontend expects `{ totalSales, totalVolume, transactionCount, period }` - Backend provides exact match
- **Payment Methods**: ✅ Frontend expects `{ paymentMethod, amount, percentage }[]` - Backend provides exact match  
- **Fuel Breakdown**: ✅ Frontend expects `{ fuelType, volume, amount }[]` - Backend provides exact match
- **Top Creditors**: ✅ Frontend expects `{ id, partyName, outstandingAmount, creditLimit }[]` - Backend provides exact match
- **Sales Trend**: ✅ Frontend expects `{ date, amount, volume }[]` - Backend provides exact match

### Station Management
- **Station List**: ✅ Frontend calls `/stations?includeMetrics=true` - Backend supports this
- **Station Filtering**: ✅ All dashboard APIs accept `stationId` parameter - Backend implements filtering

### Authentication & Routing
- **API Prefix**: ✅ Frontend uses `/api/v1/*` - Backend serves on `/api/v1/*`
- **Error Handling**: ✅ Frontend expects `{ message }` in error responses - Backend uses `errorResponse()` utility

## ❌ **MISSING ALIGNMENTS**

### 1. **Station Comparison API**
**Frontend Needs:**
```typescript
interface StationComparison {
  id: string;
  name: string;
  totalSales: number;
  totalProfit: number;
  profitMargin: number;
  rank: number;
}

// API Call
GET /api/v1/stations/compare?stationIds=uuid1,uuid2&period=monthly
```

**Backend Status:** ✅ Implemented but frontend doesn't use it yet

### 2. **Profit Metrics in Dashboard**
**Frontend Missing:**
```typescript
interface SalesSummary {
  totalSales: number;
  totalProfit: number;    // ❌ Missing
  profitMargin: number;   // ❌ Missing
  totalVolume: number;
  transactionCount: number;
}
```

**Backend Provides:** Profit data available but not exposed in dashboard APIs

### 3. **Inventory Management**
**Frontend Missing:**
```typescript
interface InventoryStatus {
  stationId: string;
  fuelType: string;
  currentStock: number;
  minimumLevel: number;
  stockStatus: 'low' | 'medium' | 'good';
}

// API Calls
GET /api/v1/inventory?stationId=uuid
POST /api/v1/inventory/update
```

**Backend Status:** ✅ Implemented but no frontend integration

### 4. **Alerts System**
**Frontend Missing:**
```typescript
interface Alert {
  id: string;
  stationId: string;
  alertType: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  isRead: boolean;
}

// API Call
GET /api/v1/inventory/alerts?unreadOnly=true
```

**Backend Status:** ✅ Implemented but no frontend integration

### 5. **Export Functionality**
**Frontend Missing:**
```typescript
// Export buttons and functionality
const exportSalesReport = async (format: 'pdf' | 'excel') => {
  // Implementation needed
};
```

**Backend Missing:** Export endpoints not implemented

## 🔧 **REQUIRED FRONTEND UPDATES**

### 1. Update Dashboard API Types
```typescript
// src/api/dashboard.ts
export interface SalesSummary {
  totalSales: number;
  totalProfit: number;      // Add
  profitMargin: number;     // Add
  totalVolume: number;
  transactionCount: number;
  period: string;
}
```

### 2. Add Station Comparison API
```typescript
// src/api/stations.ts
export const stationsApi = {
  // ... existing methods
  
  compareStations: async (stationIds: string[], period: string = 'monthly') => {
    const params = new URLSearchParams({
      stationIds: stationIds.join(','),
      period
    });
    const response = await apiClient.get(`/stations/compare?${params}`);
    return response.data;
  },
  
  getStationRanking: async (metric: string = 'sales', period: string = 'monthly') => {
    const response = await apiClient.get(`/stations/ranking?metric=${metric}&period=${period}`);
    return response.data;
  }
};
```

### 3. Add Inventory Management
```typescript
// src/api/inventory.ts
export const inventoryApi = {
  getInventory: async (stationId?: string) => {
    const params = stationId ? `?stationId=${stationId}` : '';
    const response = await apiClient.get(`/inventory${params}`);
    return response.data;
  },
  
  updateInventory: async (stationId: string, fuelType: string, newStock: number) => {
    const response = await apiClient.post('/inventory/update', {
      stationId,
      fuelType,
      newStock
    });
    return response.data;
  },
  
  getAlerts: async (stationId?: string, unreadOnly: boolean = false) => {
    const params = new URLSearchParams();
    if (stationId) params.append('stationId', stationId);
    if (unreadOnly) params.append('unreadOnly', 'true');
    
    const response = await apiClient.get(`/inventory/alerts?${params}`);
    return response.data;
  }
};
```

### 4. Add Components
```typescript
// Components needed:
- StationComparisonChart
- InventoryStatusCard  
- AlertsNotification
- ProfitMarginDisplay
- ExportButton
```

## 🔧 **REQUIRED BACKEND UPDATES**

### 1. Add Profit Metrics to Dashboard
```typescript
// src/controllers/dashboard.controller.ts
// Update getSalesSummary to include profit data
const query = `
  SELECT
    COALESCE(SUM(s.amount), 0) as total_sales,
    COALESCE(SUM(s.profit), 0) as total_profit,
    COALESCE(SUM(s.volume), 0) as total_volume,
    COUNT(s.id) as transaction_count,
    CASE WHEN SUM(s.amount) > 0 THEN (SUM(s.profit) / SUM(s.amount)) * 100 ELSE 0 END as profit_margin
  FROM ${tenantId}.sales s
  -- ... rest of query
`;
```

### 2. Add Export Endpoints
```typescript
// src/routes/reports.route.ts
router.get('/sales/export', authenticateJWT, requireRole([UserRole.Owner]), handlers.exportSales);
router.get('/financial/export', authenticateJWT, requireRole([UserRole.Owner]), handlers.exportFinancial);
```

## 📊 **ALIGNMENT STATUS**

### Current Alignment: 70%
- ✅ Core dashboard functionality
- ✅ Station filtering
- ✅ Authentication & routing
- ❌ Advanced analytics (comparison, ranking)
- ❌ Profit tracking display
- ❌ Inventory management UI
- ❌ Alerts system UI
- ❌ Export functionality

### Target Alignment: 95%
- ✅ All current features
- ✅ Station comparison & ranking
- ✅ Profit margin tracking
- ✅ Inventory management
- ✅ Real-time alerts
- ✅ Export capabilities

## 🎯 **IMPLEMENTATION PRIORITY**

### Week 1: Core Alignment
1. Add profit metrics to dashboard APIs
2. Update frontend dashboard types
3. Add station comparison API integration
4. Test all existing functionality

### Week 2: Advanced Features  
1. Add inventory management UI
2. Implement alerts system
3. Add export functionality
4. Mobile responsiveness improvements

### Week 3: Polish & Optimization
1. Performance optimization
2. Error handling improvements
3. Real-time updates
4. Advanced analytics

**The backend is more advanced than the frontend. Focus on updating frontend to use new backend capabilities.**