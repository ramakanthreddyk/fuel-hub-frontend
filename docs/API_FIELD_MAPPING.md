# API Field Name Mapping

## Overview
The backend returns data in snake_case format, but the frontend uses camelCase. This document outlines the field mappings for each entity.

## Field Mappings

### Pumps
| Backend (snake_case) | Frontend (camelCase) | Type | Description |
|---------------------|---------------------|------|-------------|
| `id` | `id` | string | Pump ID |
| `station_id` | `stationId` | string | Station ID |
| `label` | `label` | string | Pump label |
| `serial_number` | `serialNumber` | string | Serial number |
| `status` | `status` | string | Pump status |
| `nozzle_count` | `nozzleCount` | number | Number of nozzles |
| `created_at` | `createdAt` | string | Creation timestamp |

### Nozzles
| Backend (snake_case) | Frontend (camelCase) | Type | Description |
|---------------------|---------------------|------|-------------|
| `id` | `id` | string | Nozzle ID |
| `pump_id` | `pumpId` | string | Pump ID |
| `nozzle_number` | `nozzleNumber` | number | Nozzle number |
| `fuel_type` | `fuelType` | string | Fuel type |
| `status` | `status` | string | Nozzle status |
| `created_at` | `createdAt` | string | Creation timestamp |

### Stations
| Backend (snake_case) | Frontend (camelCase) | Type | Description |
|---------------------|---------------------|------|-------------|
| `id` | `id` | string | Station ID |
| `name` | `name` | string | Station name |
| `address` | `address` | string | Station address |
| `status` | `status` | string | Station status |
| `pump_count` | `pumpCount` | number | Number of pumps |
| `created_at` | `createdAt` | string | Creation timestamp |

## Implementation

### API Layer Conversion
Each API function converts the backend response from snake_case to camelCase:

```typescript
// Example: Nozzles API
const rawNozzles = ensureArray(response.data.nozzles || response.data);
return rawNozzles.map((nozzle: any) => ({
  id: nozzle.id,
  pumpId: nozzle.pump_id,
  nozzleNumber: nozzle.nozzle_number,
  fuelType: nozzle.fuel_type,
  status: nozzle.status,
  createdAt: nozzle.created_at
}));
```

### TypeScript Interfaces
Frontend interfaces use camelCase:

```typescript
export interface Nozzle {
  id: string;
  pumpId: string;
  nozzleNumber: number;
  fuelType: 'petrol' | 'diesel' | 'premium';
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: string;
}
```

## Status Values
All entities use consistent status values:
- `'active'` - Entity is operational
- `'inactive'` - Entity is disabled
- `'maintenance'` - Entity is under maintenance

## Notes
- All timestamps are in ISO 8601 format
- Field conversion happens at the API layer to maintain clean separation
- Backend maintains snake_case for database consistency
- Frontend uses camelCase for JavaScript/TypeScript conventions