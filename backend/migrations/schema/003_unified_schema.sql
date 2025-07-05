-- Migration: 003_unified_schema
-- Description: Consolidate all tenant tables into public schema with tenant_id columns
-- Version: 1.0.0
-- Dependencies: 001_initial_schema

-- =========================================
-- WARNING: This migration DROPS ALL schemas except "public".
-- Ensure no production data exists before running.
-- =========================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
BEGIN;

-- Apply consolidated alterations
ALTER TABLE public.plans
  ADD COLUMN IF NOT EXISTS price_yearly DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE public.tenants
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_status_deleted_at ON public.tenants(status, deleted_at);
ALTER TABLE public.admin_users
  ADD COLUMN IF NOT EXISTS name TEXT;
UPDATE public.admin_users SET name = SPLIT_PART(email, '@', 1) WHERE name IS NULL;
-- Ensure migration and admin tables exist in case previous migrations were not executed
CREATE TABLE IF NOT EXISTS public.schema_migrations (
    id SERIAL PRIMARY KEY,
    version VARCHAR(50) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    rollback_sql TEXT
);

CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'superadmin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.admin_users IS 'Super admin accounts';
CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_user_id UUID REFERENCES public.admin_users(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    target_type TEXT,
    target_id UUID,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.admin_activity_logs IS 'Logs actions performed by super admins';

-- Drop all schemas except public, pg_catalog and information_schema
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT nspname FROM pg_namespace
        WHERE nspname NOT IN ('public', 'pg_catalog', 'information_schema', 'pg_toast')
    LOOP
        EXECUTE format('DROP SCHEMA IF EXISTS %I CASCADE;', r.nspname);
    END LOOP;
END$$;

-- PUBLIC TENANT TABLES
CREATE TABLE IF NOT EXISTS public.tenant_settings (
    tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
    receipt_template TEXT,
    fuel_rounding TEXT,
    branding_logo_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.tenant_settings IS 'Per-tenant preference settings';


CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    email TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner','manager','attendant')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, email)
);
COMMENT ON TABLE public.users IS 'Tenant specific user accounts';
CREATE INDEX IF NOT EXISTS idx_users_tenant ON public.users(tenant_id);

CREATE TABLE IF NOT EXISTS public.stations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    name TEXT NOT NULL,
    address TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, name)
);
COMMENT ON TABLE public.stations IS 'Fuel stations belonging to a tenant';
CREATE INDEX IF NOT EXISTS idx_stations_tenant ON public.stations(tenant_id);

CREATE TABLE IF NOT EXISTS public.user_stations (
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    station_id UUID REFERENCES public.stations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, station_id)
);
CREATE INDEX IF NOT EXISTS idx_user_stations_user ON public.user_stations(user_id);
COMMENT ON TABLE public.user_stations IS 'Mapping of users to stations they can access';

CREATE TABLE IF NOT EXISTS public.pumps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    serial_number VARCHAR(100),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, station_id, label)
);
CREATE INDEX IF NOT EXISTS idx_pumps_tenant ON public.pumps(tenant_id);
CREATE INDEX IF NOT EXISTS idx_pumps_station_id ON public.pumps(station_id);

COMMENT ON TABLE public.pumps IS 'Fuel pumps within a station';
CREATE TABLE IF NOT EXISTS public.nozzles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    pump_id UUID NOT NULL REFERENCES public.pumps(id) ON DELETE CASCADE,
    nozzle_number INTEGER NOT NULL,
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol','diesel','premium')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','maintenance')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, pump_id, nozzle_number)
);
CREATE INDEX IF NOT EXISTS idx_nozzles_tenant ON public.nozzles(tenant_id);

COMMENT ON TABLE public.nozzles IS 'Pump nozzles dispensing fuel';

CREATE TABLE IF NOT EXISTS public.nozzle_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    nozzle_id UUID NOT NULL REFERENCES public.nozzles(id),
    reading DECIMAL(10,2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL,
    payment_method TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_nozzle_readings_tenant ON public.nozzle_readings(tenant_id);
COMMENT ON TABLE public.nozzle_readings IS 'Cumulative nozzle meter readings';
CREATE TABLE IF NOT EXISTS public.fuel_prices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID NOT NULL REFERENCES public.stations(id) ON DELETE CASCADE,
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol','diesel','premium')),
    price DECIMAL(10,2) NOT NULL CHECK (price > 0),
    cost_price DECIMAL(10,2) DEFAULT 0,
    valid_from TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    effective_to TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_fuel_prices_tenant ON public.fuel_prices(tenant_id);
COMMENT ON TABLE public.fuel_prices IS 'Historical fuel pricing per station';

CREATE INDEX IF NOT EXISTS idx_fuel_prices_station_id ON public.fuel_prices(station_id);
CREATE TABLE IF NOT EXISTS public.creditors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID REFERENCES public.stations(id),
    party_name TEXT NOT NULL,
    contact_number TEXT,
    address TEXT,
    credit_limit DECIMAL(10,2) DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_creditors_tenant ON public.creditors(tenant_id);
COMMENT ON TABLE public.creditors IS 'Credit customers for credit sales';

CREATE TABLE IF NOT EXISTS public.sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    nozzle_id UUID NOT NULL REFERENCES public.nozzles(id),
    reading_id UUID REFERENCES public.nozzle_readings(id),
    station_id UUID NOT NULL REFERENCES public.stations(id),
    volume DECIMAL(10,3) NOT NULL CHECK (volume >= 0),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol','diesel','premium')),
    fuel_price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2) DEFAULT 0,
    amount DECIMAL(10,2) NOT NULL,
    profit DECIMAL(10,2) DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cash','card','upi','credit')),
    creditor_id UUID REFERENCES public.creditors(id),
    created_by UUID REFERENCES public.users(id),
    status TEXT NOT NULL DEFAULT 'posted' CHECK (status IN ('draft','posted')),
    recorded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.sales IS 'Sales transactions derived from nozzle readings';
CREATE INDEX IF NOT EXISTS idx_sales_tenant ON public.sales(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sales_nozzle_id ON public.sales(nozzle_id);
CREATE INDEX IF NOT EXISTS idx_sales_created_at ON public.sales(created_at);

CREATE TABLE IF NOT EXISTS public.fuel_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID NOT NULL REFERENCES public.stations(id),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol','diesel','premium')),
    current_stock DECIMAL(10,3) NOT NULL DEFAULT 0,
    minimum_level DECIMAL(10,3) NOT NULL DEFAULT 1000,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.fuel_inventory IS 'Tracks current fuel stock levels per tenant station';
CREATE INDEX IF NOT EXISTS idx_fuel_inventory_tenant ON public.fuel_inventory(tenant_id);

CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID REFERENCES public.stations(id),
    alert_type TEXT NOT NULL,
    message TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.alerts IS 'System alerts and notifications for tenants';
CREATE INDEX IF NOT EXISTS idx_alerts_tenant ON public.alerts(tenant_id);

CREATE TABLE IF NOT EXISTS public.fuel_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID NOT NULL REFERENCES public.stations(id),
    fuel_type TEXT NOT NULL CHECK (fuel_type IN ('petrol','diesel','premium')),
    volume DECIMAL(10,3) NOT NULL CHECK (volume > 0),
    delivered_by TEXT,
    delivery_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.fuel_deliveries IS 'Logs fuel deliveries to stations';
CREATE INDEX IF NOT EXISTS idx_fuel_deliveries_tenant ON public.fuel_deliveries(tenant_id);


CREATE TABLE IF NOT EXISTS public.credit_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    creditor_id UUID NOT NULL REFERENCES public.creditors(id),
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    payment_method TEXT CHECK (payment_method IN ('cash','card','upi','credit')),
    reference_number TEXT,
    notes TEXT,
    received_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_credit_payments_tenant ON public.credit_payments(tenant_id);
CREATE INDEX IF NOT EXISTS idx_credit_payments_creditor_id ON public.credit_payments(creditor_id);
COMMENT ON TABLE public.credit_payments IS 'Payments received for creditor balances';

CREATE TABLE IF NOT EXISTS public.day_reconciliations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID NOT NULL REFERENCES public.stations(id),
    date DATE NOT NULL,
    total_sales DECIMAL(10,2) DEFAULT 0,
    cash_total DECIMAL(10,2) DEFAULT 0,
    card_total DECIMAL(10,2) DEFAULT 0,
    upi_total DECIMAL(10,2) DEFAULT 0,
    credit_total DECIMAL(10,2) DEFAULT 0,
    finalized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (tenant_id, station_id, date)
);
CREATE INDEX IF NOT EXISTS idx_day_reconciliations_tenant ON public.day_reconciliations(tenant_id);
COMMENT ON TABLE public.day_reconciliations IS 'Daily station reconciliation totals';

CREATE TABLE IF NOT EXISTS public.report_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    station_id UUID REFERENCES public.stations(id),
    type TEXT NOT NULL,
    frequency TEXT NOT NULL,
    next_run TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_report_schedules_tenant ON public.report_schedules(tenant_id);
COMMENT ON TABLE public.report_schedules IS 'Scheduled report configuration';

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id),
    user_id UUID NOT NULL REFERENCES public.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.audit_logs IS 'Tracks changes made by tenant users';
CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant ON public.audit_logs(tenant_id);

CREATE TABLE IF NOT EXISTS public.user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    user_id UUID REFERENCES public.users(id),
    ip_address TEXT,
    user_agent TEXT,
    event TEXT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.user_activity_logs IS 'Records login and activity events';
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_tenant ON public.user_activity_logs(tenant_id);

CREATE TABLE IF NOT EXISTS public.validation_issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.validation_issues IS 'Records data validation errors for later review';
CREATE INDEX IF NOT EXISTS idx_validation_issues_tenant ON public.validation_issues(tenant_id);

-- Seed single super admin
INSERT INTO public.admin_users
  (id, email, password_hash, role, created_at, updated_at)
VALUES
  (gen_random_uuid(),
   'admin@example.com',
   '$2b$10$replace_with_hash',
   'superadmin',
   NOW(),
   NOW())
ON CONFLICT (email) DO NOTHING;

-- Record migration
INSERT INTO public.schema_migrations (version, description)
VALUES ('003', 'Consolidate tables into public schema')
ON CONFLICT (version) DO NOTHING;

COMMIT;
