# Backend API Requirements for Dashboard

## 🚨 CRITICAL: Missing API Endpoints

The frontend dashboard requires these endpoints to function properly:

## 1. Today's Sales Summary
### `GET /todays-sales/summary`

**Parameters:**
- `date` (optional): YYYY-MM-DD format. If not provided, defaults to today.

**Response Structure:**
```json
{
  "totalAmount": 125000,
  "totalVolume": 1500,
  "totalEntries": 45,
  "salesByStation": [
    {
      "station_id": "1",
      "station_name": "Main Station",
      "total_amount": 75000,
      "entries_count": 25,
      "nozzles_active": 4,
      "fuel_types": ["petrol", "diesel", "premium"]
    }
  ],
  "salesByFuel": [
    {
      "fuel_type": "petrol",
      "total_amount": 60000,
      "total_volume": 800,
      "entries_count": 25,
      "stations_count": 2,
      "average_price": 75.0
    }
  ],
  "paymentBreakdown": {
    "cash": 45000,
    "card": 35000,
    "upi": 30000,
    "credit": 15000
  }
}
```

## 2. Sales Reports
### `GET /reports/sales`

**Parameters:**
- `startDate`: YYYY-MM-DD format (required)
- `endDate`: YYYY-MM-DD format (required)
- `stationId` (optional): Filter by station
- `paymentMethod` (optional): Filter by payment method
- `nozzleId` (optional): Filter by nozzle

**Response Structure:**
```json
{
  "totalAmount": 500000,
  "totalVolume": 6000,
  "totalTransactions": 200,
  "dailyBreakdown": [
    {
      "date": "2024-01-01",
      "amount": 50000,
      "volume": 600,
      "transactions": 20
    }
  ],
  "stationBreakdown": [
    {
      "stationId": "1",
      "stationName": "Main Station",
      "amount": 300000,
      "volume": 3600,
      "transactions": 120
    }
  ],
  "fuelTypeBreakdown": [
    {
      "fuelType": "petrol",
      "amount": 300000,
      "volume": 4000,
      "transactions": 120
    }
  ],
  "paymentMethodBreakdown": {
    "cash": 200000,
    "card": 150000,
    "upi": 100000,
    "credit": 50000
  }
}
```

## 3. Station Metrics Enhancement
### `GET /stations` (Enhancement needed)

**Current Response Enhancement:**
Add these fields to existing station objects:
```json
{
  "id": "1",
  "name": "Main Station",
  "address": "123 Main St",
  "status": "active",
  "pumps": [
    {
      "id": "1",
      "name": "Pump 1",
      "status": "active",
      "nozzles": [
        {
          "id": "1",
          "nozzleNumber": 1,
          "fuelType": "petrol",
          "status": "active"
        }
      ]
    }
  ],
  "todaySales": 75000,
  "monthlySales": 2250000,
  "salesGrowth": 12.5,
  "activePumps": 4,
  "totalPumps": 6
}
```

## 4. Sales Analytics (NEW REQUIREMENT)
### `GET /sales/analytics`

**Parameters:**
- `stationId` (optional): Filter by station
- `groupBy`: "station" | "pump" | "date" | "fuel_type"
- `startDate` (optional): YYYY-MM-DD format
- `endDate` (optional): YYYY-MM-DD format
- `days` (optional): Number of days for trend data

**Response Structure:**
```json
{
  "groupBy": "date",
  "data": [
    {
      "key": "2024-01-01",
      "amount": 50000,
      "volume": 600,
      "transactions": 20
    }
  ],
  "totals": {
    "amount": 500000,
    "volume": 6000,
    "transactions": 200
  }
}
```

## 🔧 Implementation Priority

### HIGH PRIORITY:
1. `GET /todays-sales/summary` - Dashboard main metrics
2. `GET /reports/sales` - Monthly/range data
3. `GET /sales/analytics?groupBy=date` - Trend charts

### MEDIUM PRIORITY:
4. Enhanced `GET /stations` - Station metrics
5. `GET /sales/analytics` - Advanced analytics

## 🎯 Frontend Status

**Current State:**
- ❌ All mock data removed
- ✅ Real API calls implemented
- ⚠️ Will show errors until backend endpoints exist
- ✅ Global toast notifications for API errors
- ✅ Loading states with FuelLoader

**Error Handling:**
- API failures show user-friendly toast messages
- Loading states prevent UI flickering
- Graceful degradation when data is missing

## 🚀 Next Steps

1. **Backend Team**: Implement endpoints in priority order
2. **Test**: Use browser network tab to verify API calls
3. **Deploy**: Dashboard will work immediately once APIs are ready