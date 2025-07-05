import { Pool } from 'pg';
import { SettingsInput } from '../validators/settings.validator';
import { parseRow } from '../utils/parseDb';

export async function getTenantSettings(db: Pool, tenantId: string) {
  const res = await db.query(
    'SELECT receipt_template, fuel_rounding, branding_logo_url FROM public.tenant_settings WHERE tenant_id = $1',
    [tenantId]
  );
  return parseRow(res.rows[0] || {});
}

export async function upsertTenantSettings(db: Pool, tenantId: string, input: SettingsInput) {
  await db.query(
    `INSERT INTO public.tenant_settings (tenant_id, receipt_template, fuel_rounding, branding_logo_url)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (tenant_id) DO UPDATE SET
      receipt_template = COALESCE(EXCLUDED.receipt_template, public.tenant_settings.receipt_template),
      fuel_rounding = COALESCE(EXCLUDED.fuel_rounding, public.tenant_settings.fuel_rounding),
      branding_logo_url = COALESCE(EXCLUDED.branding_logo_url, public.tenant_settings.branding_logo_url),
      updated_at = NOW()`,
    [tenantId, input.receiptTemplate || null, input.fuelRounding ?? null, input.brandingLogoUrl || null]
  );
}
