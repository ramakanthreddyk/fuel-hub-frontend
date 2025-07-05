import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import { UserRole } from '../constants/auth';
import { parseRows } from '../utils/parseDb';

export async function createAdminUser(
  db: Pool,
  email: string,
  password: string,
  role: UserRole = UserRole.SuperAdmin
): Promise<void> {
  const hash = await bcrypt.hash(password, 10);
  await db.query(
    'INSERT INTO public.admin_users (id, email, password_hash, role, updated_at) VALUES ($1, $2, $3, $4, NOW())',
    [randomUUID(), email, hash, role]
  );
}

export async function listAdminUsers(db: Pool) {
  const res = await db.query(
    'SELECT id, email, role, created_at FROM public.admin_users ORDER BY email'
  );
  return parseRows(res.rows);
}
