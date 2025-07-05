-- Migration: 008_create_tenant_settings_kv
-- Description: Key-value settings per tenant managed by SuperAdmin

BEGIN;

CREATE TABLE IF NOT EXISTS public.tenant_settings_kv (
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (tenant_id, key)
);

CREATE INDEX IF NOT EXISTS idx_tenant_settings_kv_tenant ON public.tenant_settings_kv(tenant_id);

INSERT INTO public.schema_migrations (version, description)
VALUES ('008', 'Create tenant_settings_kv table')
ON CONFLICT (version) DO NOTHING;

COMMIT;
