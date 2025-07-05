# Tenant Management Guide

## Tenant Structure

In FuelSync, a tenant represents a separate organization with its own data. Each tenant has:

1. **Schema** - A separate PostgreSQL schema that contains all tenant-specific tables
2. **Users** - Owner, managers, and attendants who can access the tenant's data
3. **Stations** - Fuel stations managed by the tenant
4. **Data** - All operational data (pumps, nozzles, sales, etc.)

## Schema Name Explained

When creating a tenant, you need to specify a **Schema Name**:

- This is a unique identifier used to create a separate PostgreSQL schema
- It must be lowercase, contain only letters, numbers, and underscores
- It's used internally to isolate tenant data
- Example: `acme_fuels`, `citygas_stations`, `highway_services`

The schema name is used in database queries to access tenant-specific tables:
```sql
SELECT * FROM acme_fuels.stations;
```

## Tenant Creation Process

When a SuperAdmin creates a tenant:

1. A new record is added to `public.tenants` table
2. A new PostgreSQL schema is created with the specified schema name
3. All required tables are created in the new schema
4. An owner user is automatically created for the tenant

## User-Tenant Relationship

### Creating Users

When creating a user, you must assign them to a tenant:

1. **Owner** - Created automatically when a tenant is created
2. **Manager** - Must be assigned to a tenant and specific stations
3. **Attendant** - Must be assigned to a tenant and specific stations

### User Authentication

When a user logs in:
1. The system checks their email and password
2. If valid, it determines their tenant and role
3. The tenant ID is included in the JWT token
4. All API requests include the tenant ID in the `x-tenant-id` header

## Frontend Implementation

### SuperAdmin View

The SuperAdmin can:
- See all tenants in the system
- Create new tenants
- Manage tenant status (active, suspended, cancelled)
- View analytics for each tenant

### Tenant User View

Tenant users can only see data for their own tenant:
- Owner can see all stations and data
- Manager can see assigned stations and data
- Attendant can see assigned stations and limited data

### Creating a Tenant (SuperAdmin)

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

### Creating a User (Owner)

```tsx
function CreateUserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'manager', // or 'attendant'
    stationIds: []
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    // The tenant ID is automatically included from the authenticated user
    await usersApi.createUser(formData);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* User form fields */}
      
      <div>
        <label>Role</label>
        <select 
          value={formData.role}
          onChange={(e) => setFormData({...formData, role: e.target.value})}
          required
        >
          <option value="manager">Manager</option>
          <option value="attendant">Attendant</option>
        </select>
      </div>
      
      <div>
        <label>Assigned Stations</label>
        {stations.map(station => (
          <div key={station.id}>
            <input
              type="checkbox"
              checked={formData.stationIds.includes(station.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setFormData({...formData, stationIds: [...formData.stationIds, station.id]});
                } else {
                  setFormData({...formData, stationIds: formData.stationIds.filter(id => id !== station.id)});
                }
              }}
            />
            <label>{station.name}</label>
          </div>
        ))}
      </div>
      
      <button type="submit">Create User</button>
    </form>
  );
}
```