# STEP_2_23_COMMAND.md — Prisma ORM Migration

## Project Context Summary
FuelSync Hub backend currently uses raw SQL queries against per-tenant schemas. A unified schema with `tenant_id` columns is available (see `db_brain.md`), but controllers still use schema-specific queries. We need documentation of all endpoints and an initial refactor toward the new schema using an ORM.

## Steps Already Implemented
- Previous fixes consolidated the schema (`STEP_fix_20250720.md`).
- API endpoints are implemented via Express routes using a `pg` pool.

## What to Build Now
1. Create `backend_brain.md` listing all active endpoints and documenting multi-tenancy conventions.
2. Highlight mismatches with `docs/openapi.yaml` under an "API contract drift" section.
3. Introduce Prisma ORM:
   - Add `prisma` and `@prisma/client` dependencies.
   - Create `prisma/schema.prisma` reflecting the unified schema.
   - Add `src/utils/prisma.ts` to export a PrismaClient instance.
   - Update `src/controllers/user.controller.ts` to use Prisma for basic CRUD operations (`list`, `get`, `create`, `update`).
4. Record best practices for Prisma and tenant filtering in `backend_brain.md`.
5. Update documentation: changelog, phase summary and implementation index.

## Files To Update
- `package.json`
- `package-lock.json`
- `prisma/schema.prisma` (new)
- `src/utils/prisma.ts` (new)
- `src/controllers/user.controller.ts`
- `backend_brain.md` (new)
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/CHANGELOG.md`
