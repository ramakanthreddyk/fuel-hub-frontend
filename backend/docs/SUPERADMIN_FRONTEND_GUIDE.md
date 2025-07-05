# SuperAdmin Frontend Guide

## Overview

The SuperAdmin frontend provides a comprehensive interface for managing the FuelSync platform, including tenants, plans, and admin users.

## Pages

### 1. Dashboard

The dashboard provides an overview of the platform:

- **Tenant Metrics**
  - Total tenants
  - Active tenants
  - Suspended tenants
  - Recent tenant activity

- **User Metrics**
  - Total users across all tenants
  - User distribution by role

- **Plan Metrics**
  - Plan distribution
  - Revenue by plan

### 2. Tenants

The tenants page allows managing all tenants:

- **Tenant List**
  - Name
  - Schema name
  - Plan
  - Status
  - Created date
  - Actions (view, edit, suspend, delete)

- **Create Tenant**
  - Name - The display name for the tenant
  - Schema Name - Unique identifier for the tenant's database schema (lowercase, letters, numbers, underscores)
  - Plan - Subscription plan for the tenant

- **Tenant Details**
  - Users
  - Stations
  - Usage metrics

### 3. Plans

The plans page allows managing subscription plans:

- **Plan List**
  - Name
  - Price
  - Features
  - Limits (stations, pumps, nozzles)
  - Actions (edit, delete)

- **Create Plan**
  - Name
  - Price
  - Features
  - Limits

### 4. Admin Users

The admin users page allows managing platform administrators:

- **Admin User List**
  - Email
  - Role
  - Created date
  - Actions (edit, reset password, delete)

- **Create Admin User**
  - Email
  - Password
  - Role (SuperAdmin, Admin)

## API Endpoints

### Dashboard Metrics
```
GET /api/v1/analytics/dashboard
```

### Tenant Management
```
GET /api/v1/admin/tenants
POST /api/v1/admin/tenants
GET /api/v1/admin/tenants/:id
PUT /api/v1/admin/tenants/:id/status
DELETE /api/v1/admin/tenants/:id
```

### Plan Management
```
GET /api/v1/admin/plans
POST /api/v1/admin/plans
GET /api/v1/admin/plans/:id
PUT /api/v1/admin/plans/:id
DELETE /api/v1/admin/plans/:id
```

### Admin User Management
```
GET /api/v1/admin/users
POST /api/v1/admin/users
GET /api/v1/admin/users/:id
PUT /api/v1/admin/users/:id
DELETE /api/v1/admin/users/:id
POST /api/v1/admin/users/:id/reset-password
```

### Tenant Analytics
```
GET /api/v1/analytics/tenant/:id
```

## Schema Name Explained

The **Schema Name** field when creating a tenant is important:

- It's a unique identifier used to create a separate PostgreSQL schema
- Must be lowercase, contain only letters, numbers, and underscores
- Used internally to isolate tenant data
- Example: `acme_fuels`, `citygas_stations`, `highway_services`

When creating a tenant, the system:
1. Creates a new record in the `public.tenants` table
2. Creates a new PostgreSQL schema with the specified schema name
3. Creates all required tables in the new schema
4. Creates an owner user for the tenant

## Implementation Notes

### Tenant Creation Form

```tsx
function CreateTenantForm() {
  const [formData, setFormData] = useState({
    name: '',
    planId: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await adminApi.createTenant(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Tenant Name</label>
        <input 
          type="text" 
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          required
        />
      </div>
      
      
      <div>
        <label>Subscription Plan</label>
        <select 
          value={formData.planId}
          onChange={(e) => setFormData({...formData, planId: e.target.value})}
          required
        >
          <option value="">Select a plan</option>
          {plans.map(plan => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>
      </div>
      
      <button type="submit">Create Tenant</button>
    </form>
  );
}
```

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
        value={metrics?.tenantCount || 0}
        icon={<Building className="h-5 w-5" />}
      />
      <MetricsCard
        title="Active Tenants"
        value={metrics?.activeTenantCount || 0}
        icon={<CheckCircle className="h-5 w-5" />}
      />
      <MetricsCard
        title="Total Users"
        value={metrics?.userCount || 0}
        icon={<Users className="h-5 w-5" />}
      />
      <MetricsCard
        title="Total Stations"
        value={metrics?.stationCount || 0}
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