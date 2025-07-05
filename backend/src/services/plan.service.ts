import { Pool } from 'pg';
import { randomUUID } from 'crypto';

export interface PlanInput {
  name: string;
  maxStations?: number;
  maxPumpsPerStation?: number;
  maxNozzlesPerPump?: number;
  priceMonthly?: number;
  priceYearly?: number;
  features?: string[];
}

export interface PlanOutput {
  id: string;
  name: string;
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  priceMonthly: number;
  priceYearly: number;
  features: string[];
  createdAt: Date;
}

/**
 * Create a new subscription plan
 */
export async function createPlan(db: Pool, input: PlanInput): Promise<PlanOutput> {
  const result = await db.query(
    `INSERT INTO public.plans
     (id, name, max_stations, max_pumps_per_station, max_nozzles_per_pump, price_monthly, price_yearly, features, updated_at)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING id, name, max_stations, max_pumps_per_station, max_nozzles_per_pump, price_monthly, price_yearly, features, created_at`,
    [
      randomUUID(),
      input.name,
      input.maxStations || 5,
      input.maxPumpsPerStation || 10,
      input.maxNozzlesPerPump || 4,
      input.priceMonthly || 0,
      input.priceYearly || 0,
      JSON.stringify(input.features || [])
    ]
  );
  
  const plan = result.rows[0];
  return {
    id: plan.id,
    name: plan.name,
    maxStations: plan.max_stations,
    maxPumpsPerStation: plan.max_pumps_per_station,
    maxNozzlesPerPump: plan.max_nozzles_per_pump,
    priceMonthly: parseFloat(plan.price_monthly),
    priceYearly: parseFloat(plan.price_yearly),
    features: plan.features,
    createdAt: plan.created_at
  };
}

/**
 * List all subscription plans
 */
export async function listPlans(db: Pool): Promise<PlanOutput[]> {
  const result = await db.query(
    `SELECT id, name, max_stations, max_pumps_per_station, max_nozzles_per_pump, price_monthly, price_yearly, features, created_at
     FROM public.plans
     ORDER BY created_at DESC`
  );

  return result.rows.map(plan => ({
    id: plan.id,
    name: plan.name,
    maxStations: plan.max_stations,
    maxPumpsPerStation: plan.max_pumps_per_station,
    maxNozzlesPerPump: plan.max_nozzles_per_pump,
    priceMonthly: parseFloat(plan.price_monthly),
    priceYearly: parseFloat(plan.price_yearly),
    features: plan.features,
    createdAt: plan.created_at
  }));
}

/**
 * Get plan by ID
 */
export async function getPlan(db: Pool, id: string): Promise<PlanOutput | null> {
  const result = await db.query(
    `SELECT id, name, max_stations, max_pumps_per_station, max_nozzles_per_pump, price_monthly, price_yearly, features, created_at
     FROM public.plans
     WHERE id = $1`,
    [id]
  );
  
  if (result.rows.length === 0) {
    return null;
  }
  
  const plan = result.rows[0];
  return {
    id: plan.id,
    name: plan.name,
    maxStations: plan.max_stations,
    maxPumpsPerStation: plan.max_pumps_per_station,
    maxNozzlesPerPump: plan.max_nozzles_per_pump,
    priceMonthly: parseFloat(plan.price_monthly),
    priceYearly: parseFloat(plan.price_yearly),
    features: plan.features,
    createdAt: plan.created_at
  };
}

/**
 * Update plan
 */
export async function updatePlan(db: Pool, id: string, input: PlanInput): Promise<PlanOutput> {
  const result = await db.query(
    `UPDATE public.plans
     SET name = COALESCE($1, name),
         max_stations = COALESCE($2, max_stations),
         max_pumps_per_station = COALESCE($3, max_pumps_per_station),
         max_nozzles_per_pump = COALESCE($4, max_nozzles_per_pump),
         price_monthly = COALESCE($5, price_monthly),
         price_yearly = COALESCE($6, price_yearly),
         features = COALESCE($7, features)
     WHERE id = $8
     RETURNING id, name, max_stations, max_pumps_per_station, max_nozzles_per_pump, price_monthly, price_yearly, features, created_at`,
    [
      input.name,
      input.maxStations,
      input.maxPumpsPerStation,
      input.maxNozzlesPerPump,
      input.priceMonthly,
      input.priceYearly,
      input.features ? JSON.stringify(input.features) : null,
      id
    ]
  );
  
  if (result.rows.length === 0) {
    throw new Error('Plan not found');
  }
  
  const plan = result.rows[0];
  return {
    id: plan.id,
    name: plan.name,
    maxStations: plan.max_stations,
    maxPumpsPerStation: plan.max_pumps_per_station,
    maxNozzlesPerPump: plan.max_nozzles_per_pump,
    priceMonthly: parseFloat(plan.price_monthly),
    priceYearly: parseFloat(plan.price_yearly),
    features: plan.features,
    createdAt: plan.created_at
  };
}

/**
 * Delete plan
 */
export async function deletePlan(db: Pool, id: string): Promise<void> {
  // Check if plan is in use
  const tenantResult = await db.query(
    'SELECT COUNT(*) FROM public.tenants WHERE plan_id = $1',
    [id]
  );
  
  if (parseInt(tenantResult.rows[0].count) > 0) {
    throw new Error('Cannot delete plan that is in use by tenants');
  }
  
  await db.query('DELETE FROM public.plans WHERE id = $1', [id]);
}