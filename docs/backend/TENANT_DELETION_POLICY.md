---
title: Tenant Deletion Policy & Implementation
lastUpdated: 2025-07-05
category: backend
---

# Tenant Deletion Policy & Implementation

## Problem Statement
The original `deleteTenant` function was **DESTRUCTIVE** and permanently deleted:
- All tenant data (stations, pumps, sales, users)
- Entire database schema with CASCADE
- All historical records and transactions
- No recovery possible

## Solution: Soft Delete Approach

### 1. Soft Delete (Default)
**What it does:**
- Sets tenant status to `'deleted'`
- Adds `deleted_at` timestamp
- **Preserves ALL data** in database
- Prevents tenant login and access
- Hides tenant from normal listings

**When to use:**
- Standard tenant termination
- Subscription cancellation
- Temporary suspension
- Data retention compliance

### 2. Status-Based Management
**Available statuses:**
- `'active'` - Normal operation
- `'suspended'` - Temporarily disabled, can be reactivated
- `'cancelled'` - Subscription ended, data preserved
- `'deleted'` - Soft deleted, data preserved but hidden

### 3. Hard Delete (Extreme Cases Only)
**Function:** `permanentlyDeleteTenant()`
**What it does:**
- **PERMANENTLY DESTROYS** all tenant data
- Drops entire database schema
- **NO RECOVERY POSSIBLE**

**When to use:**
- Legal requirement to purge data
- GDPR "right to be forgotten" requests
- Confirmed data breach requiring cleanup
- **NEVER for normal business operations**

## Implementation Details

### Database Changes
```sql
-- Added soft delete support
ALTER TABLE public.tenants 
ADD COLUMN deleted_at TIMESTAMPTZ NULL;

-- Index for performance
CREATE INDEX idx_tenants_status_deleted_at ON public.tenants(status, deleted_at);
```

### Service Layer
```typescript
// Soft delete (default)
export async function deleteTenant(db: Pool, id: string): Promise<void> {
  await db.query(
    'UPDATE public.tenants SET status = $1, deleted_at = NOW() WHERE id = $2',
    ['deleted', id]
  );
}

// Hard delete (dangerous)
export async function permanentlyDeleteTenant(db: Pool, id: string): Promise<void> {
  // Drops schema with CASCADE - DESTROYS ALL DATA
}
```

### Frontend Changes
- Delete button shows "Delete (Soft)" with confirmation
- Confirmation explains data preservation
- Status updates available: Active, Suspend, Cancel, Delete

## Data Recovery Process

### Reactivating Soft-Deleted Tenant
```sql
-- Restore deleted tenant
UPDATE public.tenants 
SET status = 'active', deleted_at = NULL 
WHERE id = 'tenant-uuid';
```

### Accessing Deleted Tenant Data
```typescript
// Include deleted tenants in query
const allTenants = await listTenants(db, true); // includeDeleted = true
```

## Business Logic

### Authentication
- Deleted tenants cannot login
- API requests blocked for deleted tenants
- Schema remains intact but inaccessible

### Data Retention
- All sales data preserved
- User accounts maintained
- Historical reports available
- Audit trail intact

### Billing Implications
- Subscription cancelled
- No new charges
- Data storage costs may continue
- Recovery possible within retention period

## Security Considerations

### Access Control
- Only SuperAdmin can delete tenants
- Confirmation required for delete action
- Audit log of deletion events
- No accidental data loss

### Data Protection
- Complies with data retention laws
- Supports GDPR requirements
- Enables data recovery
- Maintains audit trails

## Recommended Workflow

### Standard Tenant Termination:
1. **Suspend** - Temporary disable (reversible)
2. **Cancel** - End subscription (data preserved)
3. **Delete (Soft)** - Hide from system (data preserved)
4. **Hard Delete** - Only if legally required (IRREVERSIBLE)

### Recovery Process:
1. Identify tenant by ID or schema name
2. Update status from 'deleted' to 'active'
3. Clear deleted_at timestamp
4. Notify tenant of reactivation
5. Resume normal operations

## Migration Guide

### For Existing Systems:
1. Run migration `006_add_deleted_at_to_tenants.sql`
2. Update service calls to use soft delete
3. Test recovery procedures
4. Train support staff on new process
5. Update documentation and policies

### Testing Checklist:
- [ ] Soft delete prevents login
- [ ] Data remains in database
- [ ] Tenant hidden from listings
- [ ] Recovery process works
- [ ] Hard delete still available for emergencies
- [ ] Audit logs capture all actions

## Conclusion

This approach provides:
- **Data Safety** - No accidental data loss
- **Compliance** - Meets retention requirements
- **Flexibility** - Multiple status options
- **Recovery** - Reversible operations
- **Security** - Controlled access to destructive operations

The soft delete approach protects against the catastrophic data loss that would occur with immediate schema deletion while maintaining the ability to truly delete data when legally required.