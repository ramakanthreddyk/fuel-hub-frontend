---
title: FuelSync Hub - Tenant Architecture
lastUpdated: 2025-07-05
category: architecture
---


# FuelSync Hub - Tenant Architecture

## Overview

FuelSync Hub uses a **unified tenant_id approach** for all multi-tenancy and data isolation. This document outlines the architecture and implementation details.

## Data Partitioning Strategy

### ✅ Current Approach: tenant_id (UUID) Only

All data partitioning is handled by `tenant_id` (UUID) only. Never use `schema_name` for routing or access.

**Key Principles:**
- Every tenant has a unique `tenant_id` (UUID)
- All database tables include a `tenant_id` column for row-level security
- API requests include `x-tenant-id` header for context
- JWT tokens contain `tenantId` for user context
- Frontend state management uses `tenant_id` for identification

### ❌ Deprecated Approaches (Removed)

The following concepts have been completely removed from the codebase:
- `schema_name`, `schemaName`, `tenant_schema`
- Dynamic schema switching
- Schema-based routing or filtering
- Per-tenant database schemas

## Implementation Details

### Backend Responsibilities

1. **JWT Token Structure:**
   ```json
   {
     "userId": "uuid",
     "role": "owner|manager|attendant|superadmin",
     "tenantId": "uuid|null",
     "iat": timestamp,
     "exp": timestamp
   }
   ```

2. **API Headers:**
   ```
   Authorization: Bearer <jwt_token>
   x-tenant-id: <tenant_uuid>
   Content-Type: application/json
   ```

3. **Database Design:**
   - All tenant-specific tables include `tenant_id UUID` column
   - Row-level security (RLS) policies filter by `tenant_id`
   - Foreign keys reference across tenant boundaries only for superadmin operations

### Frontend Responsibilities

1. **API Client Configuration:**
   - Automatically includes `x-tenant-id` header from auth context
   - Never constructs URLs or filters based on schema names

2. **State Management:**
   ```typescript
   interface User {
     id: string;
     tenantId?: string;      // UUID for data isolation
     tenantName?: string;    // Display name only
     role: UserRole;
   }
   ```

3. **Routing & Navigation:**
   - Use tenant_id for context switching
   - Display tenantName for user-friendly labels
   - Never use schema names in URLs or route parameters

## API Endpoints

### Tenant Management (SuperAdmin)

```typescript
// ✅ Correct - uses tenant_id
GET /admin/organizations/{tenant_id}
POST /admin/organizations
PATCH /admin/organizations/{tenant_id}/status

// ❌ Deprecated - schema-based endpoints removed
// GET /admin/tenants/{schema_name}
// POST /switch-schema/{schema_name}
```

### Tenant-Scoped Operations

```typescript
// All operations automatically scoped by x-tenant-id header
GET /stations
GET /users
GET /sales
POST /pumps
// etc.
```

## Migration Notes

### Removed Code Patterns

1. **Schema Name Fields:**
   ```typescript
   // ❌ Removed
   interface CreateTenantRequest {
     schemaName: string;
   }
   
   // ✅ Current
   interface CreateTenantRequest {
     name: string;
     planId: string;
   }
   ```

2. **Dynamic Schema Switching:**
   ```typescript
   // ❌ Removed
   const switchToSchema = (schemaName: string) => {
     // Complex schema switching logic
   }
   
   // ✅ Current - No schema switching needed
   // tenant_id is handled automatically via JWT and headers
   ```

3. **Schema-Based UI Logic:**
   ```typescript
   // ❌ Removed
   const currentSchema = getCurrentSchema();
   const apiUrl = `/api/${currentSchema}/stations`;
   
   // ✅ Current
   const apiUrl = '/api/stations'; // tenant_id handled by apiClient
   ```

## Benefits of Unified Approach

1. **Simplified Architecture:**
   - No complex schema management
   - Consistent data access patterns
   - Easier to maintain and debug

2. **Enhanced Security:**
   - Row-level security at database level
   - No risk of cross-tenant data leaks via schema confusion
   - Centralized tenant context management

3. **Better Performance:**
   - No schema switching overhead
   - Efficient database queries with proper indexing
   - Simplified connection pooling

4. **Developer Experience:**
   - Clear and consistent API patterns
   - Type-safe tenant context
   - Easier testing and development

## Future Considerations

- All new features must follow the tenant_id pattern
- No schema-related fields should be added to any interfaces
- API endpoints should be designed with tenant_id scoping in mind
- UI components should only use tenantName for display purposes

## Troubleshooting

If you encounter references to schema_name or related concepts:
1. Check if the code was missed during migration
2. Update to use tenant_id instead
3. Ensure API calls don't include schema parameters
4. Verify UI doesn't display or require schema information

---

**Remember:** All data isolation is by tenant_id (UUID), not DB schema.
