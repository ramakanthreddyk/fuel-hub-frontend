-- Migration: 009_rename_pumps_label_to_name
-- Description: Rename column label to name in pumps table

BEGIN;

ALTER TABLE public.pumps RENAME COLUMN label TO name;

INSERT INTO public.schema_migrations (version, description)
VALUES ('009', 'Rename pumps.label to name')
ON CONFLICT (version) DO NOTHING;

COMMIT;
