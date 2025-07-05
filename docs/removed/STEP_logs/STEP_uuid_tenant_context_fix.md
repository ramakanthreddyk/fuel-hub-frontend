# STEP: UUID Tenant Context Fix

## Project Context Summary
FuelSync Hub multi-tenant SaaS with station management functionality. Users were unable to create stations due to UUID validation errors caused by incorrect tenant context resolution.

## Prior Steps Implemented
- Complete station management workflow with creation dialogs
- Enhanced backend services with schema name handling
- Fixed service layer consistency across all operations
- Tenant hierarchy components and API integration complete

## Current Task Description

### Issue Identified:
- **Error**: `invalid input syntax for type uuid: "bittu"`
- **Root Cause**: Controllers using `tenantId` from request instead of `schemaName`
- **Impact**: Station, pump, and nozzle creation failing with UUID validation errors
- **Data Flow**: Frontend → API → Controller → Service (UUID mismatch here)

### What to Fix:
1. **Station Controller**: Replace `tenantId` with `schemaName` in all handlers
2. **Pump Controller**: Fix tenant context resolution for all CRUD operations
3. **Nozzle Controller**: Update to use proper schema name instead of tenant ID
4. **Readings Controller**: Ensure consistent tenant context handling
5. **All Related Controllers**: Systematic fix across entire codebase

### Where to Implement:
- `src/controllers/station.controller.ts` - Fix tenant context resolution
- `src/controllers/pump.controller.ts` - Update all handlers to use schemaName
- `src/controllers/nozzle.controller.ts` - Fix tenant context in CRUD operations
- `src/controllers/nozzleReading.controller.ts` - Ensure consistent handling
- `src/middlewares/defaultTenant.ts` - Verify middleware sets schemaName correctly

### Why These Changes:
- Services expect `schemaName` but controllers pass `tenantId`
- `tenantId` contains user identifier instead of schema name
- Schema names are used for database table prefixing
- UUID validation fails when non-UUID strings passed as tenant ID
- Consistent tenant context resolution prevents data isolation issues

## Implementation Details

### 1. Controller Pattern Fix
```typescript
// BEFORE (Incorrect)
const tenantId = req.user?.tenantId || req.headers['x-tenant-id'] as string;
await createStation(db, tenantId, data.name, data.address);

// AFTER (Correct)
const schemaName = (req as any).schemaName;
await createStation(db, schemaName, data.name, data.address);
```

### 2. Service Layer Expectation
```typescript
// Services expect schema names like:
export async function createStation(db: Pool, schemaName: string, name: string, address?: string)

// NOT tenant UUIDs like:
export async function createStation(db: Pool, tenantId: string, name: string, address?: string)
```

### 3. Tenant Context Flow
```
Request → defaultTenant middleware → sets schemaName → Controller → Service
```

### 4. Schema Name Format
- Pattern: `tenant_companyname_timestamp`
- Example: `tenant_acme_corp_123456`
- Used for: `${schemaName}.stations`, `${schemaName}.pumps`, etc.

## Required Documentation Updates
- Update `CHANGELOG.md` with UUID tenant context fix
- Document tenant context resolution pattern
- Add troubleshooting guide for UUID validation errors

## Files Modified

### Controllers Fixed:
- `src/controllers/station.controller.ts` - All CRUD operations
- `src/controllers/pump.controller.ts` - Create, list, delete handlers
- `src/controllers/nozzle.controller.ts` - All nozzle operations
- `src/controllers/nozzleReading.controller.ts` - Reading operations (if exists)

### Pattern Applied:
```typescript
// Replace this pattern everywhere:
const tenantId = req.user?.tenantId || req.headers['x-tenant-id'] as string;

// With this pattern:
const schemaName = (req as any).schemaName;
```

## Success Criteria
- [ ] Station creation works without UUID errors
- [ ] Pump creation functions properly
- [ ] Nozzle creation and management operational
- [ ] All CRUD operations use consistent tenant context
- [ ] No more "invalid input syntax for type uuid" errors
- [ ] Tenant isolation maintained across all operations

## Testing Requirements
- [ ] Create station with name and address
- [ ] Add pumps to created station
- [ ] Add nozzles to created pumps
- [ ] Verify all operations use correct schema names
- [ ] Test with multiple tenants to ensure isolation
- [ ] Confirm readings and other operations work

This step resolves the critical UUID validation issue preventing station management functionality from working properly.