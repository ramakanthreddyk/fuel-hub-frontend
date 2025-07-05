---
title: Tenant & User Creation Process Documentation
lastUpdated: 2025-07-05
category: backend
---

# Tenant & User Creation Process Documentation

## Overview
The tenant creation process automatically creates a complete organizational structure with all necessary user roles and proper credential management.

## Process Flow

### 1. Tenant Creation
When a new tenant is created, the system:

1. **Creates Tenant Record** in `public.tenants` table
2. **Generates Schema** with unique name (e.g., `tenant_acme_corp_123456`)
3. **Creates Database Schema** with all required tables
4. **Creates User Hierarchy** with proper roles and credentials

### 2. Automatic User Creation

#### Owner User (Primary Admin)
- **Email**: `owner@{tenant-slug}.fuelsync.com` (e.g., `owner@acme-corp.fuelsync.com`)
- **Password**: `{firstname}@{schema}123` (e.g., `acme@tenant123`)
- **Role**: `owner` - Full system access
- **Name**: `{Tenant Name} Owner` (e.g., `Acme Corp Owner`)

#### Manager User (Operations Manager)
- **Email**: `manager@{tenant-slug}.fuelsync.com`
- **Password**: `{firstname}@{schema}123`
- **Role**: `manager` - Station management, reports, user management
- **Name**: `{Tenant Name} Manager`

#### Attendant User (Station Operator)
- **Email**: `attendant@{tenant-slug}.fuelsync.com`
- **Password**: `{firstname}@{schema}123`
- **Role**: `attendant` - Basic operations, readings entry
- **Name**: `{Tenant Name} Attendant`

## Password Generation Logic

### Default Pattern: `{firstname}@{schema}123`

**Examples:**
- Tenant: "Acme Corporation", Schema: "acme_corp"
  - Owner: `acme@acme123`
  - Manager: `acme@acme123`
  - Attendant: `acme@acme123`

- Tenant: "Mumbai Fuel Station", Schema: "mumbai_fuel"
  - Owner: `mumbai@mumbai123`
  - Manager: `mumbai@mumbai123`
  - Attendant: `mumbai@mumbai123`

### Custom Passwords
- SuperAdmin can specify custom passwords during tenant creation
- Individual users can change passwords after first login
- Password reset functionality available

## Email Generation Logic

### Domain Pattern: `{tenant-slug}.com`

**Slug Generation:**
- "Acme Corp" → `acme-corp`
- Whitespace and special characters become hyphens

**Email Examples:**
- `owner@acme-corp.com`
- `manager@acme-corp.com`
- `attendant@acme-corp.com`

## Role Permissions

### Owner Role
- **Full System Access**
- Create/manage all stations, pumps, nozzles
- Manage all users (create managers, attendants)
- View all reports and analytics
- Configure system settings
- Manage creditors and payments
- Access financial data

### Manager Role
- **Station Operations**
- Manage assigned stations
- Create/manage pumps and nozzles
- Create attendant users
- View station reports
- Manage fuel prices and inventory
- Handle creditor management
- Cannot access financial summaries

### Attendant Role
- **Basic Operations**
- Enter nozzle readings
- Process sales transactions
- View assigned station data
- Basic inventory checks
- Cannot create users or modify settings

## Database Structure

### Tenant Schema Tables Created:
```sql
-- User management
{schema}.users (id, tenant_id, email, password_hash, name, role)

-- Station hierarchy
{schema}.stations (id, tenant_id, name, address, status)
{schema}.pumps (id, tenant_id, station_id, label, serial_number)
{schema}.nozzles (id, tenant_id, pump_id, nozzle_number, fuel_type)

-- Operations
{schema}.nozzle_readings (id, tenant_id, nozzle_id, reading, recorded_at)
{schema}.sales (id, tenant_id, nozzle_id, volume, amount, payment_method)
{schema}.fuel_prices (id, tenant_id, station_id, fuel_type, price)

-- Business management
{schema}.creditors (id, tenant_id, party_name, credit_limit)
{schema}.credit_payments (id, tenant_id, creditor_id, amount)
{schema}.fuel_inventory (id, tenant_id, station_id, fuel_type, current_stock)
{schema}.fuel_deliveries (id, tenant_id, station_id, volume, delivery_date)

-- System
{schema}.alerts (id, tenant_id, alert_type, message, severity)
```

## API Response Structure

### Tenant Creation Response:
```json
{
  "tenant": {
    "id": "uuid",
    "name": "Acme Corporation",
    "schemaName": "tenant_acme_corp_123456",
    "status": "active"
  },
  "owner": {
    "email": "owner@tenant-acme-corp-123456.com",
    "password": "acme@tenant123",
    "name": "Acme Corporation Owner"
  }
}
```

## Frontend Integration

### Tenant Creation Form Fields:
- **Tenant Name** (required)
- **Schema Name** (optional, auto-generated)
- **Subscription Plan** (required)
- **Owner Name** (optional, auto-generated)
- **Owner Email** (optional, auto-generated)
- **Owner Password** (optional, auto-generated)

### Success Handling:
```typescript
const handleCreateTenant = async (data) => {
  const result = await tenantsApi.createTenant(data);
  
  // Show success message with credentials
  showSuccessDialog({
    tenant: result.tenant.name,
    ownerEmail: result.owner.email,
    ownerPassword: result.owner.password,
    loginUrl: `/login?tenant=${result.tenant.schemaName}`
  });
};
```

## Security Considerations

### Password Security:
- All passwords hashed with bcrypt (10 rounds)
- Plain text passwords only returned during creation
- Force password change on first login (recommended)
- Password complexity requirements enforced

### Email Uniqueness:
- Emails unique within tenant schema
- Cross-tenant email conflicts prevented
- Email validation on creation

### Access Control:
- Role-based permissions strictly enforced
- Tenant isolation maintained
- No cross-tenant data access

## User Management After Creation

### Adding Additional Users:
```typescript
// Create additional manager
const newManager = await createTenantUser(tenantId, {
  name: "John Smith",
  email: "john.smith@company.com",
  role: "manager"
  // password auto-generated if not provided
});
```

### User Lifecycle:
1. **Creation** - Auto-generated or custom credentials
2. **First Login** - Password change recommended
3. **Active Use** - Role-based access
4. **Deactivation** - Status change, preserve data
5. **Deletion** - Soft delete, maintain audit trail

## Troubleshooting

### Common Issues:

1. **Schema Name Conflicts**
   - Solution: Timestamp suffix prevents conflicts
   - Manual schema names must be unique

2. **Email Conflicts**
   - Solution: Emails scoped to tenant schema
   - Cross-tenant emails allowed

3. **Password Complexity**
   - Solution: Generated passwords meet requirements
   - Custom passwords validated

4. **Role Permissions**
   - Solution: Middleware enforces role boundaries
   - Clear error messages for unauthorized access

## Testing Checklist

### Tenant Creation:
- [ ] Tenant record created in public.tenants
- [ ] Schema created with all tables
- [ ] Owner user created with correct credentials
- [ ] Manager user created with correct credentials
- [ ] Attendant user created with correct credentials
- [ ] All users can login with generated passwords
- [ ] Role permissions work correctly
- [ ] Tenant isolation maintained

### User Management:
- [ ] Additional users can be created
- [ ] Password generation works
- [ ] Email uniqueness enforced
- [ ] Role-based access enforced
- [ ] User deactivation works
- [ ] Audit trail maintained

## Migration Notes

### Existing Tenants:
- Run user creation script for existing tenants
- Generate missing manager/attendant accounts
- Update password policies
- Notify users of new credentials

### Database Updates:
- No schema changes required
- User creation process enhanced
- Backward compatibility maintained

This comprehensive process ensures every tenant has a complete organizational structure with proper security and access control from day one.