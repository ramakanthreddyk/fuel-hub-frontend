# Backend Hierarchy API Documentation

## Overview
Complete API documentation for hierarchical tenant data endpoints in FuelSync Hub backend.

## Enhanced Tenant Details Endpoint

### GET /api/v1/admin/tenants/{id}
Returns complete tenant organizational structure with users, stations, pumps, and nozzles.

#### Request:
```http
GET /api/v1/admin/tenants/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer <super_admin_token>
```

#### Response Structure:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Corporation",
  "planId": "plan-uuid",
  "planName": "Premium Plan",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00Z",
  "userCount": 3,
  "stationCount": 2,
  "users": [
    {
      "id": "user-uuid-1",
      "email": "owner@tenant-acme-corp.com",
      "name": "Acme Corporation Owner",
      "role": "owner",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "user-uuid-2", 
      "email": "manager@tenant-acme-corp.com",
      "name": "Acme Corporation Manager",
      "role": "manager",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "user-uuid-3",
      "email": "attendant@tenant-acme-corp.com", 
      "name": "Acme Corporation Attendant",
      "role": "attendant",
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "stations": [
    {
      "id": "station-uuid-1",
      "name": "Main Street Station",
      "address": "123 Main St, City",
      "status": "active",
      "pumpCount": 2,
      "pumps": [
        {
          "id": "pump-uuid-1",
          "name": "Pump 1",
          "serialNumber": "P001",
          "status": "active",
          "nozzleCount": 2,
          "nozzles": [
            {
              "id": "nozzle-uuid-1",
              "nozzleNumber": 1,
              "fuelType": "petrol",
              "status": "active"
            },
            {
              "id": "nozzle-uuid-2", 
              "nozzleNumber": 2,
              "fuelType": "diesel",
              "status": "active"
            }
          ]
        },
        {
          "id": "pump-uuid-2",
          "name": "Pump 2",
          "serialNumber": "P002",
          "status": "maintenance",
          "nozzleCount": 1,
          "nozzles": [
            {
              "id": "nozzle-uuid-3",
              "nozzleNumber": 1,
              "fuelType": "premium",
              "status": "active"
            }
          ]
        }
      ]
    },
    {
      "id": "station-uuid-2",
      "name": "Highway Station",
      "address": "456 Highway Rd",
      "status": "active", 
      "pumpCount": 1,
      "pumps": [
        {
          "id": "pump-uuid-3",
          "name": "Pump 1",
          "serialNumber": "P003",
          "status": "active",
          "nozzleCount": 2,
          "nozzles": [
            {
              "id": "nozzle-uuid-4",
              "nozzleNumber": 1,
              "fuelType": "petrol",
              "status": "active"
            },
            {
              "id": "nozzle-uuid-5",
              "nozzleNumber": 2, 
              "fuelType": "diesel",
              "status": "active"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Error Responses:
```json
// 404 - Tenant not found
{
  "status": "error",
  "code": "TENANT_NOT_FOUND",
  "message": "Tenant not found"
}

// 403 - Insufficient permissions
{
  "status": "error", 
  "code": "INSUFFICIENT_PERMISSIONS",
  "message": "SuperAdmin access required"
}
```

## Implementation Details

### Service Layer Enhancement:
```typescript
// src/services/tenant.service.ts
export async function getTenant(db: Pool, id: string): Promise<any | null> {
  // Get tenant basic info
  const tenant = await getTenantBasicInfo(db, id);
  
  // Get users ordered by role hierarchy (schema_name deprecated)
  const users = await getUsersByTenant(db, tenant.id);
  
  // Get stations with nested pumps and nozzles
  const stations = await getStationsWithHierarchy(db, tenant.id);
  
  return {
    ...tenant,
    users,
    stations,
    userCount: users.length,
    stationCount: stations.length
  };
}
```

### Database Queries:
```sql
-- Get users ordered by role hierarchy
SELECT id, email, name, role, created_at 
FROM {schema}.users 
ORDER BY 
  CASE role 
    WHEN 'owner' THEN 1 
    WHEN 'manager' THEN 2 
    WHEN 'attendant' THEN 3 
  END;

-- Get stations with pump counts
SELECT s.id, s.name, s.address, s.status,
       (SELECT COUNT(*) FROM {schema}.pumps p WHERE p.station_id = s.id) as pump_count
FROM {schema}.stations s 
ORDER BY s.name;

-- Get pumps with nozzle counts
SELECT p.id, p.name, p.serial_number, p.status,
       (SELECT COUNT(*) FROM {schema}.nozzles n WHERE n.pump_id = p.id) as nozzle_count
FROM {schema}.pumps p 
WHERE p.station_id = $1 
ORDER BY p.name;

-- Get nozzles for pump
SELECT id, nozzle_number, fuel_type, status 
FROM {schema}.nozzles 
WHERE pump_id = $1 
ORDER BY nozzle_number;
```

## Performance Considerations

### Query Optimization:
- **Batch Loading**: Single query per hierarchy level
- **Indexed Lookups**: Foreign key indexes on all relations
- **Count Aggregation**: Efficient counting with subqueries
- **Schema Caching**: Cache schema names to avoid repeated lookups

### Response Size Management:
- **Selective Loading**: Option to exclude pumps/nozzles for large tenants
- **Pagination**: For tenants with many stations
- **Compression**: Gzip compression for large responses

## Security & Access Control

### Authorization:
- **SuperAdmin Only**: Full hierarchy access
- **Tenant Users**: Own organization only (future enhancement)
- **Role-Based Filtering**: Data filtered by user role

### Data Sanitization:
- **Password Exclusion**: Never include password hashes
- **Sensitive Data**: Remove internal system fields
- **Schema Validation**: Validate all returned data

## Error Handling

### Database Errors:
- **Connection Issues**: Graceful degradation
- **Schema Missing**: Clear error messages
- **Query Timeouts**: Fallback to basic info

### Data Consistency:
- **Orphaned Records**: Handle missing parent entities
- **Status Validation**: Ensure valid status values
- **Count Accuracy**: Verify counts match actual data

## Future Enhancements

### Planned Features:
- **Metrics Integration**: Include performance data in hierarchy
- **Real-time Updates**: WebSocket support for live changes
- **Filtering Options**: Query parameters for selective loading
- **Bulk Operations**: Multi-entity updates
- **Audit Trail**: Track hierarchy changes

### API Versioning:
- **v1**: Current implementation
- **v2**: Enhanced with metrics and filtering
- **Backward Compatibility**: Maintain v1 support

This documentation ensures consistent implementation and usage of hierarchical tenant data across the FuelSync Hub backend.