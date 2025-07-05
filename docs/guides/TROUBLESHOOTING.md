---
title: TROUBLESHOOTING.md — Common Issues & Fixes
lastUpdated: 2025-07-05
category: guides
---

# TROUBLESHOOTING.md — Common Issues & Fixes

This file lists known issues, recurring bugs, and their resolutions in FuelSync Hub during development.

---

## 🚫 Invalid Nozzle Reading

**Symptom:** Sales not generated, or validation error.

**Cause:** New reading is lower than previous reading.

**Fix:**

* Ensure readings are strictly increasing
* Check for correct nozzle assignment

---

## ❌ Trigger Errors During Seed

**Symptom:** Constraint failure during seed script.

**Cause:** Insert order violates business rules.

**Fix:**

* Disable immediate triggers (move logic to app)
* Use deferred constraint or handle via code

---

## 📉 Plan Limit Not Enforced

**Symptom:** Extra stations or pumps allowed beyond plan.

**Fix:**

* Ensure plan logic is read dynamically
* Check middleware like `checkPumpLimit`

---

## 🧪 Test Failures

**Symptom:** `jest` fails on `sales.test.ts`.

**Cause:** DB not seeded correctly.

**Fix:**

```bash
npm run setup-db
```

## 🐘 Test DB Provisioning Failure

**Symptom:** `npm test` prints `Skipping tests: unable to provision test DB.`

**Cause:** The Jest global setup couldn't create `fuelsync_test` because
`psql` is missing or the development database container isn't running.

**Fix:**

* Ensure PostgreSQL is installed and `psql` is on your `PATH`, or start the
  Docker database with `./scripts/start-dev-db.sh`.
  On Ubuntu/Debian:

  ```bash
  sudo apt-get update && sudo apt-get install -y postgresql
  sudo service postgresql start
  ```
* Rerun `npm test` once the database is available. The setup script will
  create and seed `fuelsync_test` automatically.

---

## 🐳 Docker Compose Issues

**Symptom:** `docker-compose up` fails or database container won't start.

**Fix:**

* Ensure port `5432` is free or change `DB_PORT` in `.env.development`
* Remove old volumes via `docker volume rm fuelsync_pgdata`
* Install Docker and Docker Compose if `docker-compose` is not found. If Docker
  isn't available, install PostgreSQL locally via your package manager and
  update `.env.development` to point to the local service. All scripts and
  tests will work with a running local instance on port `5432`.

---

> Update this file frequently during QA or new phase onboarding.

\n## Nozzle Display Issues\n

If you're experiencing issues with nozzles not displaying properly, here are some steps to resolve the problem:

## Common Issues

### 1. Blank Nozzles Page

If you navigate to the nozzles page and see a blank page or no nozzles listed:

1. **Check the URL**: Make sure the URL includes both `pumpId` and `stationId` parameters
   - Correct format: `/dashboard/nozzles?pumpId=123&stationId=456`

2. **Refresh the page**: Sometimes a simple refresh can resolve display issues

3. **Try the direct approach**:
   - Go to Stations page
   - Select a station
   - Go to Pumps page
   - Click "View Nozzles" on a pump card

### 2. "No Nozzles Found" Message

If you see a message saying "No nozzles found":

1. **Create a nozzle**: Click the "Add Nozzle" or "Add First Nozzle" button
2. **Check pump status**: Make sure the pump is set to "active" status
3. **Verify pump exists**: Make sure the pump ID in the URL is valid

### 3. After Creating a Nozzle

If you create a nozzle and encounter issues:

1. **Go back to pumps**: Navigate back to the pumps page
2. **View nozzles again**: Click "View Nozzles" on the pump card
3. **Check for errors**: Look for any error messages in the console or UI

## Setup Flow Reminder

Remember to follow the proper setup flow:

1. Create Stations
2. Create Pumps for each Station
3. Create Nozzles for each Pump
4. Set Fuel Prices

## Technical Notes

The nozzles API response format can vary. If you're a developer troubleshooting this issue:

1. Check the browser console for API response data
2. Verify that the response format matches what the frontend expects
3. Look for the debug panel at the bottom of the page (in development mode)
4. Try the direct API call button to see the raw response

If issues persist, please contact support with screenshots of the debug panel.
