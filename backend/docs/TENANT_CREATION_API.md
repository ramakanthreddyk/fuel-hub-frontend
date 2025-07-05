# Tenant Creation API Guide

## API Endpoint

```
POST /api/v1/tenants
```

## Request Format

The API accepts the following formats:

### Format 1: Frontend Format
```json
{
  "name": "Tenant Name",
  "planType": "premium"
}
```

### Format 2: Backend Format
```json
{
  "name": "Tenant Name",
  "planId": "uuid-of-plan"
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `name` | string | **Required**. The display name of the tenant |
| `planType` or `planId` | string | **Required**. Either the plan type (`basic`, `pro`, `premium`) or the UUID of the plan |

## Response Format

```json
{
  "id": "uuid-of-tenant",
  "name": "Tenant Name",
  "status": "active"
}
```

## What Happens When a Tenant is Created

1. A new record is added to the `public.tenants` table
2. Default users are created for the tenant:
   - Owner (`owner@{tenant-slug}.fuelsync.com`)
   - Manager (`manager@{tenant-slug}.fuelsync.com`)
   - Attendant (`attendant@{tenant-slug}.fuelsync.com`)

## User Management After Tenant Creation

1. The owner should login with the automatically created credentials
2. The owner should change their password immediately
3. The owner can create additional users (managers and attendants)
4. Each user can change their own password
5. The owner can reset passwords for other users if needed

## Example

### Request
```json
{
  "name": "Acme Fuels",
  "planType": "premium"
}
```

### Response
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Acme Fuels",
  "status": "active"
}
```

## Error Handling

### Invalid Plan
```json
{
  "error": "Invalid plan ID or type"
}
```

## Frontend Implementation

```javascript
async function createTenant(tenantData) {
  try {
    const response = await fetch('/api/v1/tenants', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: tenantData.name,
        planType: tenantData.planType
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create tenant');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating tenant:', error);
    throw error;
  }
}
```