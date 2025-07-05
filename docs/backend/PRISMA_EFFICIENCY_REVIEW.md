---
title: PRISMA_EFFICIENCY_REVIEW.md — July 2025
lastUpdated: 2025-07-05
category: backend
---

# PRISMA_EFFICIENCY_REVIEW.md — July 2025

This brief note summarises the current Prisma usage across `/fuelsync` services.

- All core CRUD services leverage Prisma's query builder and transactions.
- Heavy analytics queries still rely on `prisma.$queryRaw` with parameter binding for performance.
- Remaining raw `pg` usage is limited to legacy `attendant.service.ts` and `tenant.service.ts`.
- No instances of `$queryRawUnsafe` are present.
- Indexes defined in `schema.prisma` match the latest migration scripts.

Overall Prisma usage is consistent and efficient, though further migration of legacy helpers is planned.
