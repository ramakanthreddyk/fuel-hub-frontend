STEP_2_15_COMMAND.md — Sales Listing and Tenant Settings API
🧠 Context:
We have completed all core backend features. However, a few important APIs are missing that are required for station owners and reporting tools. This step addresses those and documents others for future implementation.

🚧 What to Build
1. GET /v1/sales — List Recorded Sales
Allow filtering by:

stationId

nozzleId

startDate, endDate

Secure with authenticateJWT and role check (owner/manager only)

2. GET /v1/settings — View Tenant Preferences
Return current preferences (e.g., receiptTemplate, fuelRounding, brandingLogoUrl)

Pull from tenant_settings table (public schema or tenant schema as designed)

3. POST /v1/settings — Update Preferences
Allow owner to update branding or configuration fields

Secure with owner-only access

📁 Affected Files
txt
Copy
Edit
src/
├── routes/sales.route.ts
├── controllers/sales.controller.ts
├── services/sales.service.ts
├── routes/settings.route.ts
├── controllers/settings.controller.ts
├── services/settings.service.ts
📘 Documentation
Update the following:

CHANGELOG.md: ✅ Added /v1/sales and /v1/settings

IMPLEMENTATION_INDEX.md: Add Step 2.15 entry

PHASE_2_SUMMARY.md: Mark this as closing backend implementation

BUSINESS_RULES.md: Note settings model and access levels

📝 Future Enhancements (Only document for now)
GET /v1/audit-logs — For admin and tenant activity tracking

GET /v1/validation-issues — Form field errors / missing critical config

GET /v1/plan-limits — View remaining nozzle, station, and user limits
