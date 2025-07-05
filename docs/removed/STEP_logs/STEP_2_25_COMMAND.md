## Project Context
FuelSync Hub multi-tenant backend. Recent steps migrated several controllers to Prisma ORM.

## Prior Steps
- `STEP_2_23_COMMAND.md` migrated the user controller to Prisma.
- `STEP_2_24_COMMAND.md` migrated station, pump, nozzle, nozzle reading and fuel price controllers to Prisma and documented endpoints in backend_brain.md.

## Task
Inventory the complete backend API surface and compare it to the existing OpenAPI spec.
Generate a new up-to-date `docs/openapi.yaml` if the current spec is outdated.
Update `backend_brain.md` with a table of all endpoints showing which controller handles each and whether the code uses Prisma.
Document contract drift and migration status.

Also append an entry to CHANGELOG and PHASE_2_SUMMARY and IMPLEMENTATION_INDEX.
