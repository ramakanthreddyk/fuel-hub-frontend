# Tenant Management Guide

## Overview
Complete guide for managing tenants in FuelSync Hub multi-tenant SaaS platform.

## Tenant Status Lifecycle

### Status Types
- **Active**: Full system access, all features enabled
- **Suspended**: Temporary disable, login blocked, data preserved
- **Cancelled**: Subscription ended, limited access, data preserved
- **Deleted**: Soft delete, hidden from listings, data preserved

### Status Transitions
```
Active ↔ Suspended ↔ Cancelled → Deleted
```

## Tenant Creation Process

### Automatic User Generation
When creating a tenant, the system automatically creates:

1. **Owner User**
   - Email: `owner@{tenant-slug}.fuelsync.com`
   - Password: `{firstname}@tenant123`
   - Role: Full system access

2. **Manager User**
   - Email: `manager@{tenant-slug}.fuelsync.com`
   - Password: `{firstname}@tenant123`
   - Role: Station management, reports

3. **Attendant User**
   - Email: `attendant@{tenant-slug}.fuelsync.com`
   - Password: `{firstname}@tenant123`
   - Role: Basic operations, readings

### Tenant Identifier
- A slug is generated from the tenant name (lowercase with hyphens) and used in default emails

## API Endpoints

### Create Tenant
```http
POST /api/v1/admin/tenants
{
  "name": "Acme Corporation",
  "planId": "uuid"
}
```

### Update Tenant Status
```http
PATCH /api/v1/admin/tenants/{id}/status
{
  "status": "suspended"
}
```

### Get Tenant Details
```http
GET /api/v1/admin/tenants/{id}
```

Returns complete organizational structure:
```json
{
  "id": "uuid",
  "name": "Acme Corporation",
  "status": "active",
  "users": [...],
  "stations": [
    {
      "id": "uuid",
      "name": "Main Station",
      "pumps": [
        {
          "id": "uuid",
          "label": "Pump 1",
          "nozzles": [...]
        }
      ]
    }
  ]
}
```

## Frontend Integration

### Tenant Creation Form
- Simplified form with auto-generation preview
- Shows what users will be created
- Displays password pattern

### Status Management
- Conditional action buttons based on current status
- Clear labels with emojis for better UX
- Confirmation dialogs for destructive actions

## Security Considerations

### Password Security
- Auto-generated passwords follow secure pattern
- Bcrypt hashing with 10 rounds
- Force password change on first login recommended

### Access Control
- Role-based permissions strictly enforced
- Tenant isolation maintained
- Cross-tenant access prevented

## Troubleshooting

### Common Issues
1. **Status Transition Failures**: Check tenant has no active sessions
2. **User Creation Failures**: Verify email uniqueness within tenant

### Error Messages
- `Tenant not found` - Invalid tenant ID provided
- `Invalid status transition` - Check current status before update

## Best Practices

### Tenant Lifecycle Management
1. Create tenant with appropriate plan
2. Notify owner of credentials via secure channel
3. Monitor usage against plan limits
4. Handle status changes gracefully
5. Preserve data during transitions

### Data Retention
- Soft delete preserves all data
- Hard delete only for legal requirements
- Regular backups recommended
- Audit trail maintained

This guide ensures proper tenant management following security best practices and maintaining data integrity.