
# Documentation Maintenance Script

## Purpose
This script ensures all documentation stays synchronized with the OpenAPI specification and codebase changes.

## Maintenance Workflow

### When OpenAPI Spec Changes
1. Backend team updates `docs/openapi-spec.yaml`
2. Run type generation (when implemented):
   ```bash
   npm run generate-types
   ```
3. Update contract services if needed
4. Update `docs/FRONTEND_BRAIN.md` status tables
5. Update `docs/FRONTEND_BACKEND_MISMATCHES.md` if issues found

### When Adding New Services
1. Create new service in `src/api/contract/[name].service.ts`
2. Create corresponding hook in `src/hooks/useContract[Name].ts`
3. Update `docs/FRONTEND_BRAIN.md` persona mapping tables
4. Update `src/api/generated/index.ts` exports
5. Update migration checklist

### When Deprecating Legacy APIs
1. Mark service as deprecated in `docs/FRONTEND_BRAIN.md`
2. Update migration checklist
3. Remove from `src/api/generated/index.ts` once migrated
4. Delete legacy files after full migration

### Monthly Reviews
- Review `docs/FRONTEND_BACKEND_MISMATCHES.md`
- Update persona journey status
- Check for abandoned legacy API files
- Validate contract compliance across services

## Key Files to Maintain
- `docs/FRONTEND_BRAIN.md` - Main frontend guide
- `src/api/api-contract.ts` - Single contract file
- `docs/FRONTEND_BACKEND_MISMATCHES.md` - Issue tracking
- `src/api/generated/index.ts` - Export management

## Automation Goals
- Auto-generate types from OpenAPI spec
- Auto-update status tables in documentation
- Auto-detect contract drift
- Auto-validate service implementations
