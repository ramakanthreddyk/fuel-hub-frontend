-- Optional plan-based CHECK constraints
-- These are commented out by default to avoid interference during development.

-- Example: limit stations count per tenant schema
-- ALTER TABLE {{schema_name}}.stations
--   ADD CONSTRAINT plan_max_stations
--   CHECK ((SELECT COUNT(*) FROM {{schema_name}}.stations) < plan_limit_placeholder);

-- Add similar constraints for pumps, nozzles, and users as needed.
