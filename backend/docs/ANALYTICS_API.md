# Analytics API Guide

## SuperAdmin Analytics

### Dashboard Metrics
```
GET /api/v1/analytics/dashboard
GET /api/v1/analytics/superadmin
```

**Response:**
```json
{
  "tenantCount": 4,
  "activeTenantCount": 3,
  "planCount": 3,
  "adminCount": 3,
  "userCount": 12,
  "stationCount": 12,
  "recentTenants": [
    {
      "id": "uuid",
      "name": "Test Tenant",
      // "schema_name": "test_tenant", -- deprecated
      "status": "active",
      "created_at": "2023-01-01T00:00:00Z"
    }
  ],
  "planDistribution": [
    {
      "plan_name": "Enterprise Plan",
      "tenant_count": "2"
    },
    {
      "plan_name": "Basic Plan",
      "tenant_count": "1"
    }
  ],
  "summary": {
    "tenants": 4,
    "users": 12,
    "stations": 12
  }
}
```

### Tenant Analytics
```
GET /api/v1/analytics/tenant/:id
```

**Response:**
```json
{
  "tenant": {
    "id": "uuid",
    "name": "Test Tenant",
    // "schema_name": "test_tenant", -- deprecated
    "status": "active",
    "created_at": "2023-01-01T00:00:00Z",
    "plan_name": "Enterprise Plan"
  },
  "userCount": 3,
  "stationCount": 3,
  "pumpCount": 10,
  "salesCount": 120,
  "totalSales": 12500.75,
  "summary": {
    "users": 3,
    "stations": 3,
    "pumps": 10,
    "sales": 120
  }
}
```

## Frontend Implementation

### Dashboard Metrics Component

```tsx
function DashboardMetrics() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: () => adminApi.getDashboardMetrics()
  });
  
  if (isLoading) {
    return <div>Loading metrics...</div>;
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricsCard
        title="Total Tenants"
        value={metrics?.summary?.tenants || 0}
        icon={<Building className="h-5 w-5" />}
      />
      <MetricsCard
        title="Active Tenants"
        value={metrics?.activeTenantCount || 0}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <MetricsCard
        title="Total Users"
        value={metrics?.summary?.users || 0}
        icon={<Users className="h-5 w-5" />}
      />
      <MetricsCard
        title="Total Stations"
        value={metrics?.summary?.stations || 0}
        icon={<MapPin className="h-5 w-5" />}
      />
      
      {/* Recent Tenants */}
      <div className="col-span-full">
        <h2 className="text-xl font-semibold mb-4">Recent Tenants</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Name</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {metrics?.recentTenants?.map(tenant => (
                <tr key={tenant.id}>
                  <td>{tenant.name}</td>
                  <td>
                    <StatusBadge status={tenant.status} />
                  </td>
                  <td>{formatDate(tenant.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

### Tenant Analytics Component

```tsx
function TenantAnalytics({ tenantId }) {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['tenant', tenantId, 'analytics'],
    queryFn: () => adminApi.getTenantAnalytics(tenantId)
  });
  
  if (isLoading) {
    return <div>Loading analytics...</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{analytics?.tenant?.name}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricsCard
          title="Users"
          value={analytics?.summary?.users || 0}
          icon={<Users className="h-5 w-5" />}
        />
        <MetricsCard
          title="Stations"
          value={analytics?.summary?.stations || 0}
          icon={<MapPin className="h-5 w-5" />}
        />
        <MetricsCard
          title="Pumps"
          value={analytics?.summary?.pumps || 0}
          icon={<Droplet className="h-5 w-5" />}
        />
        <MetricsCard
          title="Sales"
          value={analytics?.summary?.sales || 0}
          icon={<DollarSign className="h-5 w-5" />}
        />
      </div>
      
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Tenant Details</h3>
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Plan</p>
              <p className="font-medium">{analytics?.tenant?.plan_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <StatusBadge status={analytics?.tenant?.status} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="font-medium">{formatDate(analytics?.tenant?.created_at)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## API Client Implementation

```typescript
// src/api/admin.ts
export const adminApi = {
  // Dashboard metrics
  getDashboardMetrics: async () => {
    const response = await apiClient.get('/analytics/superadmin');
    return response.data;
  },
  
  // Tenant analytics
  getTenantAnalytics: async (tenantId) => {
    const response = await apiClient.get(`/analytics/tenant/${tenantId}`);
    return response.data;
  }
};
```

## Date Formatting

```typescript
// src/utils/formatDate.ts
export function formatDate(dateString) {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}
```