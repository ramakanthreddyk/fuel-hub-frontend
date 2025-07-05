---
title: Azure Developer Setup
lastUpdated: 2025-07-05
category: guides
---

# Azure Developer Setup

This guide explains how human developers can use an Azure PostgreSQL instance for schema validation and testing.
Codex agents must continue using the local Docker database with `pgcrypto` and **should never run this script**.

## 1. Configure Environment

Create a `.env` file with your Azure connection details:

```env
DB_HOST=your-azure-server.postgres.database.azure.com
DB_PORT=5432
DB_USER=azure-user
DB_PASSWORD=your-password
DB_NAME=fuelsync_dev
```

## 2. Apply the Schema

Run the helper script to load the unified schema without enabling `pgcrypto`:

```bash
node scripts/setup-azure-schema.js
```

This script reads `migrations/schema/003_unified_schema.sql`, comments out the `pgcrypto` extension line, and runs the adjusted SQL against your Azure database.

*Note:* The script checks for Codex environment variables and exits immediately if detected.

## Limitations

- Do **not** use production data on this instance.
- The script intentionally omits `pgcrypto`; UUID defaults may behave differently.
- Codex agents are restricted from using this path.
