# STEP_2_24_COMMAND.md — Continue Prisma Controller Migration

## Project Context Summary
The backend uses Express with raw SQL queries through the `pg` Pool. Step 2.23 introduced a Prisma ORM client and migrated the user controller's basic CRUD methods to Prisma. Other controllers still rely on direct SQL and tenant schemas. The unified schema stores all tenant data in the `public` schema with `tenant_id` columns.

## Steps Already Implemented
- Initial Prisma setup and user controller refactor (`STEP_2_23_COMMAND.md`).
- Full list of endpoints documented in `backend_brain.md`.

## What to Build Now
1. Extend the Prisma schema with models for `FuelPrice` and `UserStation` as needed for upcoming endpoints.
2. Refactor the following controllers to use Prisma for basic CRUD operations with `tenant_id` filtering:
   - `station.controller.ts` (`create`, `list`, `get`, `update`, `remove`)
   - `pump.controller.ts` (`create`, `list`, `get`, `update`, `remove`)
   - `nozzle.controller.ts` (`create`, `list`, `get`, `update`, `remove`)
   - `nozzleReading.controller.ts` (`create`, `list`)
   - `fuelPrice.controller.ts` (`create`, `list`, `update`, `remove`)
3. Leave any complex analytics or metrics routes using existing SQL-based services for now.
4. Update `backend_brain.md` with notes on the controllers now powered by Prisma.
5. Document the step in changelog, phase summary, and implementation index.

## Files To Update
- `prisma/schema.prisma`
- `src/controllers/station.controller.ts`
- `src/controllers/pump.controller.ts`
- `src/controllers/nozzle.controller.ts`
- `src/controllers/nozzleReading.controller.ts`
- `src/controllers/fuelPrice.controller.ts`
- `backend_brain.md`
- `docs/IMPLEMENTATION_INDEX.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/CHANGELOG.md`
