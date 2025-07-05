Project Context Summary: Previous integration tests fail to run due to missing database setup. The backend/docs/LOCAL_DEV_SETUP.md explains how to configure PostgreSQL locally or via Docker.
Steps already implemented: All API contract integration work up to STEP_fix_20260713_COMMAND.md.
Task: Document fallback instructions when tests cannot provision the Postgres DB. Update docs to reference LOCAL_DEV_SETUP as troubleshooting step and note test command behaviour.
Required documentation updates: CHANGELOG.md, docs/backend/CHANGELOG.md, docs/backend/IMPLEMENTATION_INDEX.md, docs/backend/PHASE_3_SUMMARY.md.
After coding, run `npm install` and `npm test` in `backend/`. If tests fail with "unable to provision test DB" start the Postgres container using `backend/scripts/start-dev-db.sh` or follow manual instructions in `backend/docs/LOCAL_DEV_SETUP.md`.
