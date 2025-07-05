# STEP_fix_20260720_COMMAND.md — Display nozzle number and recorder

Project Context Summary:
Daily Reading Log cards showed pump name but omitted nozzle number and the attendant name, confusing station managers. Backend `/v1/nozzle-readings` already returns `nozzle_number` and `recorded_by` but the UI header didn't display them.

Steps already implemented: All fixes through `STEP_fix_20260719_COMMAND.md` including lint cleanup and local DB docs.

Task: Verify API and React Query hooks expose `nozzleNumber` and `recordedBy`. Update `ReadingReceiptCard` to combine pump name and nozzle number in the header and display the recorder. Document changes.

Required documentation updates: `CHANGELOG.md`, `docs/backend/CHANGELOG.md`, `docs/backend/IMPLEMENTATION_INDEX.md`, `docs/backend/PHASE_3_SUMMARY.md`.
