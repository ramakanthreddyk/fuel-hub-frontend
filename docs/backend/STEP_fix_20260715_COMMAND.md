Project Context Summary:
FuelSync Hub is a multi-tenant SaaS for fuel station networks. Phase 3 frontend UI includes ReadingsPage with buttons to view details and edit readings, but these routes are missing. Backend exposes CRUD APIs except for reading update and fetch-by-id.

Steps already implemented:
- Readings list and creation via NewReadingPage
- Hooks and service for reading creation and listing
- No route for reading detail/edit

Task:
Implement reading details and edit functionality.
Add backend endpoints to fetch and update single reading.
Update frontend service and hooks.
Add ReadingDetailPage and EditReadingPage with simple forms.
Register routes in App.tsx.
Update docs: CHANGELOG, IMPLEMENTATION_INDEX, PHASE_3_SUMMARY.
