import { pool } from './db-utils';
import bcrypt from 'bcrypt';

export async function createTenant(name = 'test_tenant') {
  const { rows } = await pool.query<{ id: string }>(
    `SELECT id FROM public.plans LIMIT 1`
  );
  const planId = rows[0].id;
  const { rows: inserted } = await pool.query<{ id: string }>(
    `INSERT INTO public.tenants (name, plan_id, status)
     VALUES ($1, $2, 'active')
     RETURNING id`,
    [name, planId]
  );
  return inserted[0].id;
}

export async function createUser(
  tenantId: string,
  role: string = 'manager'
) {
  const hash = await bcrypt.hash('password', 1);
  const { rows } = await pool.query<{ id: string }>(
    `INSERT INTO public.users (tenant_id, email, password_hash, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [tenantId, `${role}@tenant.com`, hash, role]
  );
  return rows[0].id;
}
