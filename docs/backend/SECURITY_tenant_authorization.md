---
title: SECURITY: Tenant Authorization Model
lastUpdated: 2025-07-05
category: backend
---

# SECURITY: Tenant Authorization Model

## Multi-Tenant Security Architecture

### JWT Token Structure
```typescript
interface AuthPayload {
  userId: string;        // Unique user ID within tenant
  tenantId: string;      // Schema name (shared by all users in tenant)
  role: UserRole;        // User's role within the tenant
}
```

### Security Model

#### ✅ **CORRECT**: Role-Based Access Control
- **Schema Isolation**: `tenantId` provides data isolation between tenants
- **Role Authorization**: `role` provides permission control within tenant
- **User Identity**: `userId` identifies specific user within tenant

#### ❌ **SECURITY FLAW PREVENTED**: 
- Multiple users sharing same schema name but different roles
- Owner, Manager, Attendant all access same tenant data but with different permissions

### Authorization Flow

```
1. User Login → JWT Generated with (userId, tenantId, role)
2. Request → authenticateJWT → setTenantContext → requireRole
3. setTenantContext: verifies tenantId from JWT or header
4. requireRole: Checks user role for permission control
```

### Permission Matrix

| Role | Create Station | Manage Users | View Reports | Enter Sales |
|------|---------------|--------------|--------------|-------------|
| **Owner** | ✅ | ✅ | ✅ | ✅ |
| **Manager** | ✅ | ❌ | ✅ | ✅ |
| **Attendant** | ❌ | ❌ | ❌ | ✅ |

### Example Scenario

**Tenant: "acme_corp"**
- `owner@acme.com` → JWT: `{userId: "123", tenantId: "acme_corp", role: "owner"}`
- `manager@acme.com` → JWT: `{userId: "456", tenantId: "acme_corp", role: "manager"}`
- `attendant@acme.com` → JWT: `{userId: "789", tenantId: "acme_corp", role: "attendant"}`

**All access same schema (`acme_corp`) but different permissions:**
- Owner: Can create stations, manage users
- Manager: Can create stations, cannot manage users
- Attendant: Cannot create stations or manage users

### Route Protection Pattern

```typescript
// SECURE PATTERN
router.post('/', 
  authenticateJWT,           // Verify JWT and extract user
  setTenantContext,          // Ensure tenantId context
  requireRole([Owner, Manager]), // Check role permissions
  handlers.create
);
```

### Data Isolation + Permission Control

1. **Data Isolation**: Schema name ensures tenant data separation
2. **Permission Control**: Role checks ensure proper authorization within tenant
3. **User Tracking**: User ID enables audit trails and user-specific operations

### Security Guarantees

- ✅ **Tenant Isolation**: Users cannot access other tenant's data
- ✅ **Role Authorization**: Users cannot perform unauthorized actions within tenant
- ✅ **User Identity**: All actions are traceable to specific users
- ✅ **JWT Security**: Tokens contain all necessary context for authorization

This model provides both **horizontal isolation** (between tenants) and **vertical authorization** (within tenants).