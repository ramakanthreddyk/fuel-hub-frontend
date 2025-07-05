# STEP_3_12_COMMAND.md — Role API Implementation Matrix

## Project Context Summary
FuelSync Hub is a multi-tenant ERP for fuel stations. The frontend uses React with role-based routes and hooks. Previous steps up to **3.11** implemented dashboard pages and various API alignments. Documentation lists journeys per role but the mapping between frontend components and backend endpoints was not consolidated.

## Steps Already Implemented
- SuperAdmin, Owner, Manager and Attendant pages exist under `src/pages`
- Services and hooks for each domain are implemented in `src/api` and `src/hooks`
- Documentation up to `STEP_fix_20251223.md` aligns openapi with services

## What to Build Now, Where, and Why
- Create `docs/ROLE_API_IMPLEMENTATION_MATRIX.md` summarising how each role’s pages and hooks call backend endpoints
- Confirm paths directly from `src/api` services to avoid outdated docs
- Note role guard usage via `RequireAuth` component
- Update `fuelsync/docs/IMPLEMENTATION_INDEX.md` with step **3.12**
- Mark step done in `fuelsync/docs/PHASE_3_SUMMARY.md`
- Reference the new doc in `docs/DOCUMENTATION_MAP.md`
- Add changelog entry

## Required Documentation Updates
- `CHANGELOG.md`
- `fuelsync/docs/PHASE_3_SUMMARY.md`
- `fuelsync/docs/IMPLEMENTATION_INDEX.md`
- `docs/DOCUMENTATION_MAP.md`
- New file: `docs/ROLE_API_IMPLEMENTATION_MATRIX.md`
