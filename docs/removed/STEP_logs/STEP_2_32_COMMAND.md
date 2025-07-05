# STEP_2_32_COMMAND.md — Fix parameter names

## Project Context Summary
Previous step added analytics and lookup endpoints. Some path parameters were named generically (`id`) instead of the explicit names expected by the frontend (`userId`, `stationId`).

## Steps Already Implemented
- All endpoints implemented in STEP_2_31_COMMAND with OpenAPI updates

## What to Build Now
- Rename path parameters in OpenAPI spec for user and station detail endpoints
- Update controllers and route registrations to use `userId` and `stationId`
- Update backend brain table accordingly
- Document fix in CHANGELOG and PHASE summary, and add to IMPLEMENTATION_INDEX

## Files To Update
- `docs/openapi.yaml`
- `src/routes/user.route.ts`
- `src/routes/station.route.ts`
- `src/controllers/user.controller.ts`
- `src/controllers/station.controller.ts`
- `backend_brain.md`
- `docs/CHANGELOG.md`
- `docs/PHASE_2_SUMMARY.md`
- `docs/IMPLEMENTATION_INDEX.md`
