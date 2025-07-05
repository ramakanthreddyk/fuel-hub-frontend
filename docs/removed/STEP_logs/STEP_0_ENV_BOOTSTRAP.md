# STEP\_0\_ENV\_BOOTSTRAP.md — Project Initialization & Environment Setup

## ✅ Project Context Summary

FuelSync Hub is a multi-tenant SaaS ERP built with a Codex-driven workflow. Phase 1 started with SQL migrations and TypeScript seed scripts. To execute these reliably, we need to initialize the project environment.

## 🔧 Objective

Create the foundational project setup:

* `package.json`
* TypeScript configuration (`tsconfig.json`)
* Dev dependencies
* NPM scripts for database ops

## 📂 Files to Create or Modify

### 1. `package.json`

Should include:

* Project metadata
* Dev dependencies: `typescript`, `ts-node`, `pg`, `dotenv`
* Scripts:

```json
"scripts": {
  "db:seed": "ts-node scripts/seed-public-schema.ts",
  "db:migrate": "psql -U postgres -f migrations/001_create_public_schema.sql"
}
```

### 2. `tsconfig.json`

Minimal config for seed scripts:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "esModuleInterop": true,
    "strict": true
  },
  "include": ["scripts/**/*.ts"]
}
```

### 3. `.env`

Add a sample Postgres connection string:

```
DATABASE_URL=postgres://postgres:postgres@localhost:5432/fuelsync
```

### 4. `.gitignore`

Add:

```
node_modules/
dist/
.env
```

## 📄 Documentation to Update

After executing this step:

* Add a `Features` entry in `CHANGELOG.md`
* Update `PHASE_1_SUMMARY.md` to reference environment setup
* Add the step to `IMPLEMENTATION_INDEX.md` with file links

## 🚨 Reminder

You must document any executed code change in `CHANGELOG.md`, update the phase summary, and register this step in `IMPLEMENTATION_INDEX.md`. Failure to do so means this step is incomplete.

---

This step ensures the repository is now runnable without internet access and sets up a consistent scripting environment for all Codex-based workflows.
