import { Pool, PoolClient } from 'pg';

export interface Setting {
  key: string;
  value: string;
  updatedAt: string;
}

export async function getAllSettings(db: Pool, tenantId: string): Promise<Setting[]> {
  const res = await db.query(
    'SELECT key, value, updated_at FROM public.tenant_settings_kv WHERE tenant_id = $1 ORDER BY key',
    [tenantId]
  );
  return res.rows.map(r => ({ key: r.key, value: r.value, updatedAt: r.updated_at }));
}

export async function getSetting(db: Pool, tenantId: string, key: string): Promise<Setting | null> {
  const res = await db.query(
    'SELECT key, value, updated_at FROM public.tenant_settings_kv WHERE tenant_id = $1 AND key = $2',
    [tenantId, key]
  );
  if (res.rows.length === 0) return null;
  const row = res.rows[0];
  return { key: row.key, value: row.value, updatedAt: row.updated_at };
}

export async function updateSetting(db: Pool, tenantId: string, key: string, value: string): Promise<void> {
  await db.query(
    `INSERT INTO public.tenant_settings_kv (tenant_id, key, value)
     VALUES ($1, $2, $3)
     ON CONFLICT (tenant_id, key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()`,
    [tenantId, key, value]
  );
}

export async function setDefaultSettings(client: Pool | PoolClient, tenantId: string): Promise<void> {
  const defaults = [
    { key: 'branding.theme_color', value: '#FF9900' },
    { key: 'fuel.low_stock_threshold', value: '1000' },
    { key: 'alerts.enabled', value: 'true' },
    { key: 'features.auto_sales_generation', value: 'true' },
    { key: 'features.allow_export', value: 'true' }
  ];

  for (const row of defaults) {
    await client.query(
      `INSERT INTO public.tenant_settings_kv (tenant_id, key, value)
       VALUES ($1, $2, $3)
       ON CONFLICT (tenant_id, key) DO NOTHING`,
      [tenantId, row.key, row.value]
    );
  }
}
