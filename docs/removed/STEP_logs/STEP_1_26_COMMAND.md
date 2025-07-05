# STEP_1_26_COMMAND.md

## 🔧 Project Context Summary

FuelSync Hub is a multi-tenant SaaS ERP for fuel stations with a strict local Docker + Postgres development stack for Codex. However, developers require the flexibility to use Azure PostgreSQL for testing and schema validation, **excluding `pgcrypto`**. This step introduces safe support for Azure without violating Codex's execution protocol.

## ✅ Steps Already Implemented

- Local `pgcrypto`-based unified schema: `migrations/schema/003_unified_schema.sql`
- Docker-based Postgres and migration CLI
- AGENTS.md rules enforcing local development for Codex

## 🚀 What to Build Now

### 1. Modify `AGENTS.md`

Update the **Environment Constraints** section to define:

- Codex agents **must** use Docker-based Postgres with `pgcrypto`
- Human developers **may** use Azure PostgreSQL (without `pgcrypto`)
- Provide a safe override path via a script

### 2. Add Azure Setup Script

Create: `scripts/setup-azure-schema.js`

This script:
- Reads `003_unified_schema.sql`
- Strips or comments `pgcrypto` extension
- Connects to Azure via `process.env`
- Runs the adjusted SQL

### 3. Add Azure Dev Guide

Create: `docs/AZURE_DEV_SETUP.md`

This file documents:
- `.env` config for Azure
- How to run `setup-azure-schema.js`
- Limitations (no `pgcrypto`, no production data, Codex must not use this)

## 📂 Files to Create / Modify

- `AGENTS.md`: update "Environment Constraints"
- `scripts/setup-azure-schema.js`: new file
- `docs/AZURE_DEV_SETUP.md`: new file

## 🧠 Reminder to Update Docs

- Add this step to `IMPLEMENTATION_INDEX.md`
- Append to `CHANGELOG.md` under "Enhancements"
- Mark as complete in `PHASE_1_SUMMARY.md`
