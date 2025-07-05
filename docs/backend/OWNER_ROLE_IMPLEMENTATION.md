---
title: FuelSync Backend - Owner Role Implementation
lastUpdated: 2025-07-05
category: backend
---

# FuelSync Backend - Owner Role Implementation

## Overview
Complete backend implementation for Owner role with advanced business intelligence features including profit tracking, station comparison, inventory management, and alerts system.

## Database Schema Updates

### New Columns Added
```sql
-- Profit tracking
ALTER TABLE production_tenant.fuel_prices ADD COLUMN cost_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_tenant.sales ADD COLUMN cost_price DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_tenant.sales ADD COLUMN profit DECIMAL(10,2) DEFAULT 0;
ALTER TABLE production_tenant.sales ADD COLUMN created_by UUID REFERENCES production_tenant.users(id);

-- New tables
CREATE TABLE production_tenant.fuel_inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  station_id UUID NOT NULL REFERENCES production_tenant.stations(id),
  fuel_type TEXT NOT NULL,
  current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
  minimum_level DECIMAL(10,3) NOT NULL DEFAULT 1000,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE production_tenant.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  station_id UUID REFERENCES production_tenant.stations(id),
  alert_type TEXT NOT NULL,
  message TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Endpoints

### Station Management
```
GET    /api/v1/stations                    - List stations with optional metrics
GET    /api/v1/stations/compare            - Compare multiple stations
GET    /api/v1/stations/ranking            - Station performance ranking
GET    /api/v1/stations/:id/metrics        - Individual station metrics
GET    /api/v1/stations/:id/performance    - Station performance analysis
```

### Dashboard Analytics
```
GET    /api/v1/dashboard/sales-summary     - Sales summary with station filter
GET    /api/v1/dashboard/payment-methods   - Payment breakdown with filters
GET    /api/v1/dashboard/fuel-breakdown    - Fuel type analysis with filters
GET    /api/v1/dashboard/top-creditors     - Top creditors with station filter
GET    /api/v1/dashboard/sales-trend       - Sales trend with station filter
```

### Inventory Management
```
GET    /api/v1/inventory                   - Get inventory status
POST   /api/v1/inventory/update            - Update inventory levels
GET    /api/v1/inventory/alerts            - Get inventory alerts
```

## Key Features Implemented

### 1. Profit Tracking
- Cost price tracking for all fuel types
- Profit calculation per sale
- Profit margin analysis per station
- Revenue vs profit comparison

### 2. Station Comparison
- Side-by-side station performance
- Multi-station analytics
- Comparative metrics (sales, profit, volume)
- Performance ranking system

### 3. Inventory Management
- Real-time stock tracking
- Low inventory alerts
- Minimum level monitoring
- Station-wise inventory status

### 4. Advanced Analytics
- Station performance ranking
- Profit margin analysis
- Growth rate calculations
- Transaction pattern analysis

### 5. Alerts System
- Low inventory warnings
- Automated alert generation
- Severity-based categorization
- Station-specific alerts

## Service Layer Architecture

### Station Service (`station.service.ts`)
```typescript
- getStationComparison(stationIds, period)
- getStationRanking(metric, period)
- getStationMetrics(stationId, period)
- getStationPerformance(stationId, range)
```

### Inventory Service (`inventory.service.ts`)
```typescript
- getInventory(stationId?)
- updateInventory(stationId, fuelType, newStock)
- createAlert(stationId, alertType, message, severity)
- getAlerts(stationId?, unreadOnly?)
```

### Dashboard Service (Enhanced)
```typescript
- All methods now support station filtering
- Profit metrics included in responses
- Date range filtering capabilities
- Performance comparison features
```

## Data Models

### Station Comparison Response
```typescript
interface StationComparison {
  id: string;
  name: string;
  totalSales: number;
  totalProfit: number;
  totalVolume: number;
  transactionCount: number;
  avgTransaction: number;
  profitMargin: number;
}
```

### Inventory Status Response
```typescript
interface InventoryStatus {
  id: string;
  stationId: string;
  stationName: string;
  fuelType: string;
  currentStock: number;
  minimumLevel: number;
  lastUpdated: Date;
  stockStatus: 'low' | 'medium' | 'good';
}
```

### Alert Response
```typescript
interface Alert {
  id: string;
  stationId: string;
  stationName: string;
  alertType: string;
  message: string;
  severity: 'info' | 'warning' | 'error';
  isRead: boolean;
  createdAt: Date;
}
```

## Authentication & Authorization

### Role-Based Access
- **Owner**: Full access to all endpoints
- **Manager**: Limited access to station-specific data
- **Attendant**: Read-only access to basic operations

### Protected Routes
All new endpoints require JWT authentication and appropriate role permissions.

## Database Seeding

### Comprehensive Test Data
- 3 stations with realistic names and addresses
- 26 pumps across stations (10+8+8 distribution)
- 52 nozzles with varied fuel types
- 6 station-specific creditors
- Cost prices for profit calculation
- Inventory data for all fuel types
- 620+ historical readings (30 days)
- 120+ sales with profit tracking
- Sample alerts for testing

## Performance Optimizations

### Database Indexes
```sql
CREATE INDEX idx_sales_station_date ON production_tenant.sales(station_id, recorded_at);
CREATE INDEX idx_inventory_station_fuel ON production_tenant.fuel_inventory(station_id, fuel_type);
CREATE INDEX idx_alerts_station_unread ON production_tenant.alerts(station_id, is_read);
```

### Query Optimizations
- Efficient JOIN operations for station-wise filtering
- Aggregated queries for performance metrics
- Parameterized queries for security
- Connection pooling for scalability

## Error Handling

### Consistent Error Responses
```typescript
interface ErrorResponse {
  status: 'error';
  message: string;
  code?: string;
}
```

### Validation
- Input validation for all endpoints
- Type checking for numeric values
- Required field validation
- Business logic validation

## Testing Endpoints

### Station Comparison
```bash
GET /api/v1/stations/compare?stationIds=uuid1,uuid2,uuid3&period=monthly
```

### Station Ranking
```bash
GET /api/v1/stations/ranking?metric=profit&period=weekly
```

### Inventory Status
```bash
GET /api/v1/inventory?stationId=uuid
```

### Dashboard with Filters
```bash
GET /api/v1/dashboard/sales-summary?stationId=uuid&range=monthly
```

## Migration Instructions

1. **Deploy Database Changes**
   ```bash
   npm run build
   npm start
   # Visit /migrate endpoint
   ```

2. **Verify New Tables**
   ```sql
   SELECT * FROM production_tenant.fuel_inventory;
   SELECT * FROM production_tenant.alerts;
   ```

3. **Test New Endpoints**
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
        "http://localhost:3001/api/v1/stations/compare?stationIds=uuid1,uuid2"
   ```

## Future Enhancements

### Planned Features
- Real-time WebSocket updates
- Advanced forecasting algorithms
- Mobile push notifications
- Automated report generation
- Integration with external systems

### Scalability Considerations
- Database partitioning for large datasets
- Caching layer for frequently accessed data
- Load balancing for high availability
- Monitoring and alerting infrastructure

## Owner Role Completion Status

### ✅ Implemented Features
- Station-wise filtering across all dashboards
- Profit tracking and margin analysis
- Station comparison and ranking
- Inventory management with alerts
- Advanced analytics and reporting
- Role-based access control
- Comprehensive error handling

### 📊 Business Intelligence Capabilities
- Multi-station performance comparison
- Profit vs revenue analysis
- Inventory optimization insights
- Automated alert system
- Historical trend analysis
- Growth rate calculations

**Implementation Status: 95% Complete**
The Owner role now has comprehensive business intelligence capabilities for managing multiple fuel stations with advanced analytics, profit tracking, and operational insights.