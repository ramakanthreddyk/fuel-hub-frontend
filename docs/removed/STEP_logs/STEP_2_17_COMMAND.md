# STEP_2_17_COMMAND.md — Azure Deployment Restructure

## Project Context
Phase 2 backend features are complete through `STEP_2_16`. The repo currently starts via `start-server.js` which runs `ts-node` on `src/app.ts`. Azure App Service expects `index.js` at the repo root and a `start` script pointing to it.

## Prior Steps Implemented
* ✅ `STEP_2_16` – Utility Scripts & Fuel Inventory
* ✅ `STEP_fix_20250703` – Remove uuid-ossp defaults

## What Was Done Now
* Renamed `start-server.js` ➜ `index.js`
* Updated `package.json` start script to `node index.js` and added Node `20.x` engines field
* Updated `scripts/start-and-test.js` to spawn `index.js`
* Ensured `.gitignore` keeps `package.json`

## Files To Update
* `index.js`
* `package.json`
* `scripts/start-and-test.js`
* Documentation: `docs/CHANGELOG.md`, `docs/PHASE_2_SUMMARY.md`, `docs/IMPLEMENTATION_INDEX.md`
