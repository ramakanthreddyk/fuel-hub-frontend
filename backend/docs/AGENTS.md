# AGENTS.md — Operational Brain of FuelSync Hub

This file is the **permanent memory and execution protocol** for any AI agent (Codex, GitHub Copilot Workspace, Amazon Q Dev Agent, etc.) or human contributor working on the FuelSync Hub repository.  **Read it before every step.**

---

## 🌍 Purpose of the System

**FuelSync Hub** is a multi‑tenant SaaS ERP that digitises daily operations for fuel‑station networks.

*Goals*

1. Capture cumulative nozzle readings ➜ convert to delta‑based sales automatically.
2. Track creditors, fuel deliveries, pricing history, and daily reconciliations.
3. Provide role‑based dashboards (SuperAdmin → Owner → Manager → Attendant).
4. Enforce plan limits (stations, pumps, nozzles, API access, reports).
5. Offer future‑proof integration points (POS, UPI, mobile apps).

---

## 🏗️ Architectural Philosophy

| Principle                    | Detail                                                                     |
| ---------------------------- | -------------------------------------------------------------------------- |
| **Schema‑per‑Tenant**        | Each tenant has its own Postgres schema; platform tables live in `public`. |
| **Modular Domains**          | Readings, Sales, Credit, Inventory, Plans, Reconciliation.                 |
| **RBAC**                     | Four roles with strict scopes.                                             |
| **Audit + Validation First** | DEFERRABLE constraints & service‑layer checks.                             |
| **Codex‑First Workflow**     | All code is generated through AI prompts that update docs & changelogs.    |

---

## 🎢 Evolution Timeline

| Stage                | Highlight                                               |
| -------------------- | ------------------------------------------------------- |
| **MVP**              | Basic readings ➜ delta ➜ sales logic.                   |
| **Domain Expansion** | Added creditors, reconciliation, pricing history.       |
| **Plan Enforcement** | Tenant‑level feature & usage limits.                    |
| **AI Workflow**      | Introduced Codex‑driven build with documentation chain. |

---

## 🔁 Implementation Phases & Order

1. **Phase 1 — Database**  – schema, constraints, seed scripts, validation scripts.
2. **Phase 2 — Backend**  – services, APIs, business logic, auth, plan enforcement.
3. **Phase 3 — Frontend** – Next.js UI, React Query hooks, dashboards, E2E tests.

> ⚠️ **Phases must be completed strictly in order.**

---

## 🧑‍💻 Agent Execution Protocol  (High‑Level)

For **every** new task:

1. **Read context** in this file.
2. **Consult** `IMPLEMENTATION_INDEX.md` for completed / pending steps.
3. **Document the prompt** you are about to execute by creating a file named `STEP_<phase>_<step>_COMMAND.md` in the repo root (or under `docs/`).   This file **must include**:

   * Project Context Summary
   * Steps already implemented (with filenames)
   * What to build now, where, and why
   * Required documentation updates
4. **Execute the code changes** exactly as specified in the prompt.
5. **Self‑document results**:

   * ✔️ Mark step **Done** in `PHASE_X_SUMMARY.md`
   * 📝 Append entry to `CHANGELOG.md` (Features / Fixes / Enhancements)
   * 🔗 Add row to `IMPLEMENTATION_INDEX.md` with file links
   * 🔗 If new files were created, update any relevant docs (e.g., `DATABASE_GUIDE.md`, `SEEDING.md`)
6. Dependency Handling: If any code references external packages (pg, dotenv, ts-node, etc.):
   Add them to package.json
  Ensure the repo is runnable without manual installation
  Log changes in CHANGELOG.md
> If any documentation update is missing, the step is considered **incomplete** and must be fixed before moving on.

---

## 🛠 Troubleshooting Flow

When an issue is found in code or logic:

1. **Locate the last executed `STEP_X_Y_COMMAND.md`** to see what was intended.
2. Cross‑check the change in `CHANGELOG.md` & `PHASE_X_SUMMARY.md`.
3. Consult specific domain docs:

   * Auth issues → `AUTH.md`
   * Seed errors → `SEEDING.md`
   * Plan limit mis‑behaviour → `PLANS.md`
   * FK / schema mismatch → `DATABASE_GUIDE.md`
4. Review `TROUBLESHOOTING.md` for common fixes.
5. Create a new **fix step** (`STEP_fix_<date>.md`) and follow the same execution protocol.

---

## 🧭 Environment Constraints

* 🚫 **No external services** — everything must run in a local Docker + Postgres stack.
* 🚫 **No hidden cloud calls** — seed scripts, migrations, and runtime config are entirely file‑based.
* 🌐 Optional services (Redis, S3) must be stubbed locally.
* 🐳 **Codex agents** must use the provided Docker Postgres with `pgcrypto` enabled.
* ☁️ **Human developers** may connect to an Azure PostgreSQL instance (without `pgcrypto`) using `scripts/setup-azure-schema.js`.
* 🚫 **Codex must never run `setup-azure-schema.js` or attempt to connect to Azure.**

---

## 🚨 Codex Prompting Standard

Every prompt **must contain**:

* ✅ Project Context Summary
* ✅ Prior steps implemented and file list
* ✅ Detailed task description (what, where, why)
* ✅ Explicit file paths to create or modify
* ✅ Reminder to update docs (Changelog, Phase summary, Index)

Prompt writers **must store** the prompt as a `STEP_X_Y_COMMAND.md` file so future agents can resume deterministically.

---

## 🗂️ Linked Documentation

| File                      | Purpose                                              |
| ------------------------- | ---------------------------------------------------- |
| `BUSINESS_RULES.md`       | Canonical business & validation rules.               |
| `IMPLEMENTATION_INDEX.md` | Master list of all steps & file links.               |
| `CHANGELOG.md`            | Chronological log (Features / Fixes / Enhancements). |
| `PHASE_1_SUMMARY.md`      | Database‑phase details & validations.                |
| `PHASE_2_SUMMARY.md`      | Backend‑phase details & validations.                 |
| `PHASE_3_SUMMARY.md`      | Frontend‑phase details & validations.                |
| `ARCHITECTURE.md`         | System structure & module overview.                  |

---

## 🧠 Future Prompt Memory Reminder

> This project uses a Codex-first architecture. We’ve already implemented a central brain (`AGENTS.md`) that governs execution rules, changelogs, documentation links, and phase summaries.  
> All previous steps are documented in `STEP_X_Y_COMMAND.md` files, and each includes project context, prior steps, current task, and doc update instructions.  
> The backend and database are complete and independently testable. Codex must never forget the architecture, schema-per-tenant model, or role-based access.  
> Every new command must respect the AGENTS.md protocol and contribute to documentation (CHANGELOG, PHASE summary, IMPLEMENTATION_INDEX, etc).  
> Consider this project as a **neural architecture** — every part is linked, validated, and remembered. Nothing is standalone.

> **Rule**: All APIs must use `/vX/` versioning and `errorResponse(...)` format. Pooling must follow Azure constraints.

## Database Management

### Current Issues Fixed
- ✅ Moved schema from app.ts to proper migration files
- ✅ Created migration tracking system
- ✅ Added profit tracking and inventory management
- ✅ Implemented station comparison and ranking APIs
- ✅ Added proper database documentation

### Migration System
```
migrations/
├── schema/
│   ├── 001_initial_schema.sql
│   └── 003_unified_schema.sql
├── seeds/
│   └── production_seed.sql
└── rollbacks/
    └── (rollback scripts)
```

### Usage
```bash
# Run migrations
node scripts/migrate.js up

# Check status
node scripts/migrate.js status
```

## Owner Role Implementation Status

### ✅ Completed Features
- Station-wise dashboard filtering
- Profit tracking and margin analysis
- Station comparison and ranking
- Inventory management with alerts
- Advanced analytics endpoints
- Mobile-responsive components

### 📊 API Endpoints Added
```
GET /api/v1/stations/compare
GET /api/v1/stations/ranking
GET /api/v1/inventory
POST /api/v1/inventory/update
GET /api/v1/inventory/alerts
```

### 🗄️ Database Schema Updates
- Added cost_price and profit columns to sales
- Added fuel_inventory table for stock tracking
- Added alerts table for notifications
- Added station_id to creditors for proper filtering
- Added performance indexes

## blocked_items

- `npm test` fails: test database cannot be created in this environment.
- Migration system needs to be tested in production environment
