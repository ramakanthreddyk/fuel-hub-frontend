# Step 2.28 Command — Complete OpenAPI Schemas

## Context
The backend now uses Prisma for several controllers and the OpenAPI spec lists every route but lacked request/response schemas. Admin endpoints were partially unversioned.

## Task
- Add ErrorResponse schema and generic success/error responses.
- Ensure every path has `responses` and body schemas if needed.
- Normalize `/admin/*` paths to `/api/v1/admin/*`.
- Record contract drift about errorResponse shape.

## Files
- `docs/openapi.yaml`
- `backend_brain.md`
- Update `CHANGELOG`, `IMPLEMENTATION_INDEX`, `PHASE_2_SUMMARY`.
