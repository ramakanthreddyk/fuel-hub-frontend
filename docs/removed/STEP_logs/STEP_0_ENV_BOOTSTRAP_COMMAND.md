# STEP_0_ENV_BOOTSTRAP_COMMAND.md — Execute Environment Bootstrap

## ✅ Project Context Summary
FuelSync Hub is a Codex-driven, multi-tenant ERP for fuel stations. The repo currently contains only documentation. Phase 1 will begin with database migrations and seed scripts, which require a Node.js + TypeScript setup for local execution.

## 📌 Prior Steps Implemented
None — this is the first actionable step. Only documentation exists so far.

## 🛠️ What To Build Now
Implement the environment bootstrap as described in `STEP_0_ENV_BOOTSTRAP.md`:

1. Create `package.json` with project metadata, dev dependencies (`typescript`, `ts-node`, `pg`, `dotenv`) and scripts:
   - `db:seed`: `ts-node scripts/seed-public-schema.ts`
   - `db:migrate`: `psql -U postgres -f migrations/001_create_public_schema.sql`
2. Create `tsconfig.json` configured for the seed scripts.
3. Add a sample `.env` with `DATABASE_URL` connection string.
4. Add `.gitignore` entries for `node_modules/`, `dist/`, and `.env`.

## 📄 Required Documentation Updates
After executing code changes, update:

- `CHANGELOG.md` – add a Features entry for environment setup.
- `PHASE_1_SUMMARY.md` – document Step 0 as completed.
- `IMPLEMENTATION_INDEX.md` – add a row for Step 0 with file links.
