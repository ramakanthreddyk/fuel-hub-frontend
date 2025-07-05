---
title: FRONTEND_REFERENCE_GUIDE.md — Authoritative Implementation Guide
lastUpdated: 2025-07-05
category: frontend
---

# FRONTEND_REFERENCE_GUIDE.md — Authoritative Implementation Guide

This guide clarifies how the frontend stays in sync with the backend and database.
Always consult this file before implementing UI changes.

## Canonical API Specification

The OpenAPI contract lives at `docs/openapi-spec.yaml`. Any schema or endpoint change must be reflected here. The previous file `frontend/docs/openapi-v1.yaml` remains for historical reference only.


#### 🔄 Correct Schema Change Propagation Flow

1. **Database**
   * Apply schema changes via migrations.
   * Update seed scripts if needed.
   * Record structural decisions in `db_brain.md`.
2. **Backend**
   * Adjust models, services, validations, and endpoints to match schema changes.
   * Document changes in `backend_brain.md`.
3. **OpenAPI Spec**
   * Sync API definitions in `docs/openapi-spec.yaml`.
4. **Frontend**
   * Update components, forms, API hooks, and state logic as per the updated spec.
   * Document any temporary gaps in `frontend/docs/api-diff.md`.
5. **Documentation Sync**
   * Finally, update this `FRONTEND_REFERENCE_GUIDE.md` to reflect that all upstream changes are complete and frontend is safe to proceed.

Refer to `frontend/docs/api-diff.md` for any temporary differences between the specification and implementation.

## Schema Changes

The flow always starts from the database. Consult `DATABASE_MANAGEMENT.md` for detailed migration and script instructions and review design notes in `db_brain.md`. Backend adjustments are tracked in `backend_brain.md`. Once `docs/openapi-spec.yaml` is updated, the frontend should follow this guide and `frontend/docs/api-diff.md` to implement changes. Do not assume schema updates before these docs are in sync.
