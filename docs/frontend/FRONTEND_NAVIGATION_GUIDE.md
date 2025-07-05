---
title: Frontend Navigation Guide
lastUpdated: 2025-07-05
category: frontend
---

# Frontend Navigation Guide

## Backend API Structure

The backend provides a hierarchical structure for navigating from stations to pumps to nozzles:

### 1. Stations API
```
GET /api/v1/stations
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "name": "Main Station",
    "address": "123 Main St",
    "status": "active"
  },
  {
    "id": "uuid-2",
    "name": "Downtown Branch",
    "address": "456 Center Ave",
    "status": "active"
  }
]
```

### 2. Pumps API (filtered by station)
```
GET /api/v1/pumps?stationId=uuid-1
```

**Response:**
```json
[
  {
    "id": "pump-1",
    "label": "Pump 1",
    "serialNumber": "MS-P001-2024",
    "status": "active",
    "stationId": "uuid-1"
  },
  {
    "id": "pump-2",
    "label": "Pump 2",
    "serialNumber": "MS-P002-2024",
    "status": "active",
    "stationId": "uuid-1"
  }
]
```

### 3. Nozzles API (filtered by pump)
```
GET /api/v1/nozzles?pumpId=pump-1
```

**Response:**
```json
[
  {
    "id": "nozzle-1",
    "nozzleNumber": 1,
    "fuelType": "petrol",
    "status": "active",
    "pumpId": "pump-1"
  },
  {
    "id": "nozzle-2",
    "nozzleNumber": 2,
    "fuelType": "diesel",
    "status": "active",
    "pumpId": "pump-1"
  }
]
```

## Frontend Implementation

### 1. Station List Component
```tsx
function StationList() {
  const { data: stations, isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: () => stationsApi.getStations()
  });

  return (
    <div>
      <h2>Stations</h2>
      {isLoading ? (
        <div>Loading stations...</div>
      ) : (
        <ul>
          {stations?.map(station => (
            <li key={station.id}>
              <Link to={`/stations/${station.id}`}>{station.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 2. Station Detail with Pumps
```tsx
function StationDetail({ stationId }) {
  const { data: station } = useQuery({
    queryKey: ['station', stationId],
    queryFn: () => stationsApi.getStation(stationId)
  });

  const { data: pumps } = useQuery({
    queryKey: ['pumps', stationId],
    queryFn: () => pumpsApi.getPumps({ stationId })
  });

  return (
    <div>
      <h2>{station?.name}</h2>
      <p>{station?.address}</p>
      
      <h3>Pumps</h3>
      <ul>
        {pumps?.map(pump => (
          <li key={pump.id}>
            <Link to={`/stations/${stationId}/pumps/${pump.id}`}>
              {pump.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Pump Detail with Nozzles
```tsx
function PumpDetail({ stationId, pumpId }) {
  const { data: pump } = useQuery({
    queryKey: ['pump', pumpId],
    queryFn: () => pumpsApi.getPump(pumpId)
  });

  const { data: nozzles } = useQuery({
    queryKey: ['nozzles', pumpId],
    queryFn: () => nozzlesApi.getNozzles({ pumpId })
  });

  return (
    <div>
      <h2>{pump?.label}</h2>
      <p>Serial: {pump?.serialNumber}</p>
      
      <h3>Nozzles</h3>
      <ul>
        {nozzles?.map(nozzle => (
          <li key={nozzle.id}>
            Nozzle {nozzle.nozzleNumber}: {nozzle.fuelType}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

## Routing Setup

```tsx
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/stations" element={<StationList />} />
      <Route path="/stations/:stationId" element={<StationDetail />} />
      <Route path="/stations/:stationId/pumps/:pumpId" element={<PumpDetail />} />
    </Routes>
  );
}
```

## API Client Implementation

```typescript
// src/api/stations.ts
export const stationsApi = {
  getStations: async () => {
    const response = await apiClient.get('/stations');
    return response.data;
  },
  
  getStation: async (id) => {
    const response = await apiClient.get(`/stations/${id}`);
    return response.data;
  }
};

// src/api/pumps.ts
export const pumpsApi = {
  getPumps: async ({ stationId }) => {
    const params = new URLSearchParams();
    if (stationId) params.append('stationId', stationId);
    
    const response = await apiClient.get(`/pumps?${params}`);
    return response.data;
  },
  
  getPump: async (id) => {
    const response = await apiClient.get(`/pumps/${id}`);
    return response.data;
  }
};

// src/api/nozzles.ts
export const nozzlesApi = {
  getNozzles: async ({ pumpId }) => {
    const params = new URLSearchParams();
    if (pumpId) params.append('pumpId', pumpId);
    
    const response = await apiClient.get(`/nozzles?${params}`);
    return response.data;
  },
  
  getNozzle: async (id) => {
    const response = await apiClient.get(`/nozzles/${id}`);
    return response.data;
  }
};
```

## Important Headers

Make sure all API requests include:

```typescript
// src/api/client.ts
apiClient.interceptors.request.use(config => {
  // Add tenant ID header
  config.headers['x-tenant-id'] = 'production_tenant';
  
  // Add auth token if available
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  
  return config;
});
```