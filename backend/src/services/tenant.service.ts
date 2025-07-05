import { Pool } from 'pg';
import { randomUUID } from 'crypto';
import { slugify } from '../utils/slugify';
import { parseRow, parseRows } from '../utils/parseDb';
import { setDefaultSettings } from "./settingsService";

export interface TenantInput {
  name: string;
  planId: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPassword?: string;
}

export interface TenantCreationResult {
  tenant: TenantOutput;
  owner: {
    id: string;
    email: string;
    password: string; // Plain text for initial communication
    name: string;
  };
}

export interface TenantOutput {
  id: string;
  name: string;
  planId: string;
  planName?: string;
  status: string;
  createdAt: Date;
  userCount?: number;
  stationCount?: number;
}

/**
 * Generate secure password based on tenant name and schema
 */
function generatePassword(tenantName: string): string {
  const firstName = tenantName.split(' ')[0].toLowerCase();
  return `${firstName}@tenant123`;
}

/**
 * Create a new tenant with its own schema and owner user
 */
export async function createTenant(db: Pool, input: TenantInput): Promise<TenantCreationResult> {
  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const tenantId = randomUUID();
    const result = await client.query(
      'INSERT INTO public.tenants (id, name, plan_id, status, updated_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id, name, plan_id, status, created_at, updated_at',
      [tenantId, input.name, input.planId, 'active']
    );

    const tenant = result.rows[0];

    const tenantSlug = slugify(input.name);
    const ownerName = input.ownerName || `${input.name} Owner`;
    const ownerEmail =
      input.ownerEmail || `owner@${tenantSlug}.fuelsync.com`;
    const rawPassword = input.ownerPassword || generatePassword(input.name);
    const passwordHash = await import('bcrypt').then(bcrypt => bcrypt.hash(rawPassword, 10));

    const ownerResult = await client.query(
      'INSERT INTO public.users (id, tenant_id, email, password_hash, name, role, updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING id',
      [randomUUID(), tenant.id, ownerEmail, passwordHash, ownerName, 'owner']
    );

    const ownerId = ownerResult.rows[0].id;

    const managerEmail = `manager@${tenantSlug}.fuelsync.com`;
    const managerPassword = generatePassword(`${input.name} Manager`);
    const managerHash = await import('bcrypt').then(bcrypt => bcrypt.hash(managerPassword, 10));

    await client.query(
      'INSERT INTO public.users (id, tenant_id, email, password_hash, name, role, updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW())',
      [randomUUID(), tenant.id, managerEmail, managerHash, `${input.name} Manager`, 'manager']
    );

    const attendantEmail = `attendant@${tenantSlug}.fuelsync.com`;
    const attendantPassword = generatePassword(`${input.name} Attendant`);
    const attendantHash = await import('bcrypt').then(bcrypt => bcrypt.hash(attendantPassword, 10));

    await client.query(
      'INSERT INTO public.users (id, tenant_id, email, password_hash, name, role, updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW())',
      [randomUUID(), tenant.id, attendantEmail, attendantHash, `${input.name} Attendant`, 'attendant']
    );

    await setDefaultSettings(client, tenant.id);

    await client.query('COMMIT');

    return {
      tenant: parseRow({
        id: tenant.id,
        name: tenant.name,
        planId: tenant.plan_id,
        status: tenant.status,
        createdAt: tenant.created_at
      }),
      owner: {
        id: ownerId,
        email: ownerEmail,
        password: rawPassword,
        name: ownerName
      }
    };
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error creating tenant:', error);
    throw error;
  } finally {
    client.release();
  }
  // end createTenant
}

/**
 * List all tenants
 */
export async function listTenants(db: Pool, includeDeleted = false): Promise<TenantOutput[]> {
  const whereClause = includeDeleted ? '' : "WHERE t.status != 'deleted'";
  const result = await db.query(
    `SELECT t.id, t.name, t.plan_id, t.status, t.created_at, p.name as plan_name,
       (SELECT COUNT(*) FROM public.users u WHERE u.tenant_id = t.id) as user_count,
       (SELECT COUNT(*) FROM public.stations s WHERE s.tenant_id = t.id) as station_count
     FROM public.tenants t
     LEFT JOIN public.plans p ON t.plan_id = p.id
     ${whereClause}
     ORDER BY t.created_at DESC`
  );

  return parseRows(
    result.rows.map(row => ({
      id: row.id,
      name: row.name,
      planId: row.plan_id,
      planName: row.plan_name,
      status: row.status,
      createdAt: row.created_at,
      userCount: parseInt(row.user_count),
      stationCount: parseInt(row.station_count)
    }))
  );
}

/**
 * Get tenant by ID with detailed information
 */
export async function getTenant(db: Pool, id: string): Promise<any | null> {
  const result = await db.query(
    `SELECT t.id, t.name, t.plan_id, t.status, t.created_at, p.name as plan_name
     FROM public.tenants t
     LEFT JOIN public.plans p ON t.plan_id = p.id
     WHERE t.id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const row = parseRow(result.rows[0]);
  
  // Get users
  const usersResult = await db.query(
    `SELECT id, email, name, role, created_at FROM public.users WHERE tenant_id=$1 ORDER BY
     CASE role WHEN 'owner' THEN 1 WHEN 'manager' THEN 2 WHEN 'attendant' THEN 3 END`,
    [id]
  );
  
  // Get stations with hierarchy
  const stationsResult = await db.query(
    `SELECT s.id, s.name, s.address, s.status,
     (SELECT COUNT(*) FROM public.pumps p WHERE p.station_id = s.id) as pump_count
     FROM public.stations s WHERE s.tenant_id = $1 ORDER BY s.name`,
    [id]
  );
  
  const stations = [] as any[];
  for (const station of parseRows(stationsResult.rows)) {
    const pumpsResult = await db.query(
      `SELECT p.id, p.name, p.serial_number, p.status,
       (SELECT COUNT(*) FROM public.nozzles n WHERE n.pump_id = p.id) as nozzle_count
       FROM public.pumps p WHERE p.station_id = $1 ORDER BY p.name`,
      [station.id]
    );

    const pumps = [];
    for (const pump of parseRows(pumpsResult.rows)) {
      const nozzlesResult = await db.query(
        `SELECT id, nozzle_number, fuel_type, status FROM public.nozzles
         WHERE pump_id = $1 ORDER BY nozzle_number`,
        [pump.id]
      );

      pumps.push({
        ...pump,
        nozzles: parseRows(nozzlesResult.rows)
      });
    }

    stations.push({
      ...station,
      pumps
    });
  }
  
  return {
    id: row.id,
    name: row.name,
    planId: row.plan_id,
    planName: row.plan_name,
    status: row.status,
    createdAt: row.created_at,
    users: parseRows(usersResult.rows),
    stations,
    userCount: usersResult.rows.length,
    stationCount: stations.length
  };
}

/**
 * Create additional user for existing tenant
 */
export async function createTenantUser(db: Pool, tenantId: string, userData: {
  name: string;
  email: string;
  role: 'owner' | 'manager' | 'attendant';
  password?: string;
}): Promise<{ id: string; email: string; password: string }> {
  const tenantResult = await db.query(
    'SELECT name FROM public.tenants WHERE id = $1',
    [tenantId]
  );

  if (tenantResult.rows.length === 0) {
    throw new Error('Tenant not found');
  }

  const { name: tenantName } = tenantResult.rows[0];

  const rawPassword = userData.password || generatePassword(userData.name);
  const passwordHash = await import('bcrypt').then(bcrypt => bcrypt.hash(rawPassword, 10));

  const userResult = await db.query(
    'INSERT INTO public.users (id, tenant_id, email, password_hash, name, role, updated_at) VALUES ($1,$2,$3,$4,$5,$6,NOW()) RETURNING id',
    [randomUUID(), tenantId, userData.email, passwordHash, userData.name, userData.role]
  );
  
  return {
    id: userResult.rows[0].id,
    email: userData.email,
    password: rawPassword
  };
}

/**
 * Update tenant status
 */
export async function updateTenantStatus(db: Pool, id: string, status: string): Promise<void> {
  await db.query(
    'UPDATE public.tenants SET status = $1 WHERE id = $2',
    [status, id]
  );
}

/**
 * Soft delete tenant (set status to 'deleted' instead of destroying data)
 */
export async function deleteTenant(db: Pool, id: string): Promise<void> {
  // Soft delete - just mark as deleted instead of destroying all data
  await db.query(
    'UPDATE public.tenants SET status = $1, deleted_at = NOW() WHERE id = $2',
    ['deleted', id]
  );
}

/**
 * DANGEROUS: Permanently delete tenant and all data (admin only)
 * This should only be used in extreme cases with explicit confirmation
 */
export async function permanentlyDeleteTenant(db: Pool, id: string): Promise<void> {
  await db.query('DELETE FROM public.tenants WHERE id = $1', [id]);
}

export async function getTenantMetrics(db: Pool, tenantId: string) {
  const stationRes = await db.query('SELECT COUNT(*) FROM public.stations WHERE tenant_id = $1', [tenantId]);
  const nozzleRes = await db.query('SELECT COUNT(*) FROM public.nozzles WHERE tenant_id = $1', [tenantId]);
  const salesRes = await db.query('SELECT COALESCE(SUM(amount),0) as sales FROM public.sales WHERE tenant_id = $1', [tenantId]);
  const reconRes = await db.query(
    `SELECT COUNT(*) FILTER (WHERE finalized) as finalized, COUNT(*) as total
       FROM public.day_reconciliations WHERE tenant_id = $1`,
    [tenantId]
  );
  return {
    stations: parseInt(stationRes.rows[0].count),
    nozzles: parseInt(nozzleRes.rows[0].count),
    totalSales: parseFloat(salesRes.rows[0].sales),
    reconciliations: {
      finalized: parseInt(reconRes.rows[0].finalized),
      total: parseInt(reconRes.rows[0].total),
    },
  };
}

