## Step 2.27 – OpenAPI Spec Normalisation

**Project Context**: backend migrating to Prisma and keeping documentation in sync. Previous step audited routes against the API spec.

**Implemented Steps**:
- Updated `openapi.yaml` with proper `{id}` parameters and summaries.
- Generated comparison of old vs new specs and noted drift in `backend_brain.md`.

**Files**: `docs/openapi.yaml`, `backend_brain.md`, documentation logs.

**Next**: continue refactoring controllers using Prisma while keeping the spec up to date.
