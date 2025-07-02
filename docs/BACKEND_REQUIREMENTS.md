# Backend Requirements Documentation

## Contract-Aligned API Endpoints Status

### ✅ **Ready to Use (Assumed Working)**
Based on OpenAPI spec, these endpoints should be working:

#### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/admin/auth/login` - SuperAdmin login
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

#### Stations Management
- `GET /api/v1/stations` - List stations
- `POST /api/v1/stations` - Create station
- `GET /api/v1/stations/{id}` - Get station details
- `PUT /api/v1/stations/{id}` - Update station
- `DELETE /api/v1/stations/{id}` - Delete station

#### Pumps Management
- `GET /api/v1/pumps?stationId={id}` - List pumps for station
- `POST /api/v1/pumps` - Create pump
- `GET /api/v1/pumps/{id}` - Get pump details
- `PUT /api/v1/pumps/{id}` - Update pump
- `DELETE /api/v1/pumps/{id}` - Delete pump

**Schema Requirements:**
```json
{
  "name": "string",           // NOT "label"
  "serialNumber": "string",
  "stationId": "string"
}
```

#### Nozzles Management
- `GET /api/v1/nozzles?pumpId={id}` - List nozzles for pump
- `POST /api/v1/nozzles` - Create nozzle
- `GET /api/v1/nozzles/{id}` - Get nozzle details
- `PUT /api/v1/nozzles/{id}` - Update nozzle
- `DELETE /api/v1/nozzles/{id}` - Delete nozzle

**Schema Requirements:**
```json
{
  "pumpId": "string",
  "nozzleNumber": number,
  "fuelType": "petrol" | "diesel" | "premium",  // NOT "kerosene"
  "status": "active" | "inactive" | "maintenance"
}
```

#### Readings Management
- `POST /api/v1/nozzle-readings` - Create reading
- `GET /api/v1/nozzle-readings` - List readings (with filters)
- `GET /api/v1/nozzle-readings/can-create/{nozzleId}` - Check if reading can be created

**Schema Requirements:**
```json
{
  "nozzleId": "string",
  "reading": number,
  "recordedAt": "2024-01-01T10:00:00Z",
  "paymentMethod": "cash" | "card" | "upi" | "credit",
  "creditorId": "string" // optional, required for credit payments
}
```

#### Fuel Prices Management
- `GET /api/v1/fuel-prices` - List fuel prices
- `POST /api/v1/fuel-prices` - Create fuel price
- `PUT /api/v1/fuel-prices/{id}` - Update fuel price
- `DELETE /api/v1/fuel-prices/{id}` - Delete fuel price
- `GET /api/v1/fuel-prices/validate/{stationId}` - Validate station prices
- `GET /api/v1/fuel-prices/missing` - Get stations missing prices

### 🔄 **Frontend Migration Progress**

#### ✅ Completed Services
- ✅ **AuthService** - Contract-aligned login/logout
- ✅ **StationsService** - Full CRUD operations
- ✅ **PumpsService** - Contract-aligned with correct `name` field
- ✅ **NozzlesService** - Contract-aligned with correct fuel types
- ✅ **ReadingsService** - Contract-aligned reading creation
- ✅ **FuelPricesService** - Contract-aligned price management

#### ✅ Completed React Hooks
- ✅ **useContractAuth** - Authentication management
- ✅ **useContractStations** - Station operations
- ✅ **useContractPumps** - Pump operations
- ✅ **useContractNozzles** - Nozzle operations
- ✅ **useContractReadings** - Reading operations

#### ✅ Fixed Components
- ✅ **CreatePumpPage** - Uses correct `name` field
- ✅ **CreateNozzlePage** - Uses correct fuel types
- ✅ **ReadingEntryForm** - Migrated to contract services
- ✅ **All pump displays** - Updated to use `name` instead of `label`

### 📋 **Critical Backend Validation Requirements**

#### Data Response Format
All endpoints MUST return data in this format:
```json
{
  "success": true,
  "data": {
    "pumps": [...],      // For array responses
    "pump": {...}        // For single item responses
  }
}
```

#### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific field error"
    }
  ]
}
```

#### Authentication Headers
- Regular users: `Authorization: Bearer <token>` + `x-tenant-id: <uuid>`
- SuperAdmin: `Authorization: Bearer <token>` (no tenant header)

### 🚀 **Expected Functionality**

#### Reading Creation Flow
1. User selects station → pumps load for that station
2. User selects pump → nozzles load for that pump  
3. User selects nozzle → system checks if reading can be created
4. If fuel price exists → allow reading creation
5. If no fuel price → show error with link to price management

#### Setup Wizard Flow
1. Create Station → Create Pump → Create Nozzle → Set Fuel Price
2. Each step validates previous step completion
3. Proper navigation between steps
4. Empty state handling when no data exists

### 📝 **Backend Team Action Items**

1. **Verify Response Format**: Ensure all endpoints return `{ success: true, data: {...} }`
2. **Validate Schema Compliance**: Pump uses `name`, Nozzle uses correct fuel types
3. **Test Reading Creation**: Verify `/nozzle-readings/can-create/{nozzleId}` works
4. **Check Fuel Price Validation**: Ensure station price validation endpoints work
5. **Verify Tenant Isolation**: All data properly filtered by tenant ID

### 🎯 **Frontend Ready for Testing**

The frontend is now fully contract-aligned and ready for end-to-end testing with the backend. All critical user flows have been implemented with proper error handling and validation.