-- validate-foreign-keys.sql
-- Lists foreign keys that are not DEFERRABLE INITIALLY DEFERRED in the given schema
SELECT
    conrelid::regclass AS table,
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE n.nspname = $1
  AND c.contype = 'f'
  AND (NOT c.condeferrable OR NOT c.condeferred)
ORDER BY table, constraint_name;
