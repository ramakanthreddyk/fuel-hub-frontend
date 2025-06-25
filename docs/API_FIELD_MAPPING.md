
# API Field Name Mapping

## Overview
The backend returns data in snake_case format, but the frontend uses camelCase. This document outlines the field mappings for each entity.

## Field Mappings

### Stations
| Backend (snake_case) | Frontend (camelCase) | Type | Description |
|---------------------|---------------------|------|-------------|
| `id` | `id` | string | Station ID |
| `name` | `name` | string | Station name |
| `address` | `address` | string | Station address |
| `status` | `status` | string | Station status |
| `pump_count` | `pumpCount` | number | Number of pumps |
| `created_at` | `createdAt` | string | Creation timestamp |

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

### Nozzle Readings
| Backend (snake_case) | Frontend (camelCase) | Type | Description |
|---------------------|---------------------|------|-------------|
| `id` | `id` | string | Reading ID |
| `nozzle_id` | `nozzleId` | string | Nozzle ID |
| `reading` | `reading` | number | Reading value |
| `recorded_at` | `recordedAt` | string | Recording timestamp |
| `payment_method` | `paymentMethod` | string | Payment method |
| `creditor_id` | `creditorId` | string? | Creditor ID (optional) |
| `created_at` | `createdAt` | string | Creation timestamp |

### Tenants (for hierarchy)
| Backend (snake_case) | Frontend (camelCase) | Type | Description |
|---------------------|---------------------|------|-------------|
| `id` | `id` | string | Tenant ID |
| `name` | `name` | string | Tenant name |
| `status` | `status` | string | Tenant status |
| `user_count` | `userCount` | number | Number of users |
| `station_count` | `stationCount` | number | Number of stations |
| `users` | `users` | User[] | Array of users |
| `stations` | `stations` | Station[] | Array of stations with pumps/nozzles |

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

## API Endpoints

### Nozzles
- `GET /nozzles?pumpId={id}` - Get nozzles for a pump
- `GET /nozzles/{id}` - Get single nozzle
- `POST /nozzles` - Create new nozzle
- `PUT /nozzles/{id}` - Update nozzle
- `DELETE /nozzles/{id}` - Delete nozzle

### Nozzle Readings
- `POST /nozzle-readings` - Create new reading
- `GET /nozzle-readings?nozzleId={id}&limit=1` - Get latest reading for nozzle

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
- Nozzle editing is now supported via PUT /nozzles/{id}
- Reading functionality supports preselected nozzles for better UX
