-- Migration: 006_add_tenant_id_columns
-- Description: Add tenant_id columns to existing tables if missing

BEGIN;

-- Helper function to add tenant_id column with FK if not exists
CREATE OR REPLACE FUNCTION public.add_tenant_id_if_missing(tbl TEXT) RETURNS void AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
     WHERE table_schema = 'public'
       AND table_name = tbl
       AND column_name = 'tenant_id'
  ) THEN
    EXECUTE format('ALTER TABLE public.%I ADD COLUMN tenant_id UUID', tbl);
    EXECUTE format(
      'ALTER TABLE public.%I ADD CONSTRAINT fk_%I_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE',
      tbl, tbl
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- List of tenant tables
SELECT public.add_tenant_id_if_missing('users');
SELECT public.add_tenant_id_if_missing('stations');
SELECT public.add_tenant_id_if_missing('pumps');
SELECT public.add_tenant_id_if_missing('nozzles');
SELECT public.add_tenant_id_if_missing('fuel_prices');
SELECT public.add_tenant_id_if_missing('creditors');
SELECT public.add_tenant_id_if_missing('credit_payments');
SELECT public.add_tenant_id_if_missing('nozzle_readings');
SELECT public.add_tenant_id_if_missing('sales');
SELECT public.add_tenant_id_if_missing('day_reconciliations');
SELECT public.add_tenant_id_if_missing('fuel_inventory');
SELECT public.add_tenant_id_if_missing('alerts');
SELECT public.add_tenant_id_if_missing('fuel_deliveries');
SELECT public.add_tenant_id_if_missing('report_schedules');
SELECT public.add_tenant_id_if_missing('audit_logs');
SELECT public.add_tenant_id_if_missing('user_activity_logs');
SELECT public.add_tenant_id_if_missing('validation_issues');

DROP FUNCTION public.add_tenant_id_if_missing(TEXT);

INSERT INTO public.schema_migrations (version, description)
VALUES ('006', 'Add tenant_id columns to existing tables')
ON CONFLICT (version) DO NOTHING;

COMMIT;
