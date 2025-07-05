import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { parseRow, parseRows } from '../utils/parseDb';

export interface AdminUserInput {
  email: string;
  name?: string;
  password?: string;
  role?: string;
}

export interface AdminUserOutput {
  id: string;
  email: string;
  name?: string;
  role: string;
  createdAt: Date;
}

/**
 * Create a new admin user
 */
export async function createAdminUser(db: Pool, input: AdminUserInput): Promise<AdminUserOutput> {
  // Check if email already exists
  const existingUser = await db.query(
    'SELECT id FROM public.admin_users WHERE email = $1',
    [input.email]
  );
  
  if (existingUser.rows.length > 0) {
    throw new Error('Email already in use');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(input.password || 'Admin@123', 10);
  
  const result = await db.query(
    'INSERT INTO public.admin_users (id, email, name, password_hash, role, updated_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id, email, name, role, created_at',
    [randomUUID(), input.email, input.name || input.email.split('@')[0], passwordHash, input.role || 'superadmin']
  );
  
  return parseRow(result.rows[0]);
}

/**
 * List all admin users
 */
export async function listAdminUsers(db: Pool): Promise<AdminUserOutput[]> {
  const result = await db.query(
    'SELECT id, email, name, role, created_at FROM public.admin_users ORDER BY created_at DESC'
  );
  
  return parseRows(result.rows);
}

/**
 * Get admin user by ID
 */
export async function getAdminUser(db: Pool, id: string): Promise<AdminUserOutput | null> {
  const result = await db.query(
    'SELECT id, email, name, role, created_at FROM public.admin_users WHERE id = $1',
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  return parseRow(result.rows[0]);
}

/**
 * Update admin user
 */
export async function updateAdminUser(db: Pool, id: string, input: AdminUserInput): Promise<AdminUserOutput> {
  let query = 'UPDATE public.admin_users SET ';
  const params: any[] = [];
  const updates: string[] = [];
  
  if (input.email) {
    params.push(input.email);
    updates.push(`email = $${params.length}`);
  }
  
  if (input.name) {
    params.push(input.name);
    updates.push(`name = $${params.length}`);
  }
  
  if (input.password) {
    const passwordHash = await bcrypt.hash(input.password, 10);
    params.push(passwordHash);
    updates.push(`password_hash = $${params.length}`);
  }
  
  if (input.role) {
    params.push(input.role);
    updates.push(`role = $${params.length}`);
  }
  
  if (updates.length === 0) {
    throw new Error('No updates provided');
  }
  
  params.push(id);
  query += updates.join(', ') + ` WHERE id = $${params.length} RETURNING id, email, name, role, created_at`;
  
  const result = await db.query(query, params);
  
  if (result.rows.length === 0) {
    throw new Error('Admin user not found');
  }
  
  return parseRow(result.rows[0]);
}

/**
 * Delete admin user
 */
export async function deleteAdminUser(db: Pool, id: string): Promise<void> {
  // Check if this is the last admin user
  const countResult = await db.query('SELECT COUNT(*) FROM public.admin_users');
  if (parseInt(countResult.rows[0].count) <= 1) {
    throw new Error('Cannot delete the last admin user');
  }
  
  await db.query('DELETE FROM public.admin_users WHERE id = $1', [id]);
}

/**
 * Reset admin user password
 */
export async function resetAdminPassword(db: Pool, id: string, newPassword: string): Promise<void> {
  const passwordHash = await bcrypt.hash(newPassword, 10);
  
  const result = await db.query(
    'UPDATE public.admin_users SET password_hash = $1 WHERE id = $2',
    [passwordHash, id]
  );
  
  if (result.rowCount === 0) {
    throw new Error('Admin user not found');
  }
}