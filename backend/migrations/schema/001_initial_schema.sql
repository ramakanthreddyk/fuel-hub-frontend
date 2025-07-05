-- Migration: 001_initial_schema
-- Description: Initial database schema for FuelSync Hub
-- Version: 1.0.0
-- Dependencies: None

-- =====================================================
-- PUBLIC SCHEMA (Platform Tables)
-- =====================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Migration tracking
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  id SERIAL PRIMARY KEY,
  version VARCHAR(50) NOT NULL UNIQUE,
  description TEXT NOT NULL,
  executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rollback_sql TEXT
);

-- Subscription plans
CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  max_stations INTEGER NOT NULL DEFAULT 5,
  max_pumps_per_station INTEGER NOT NULL DEFAULT 10,
  max_nozzles_per_pump INTEGER NOT NULL DEFAULT 4,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  features JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Tenant organizations
CREATE TABLE IF NOT EXISTS public.tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  schema_name TEXT NOT NULL UNIQUE,
  plan_id UUID REFERENCES public.plans(id),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- SuperAdmin users
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'superadmin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Record migration
INSERT INTO public.schema_migrations (version, description) 
VALUES ('001', 'Initial database schema for FuelSync Hub')
ON CONFLICT (version) DO NOTHING;