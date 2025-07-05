# STEP\_1\_1\_COMMAND.md — Create Public Schema Migration & Seed

## ✅ Project Context Summary

FuelSync Hub is a multi-tenant ERP for fuel station networks. It uses schema-per-tenant architecture. The `public` schema holds global platform tables like tenants, admin users, plans, and logs.

## 📌 What Has Been Implemented

Only documentation exists at this stage. No database, backend, or frontend code has been created.

## 🛠️ What To Build Now

Create the initial database migration for the `public` schema, including:

### 1. Migration File (`migrations/001_create_public_schema.sql`):

Tables to create:

* `tenants (id, name, schema_name, created_at, plan_id)`
* `admin_users (id, email, password_hash, role, created_at)`
* `plans (id, name, config_json)`
* `admin_activity_logs (id, admin_user_id, action, created_at)`

### 2. Seed Script (`scripts/seed-public-schema.ts`):

* Insert demo plans (basic, pro)
* Insert a platform admin user (`admin@fuelsync.dev`, password hash placeholder)
* Insert a demo tenant (`Acme Fuels`) with schema name `acme_fuels`

### 3. Directory Structure to Create:

```
/migrations
/scripts
```

## 📄 Documentation to Update

After implementing this step:

* Add a new entry in `CHANGELOG.md` under `Features`
* Update `PHASE_1_SUMMARY.md` with schema structure and seed behavior
* Append this step to `IMPLEMENTATION_INDEX.md` with file links

## 🔁 Reminder

Follow the [AGENTS.md](./AGENTS.md) protocol strictly. This step must be considered incomplete unless all associated documentation is updated.
