# STEP\_1\_18\_COMMAND.md — Dev Database via Docker Compose

---

## 🧠 Project Context

FuelSync Hub requires a local dev database stack to:

* Run seed scripts
* Validate schema and constraints
* Provide persistent storage across agent runs

Earlier scripts assume a local Postgres instance, but reproducibility is better with a defined Compose stack.

---

## ✅ Prior Steps Implemented

* `pg` used in seed/validation scripts
* Tenant schema and utility helpers in place
* No running Docker environment defined yet

---

## 🛠 Task: Create Docker Compose for Dev Database

### 📂 Files to Create

* `docker-compose.yml`
* `.env.development`

### 📄 docker-compose.yml Requirements

```yaml
db:
  image: postgres:15
  container_name: fuelsync-db
  restart: always
  ports:
    - "5432:5432"
  environment:
    DB_USER: ${DB_USER}
    DB_PASSWORD: ${DB_PASS}
    DB_NAME: ${DB_NAME}
  volumes:
    - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Also add `.env.development` with matching credentials:

```
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USER=fuelsync
DB_PASS=fuelsync
DB_NAME=fuelsync_hub
```

Update code to load `.env.development` when `NODE_ENV=development`, and fallback to `.env` otherwise. This enables user-specific overrides and environment-based isolation.

---

## 📓 Docs to Update

* [ ] `PHASE_1_SUMMARY.md`: Add Docker setup step
* [ ] `CHANGELOG.md`: Add infrastructure enhancement entry
* [ ] `IMPLEMENTATION_INDEX.md`: Log Step 1.18
* [ ] `TROUBLESHOOTING.md`: Add common Docker issues (e.g., port in use, no mount)

---

## ✅ Acceptance Criteria

* ✅ `docker-compose up -d` starts Postgres container
* ✅ Seed scripts connect without local Postgres installation
* ✅ Docker volumes ensure persistent data
* ✅ `.env.development` is used in dev; `.env` in other envs

---
