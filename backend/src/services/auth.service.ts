import { Pool } from 'pg';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt';
import { AuthPayload } from '../types/auth';
import { UserRole } from '../constants/auth';

interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    tenantId?: string;
    tenantName?: string;
  };
}

export async function login(db: Pool, email: string, password: string, tenantId?: string): Promise<LoginResponse | null> {
  if (tenantId) {
    console.log(`[AUTH-SERVICE] Tenant login attempt for email: ${email}, tenant: ${tenantId}`);

    // Get tenant id and name
    const tenantRes = await db.query(
      'SELECT id, name FROM public.tenants WHERE id = $1',
      [tenantId]
    );
    const tenantRow = tenantRes.rows[0];

    if (!tenantRow) {
      console.log(`[AUTH-SERVICE] Tenant not found for schema: ${tenantId}`);
      return null;
    }
    const tenantUuid = tenantRow.id;
    const tenantName = tenantRow.name;

    // Get user details
    const res = await db.query(
      `SELECT id, email, password_hash, role FROM public.users WHERE tenant_id = $1 AND email = $2`,
      [tenantUuid, email]
    );
    const user = res.rows[0];
    if (!user) {
      console.log(`[AUTH-SERVICE] User not found: ${email} in tenant: ${tenantId}`);
      return null;
    }
    
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) {
      console.log(`[AUTH-SERVICE] Password mismatch for user: ${email}`);
      return null;
    }
    
    const payload: AuthPayload = { userId: user.id, tenantId, role: user.role as UserRole };
    const token = generateToken(payload);
    
    console.log(`[AUTH-SERVICE] Tenant login successful for user: ${user.id}, role: ${user.role}`);
    
    return {
      token,
      user: {
        id: user.id,
        name: email.split('@')[0], // Use part of email as name if not available
        email: user.email,
        role: user.role as UserRole,
        tenantId,
        tenantName: tenantName || undefined
      }
    };
  }

  // SuperAdmin login
  console.log(`[AUTH-SERVICE] SuperAdmin login attempt for email: ${email}`);
  
  const res = await db.query(
    'SELECT id, email, password_hash, role FROM public.admin_users WHERE email = $1',
    [email]
  );
  const user = res.rows[0];
  if (!user) {
    console.log(`[AUTH-SERVICE] Admin user not found: ${email}`);
    return null;
  }
  
  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    console.log(`[AUTH-SERVICE] Password mismatch for admin user: ${email}`);
    return null;
  }
  
  const payload: AuthPayload = { userId: user.id, role: user.role as UserRole, tenantId: null };
  const token = generateToken(payload);
  
  console.log(`[AUTH-SERVICE] SuperAdmin login successful for user: ${user.id}`);
  
  return {
    token,
    user: {
      id: user.id,
      name: email.split('@')[0], // Use part of email as name if not available
      email: user.email,
      role: user.role as UserRole,
      tenantName: undefined
    }
  };
}

export async function loginSuperAdmin(db: Pool, email: string, password: string): Promise<LoginResponse | null> {
  console.log(`[AUTH-SERVICE] SuperAdmin login attempt for email: ${email}`);

  const res = await db.query(
    'SELECT id, email, password_hash, role FROM public.admin_users WHERE email = $1',
    [email]
  );
  const user = res.rows[0];
  if (!user) {
    console.log(`[AUTH-SERVICE] Admin user not found: ${email}`);
    return null;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    console.log(`[AUTH-SERVICE] Password mismatch for admin user: ${email}`);
    return null;
  }

  const payload: AuthPayload = { userId: user.id, role: user.role as UserRole, tenantId: null };
  const token = generateToken(payload);

  console.log(`[AUTH-SERVICE] SuperAdmin login successful for user: ${user.id}`);

  return {
    token,
    user: {
      id: user.id,
      name: email.split('@')[0],
      email: user.email,
      role: user.role as UserRole,
      tenantName: undefined
    }
  };
}
