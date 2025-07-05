import { Request, Response } from 'express';
import { Pool } from 'pg';
import { listTenants, createTenant, getTenant, updateTenantStatus, deleteTenant, getTenantMetrics } from '../services/tenant.service';
import { validateTenantInput } from '../validators/tenant.validator';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';

export function createTenantHandlers(db: Pool) {
  return {
    list: async (_req: Request, res: Response) => {
      const tenants = await listTenants(db);
      if (tenants.length === 0) {
        return successResponse(res, []);
      }
      successResponse(res, { tenants });
    },
    create: async (req: Request, res: Response) => {
      try {
        console.log('Tenant creation request:', req.body);
        const { name, planId } = validateTenantInput(req.body);
        console.log('Validated tenant input:', { name, planId });
        
        // Get plan ID from name if needed
        let actualPlanId = planId;
        if (planId === 'basic' || planId === 'pro' || planId === 'premium') {
          const planResult = await db.query('SELECT id FROM public.plans WHERE name ILIKE $1', [`%${planId}%`]);
          if (planResult.rows.length > 0) {
            actualPlanId = planResult.rows[0].id;
            console.log(`Resolved plan ID for ${planId}:`, actualPlanId);
          } else {
            // Fallback to first plan if no match found
            const defaultPlanResult = await db.query('SELECT id FROM public.plans LIMIT 1');
            if (defaultPlanResult.rows.length > 0) {
              actualPlanId = defaultPlanResult.rows[0].id;
              console.log(`Using default plan ID:`, actualPlanId);
            } else {
              throw new Error('No plans found in the system');
            }
          }
        }
        
        const result = await createTenant(db, { name, planId: actualPlanId });
        console.log('Tenant created:', result);
        
        successResponse(res, {
          tenant: {
            id: result.tenant.id,
            name: result.tenant.name,
            status: result.tenant.status
          },
          owner: {
            email: result.owner.email,
            password: result.owner.password,
            name: result.owner.name
          }
        }, undefined, 201);
      } catch (err: any) {
        console.error('Error creating tenant:', err);
        return errorResponse(res, 400, err.message);
      }
    }
  };
}

export function createAdminTenantHandlers(db: Pool) {
  const base = createTenantHandlers(db);
  return {
    ...base,
    summary: async (_req: Request, res: Response) => {
      const tenants = await listTenants(db);
      const results = [] as any[];
      for (const t of tenants) {
        const metrics = await getTenantMetrics(db, t.id);
        results.push({
          tenantId: t.id,
          tenantName: t.name,
          stations: metrics.stations,
          nozzles: metrics.nozzles,
          totalSales: metrics.totalSales,
          reconciliationStatus: `${metrics.reconciliations.finalized}/${metrics.reconciliations.total}`,
        });
      }
      successResponse(res, { tenants: results });
    },
    updateStatus: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!['active', 'suspended', 'cancelled'].includes(status)) {
          return errorResponse(res, 400, 'Invalid status');
        }
        
        await updateTenantStatus(db, id, status);
        const tenant = await getTenant(db, id);
        
        if (!tenant) {
          return errorResponse(res, 404, 'Tenant not found');
        }
        
        successResponse(res, tenant);
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    },
    delete: async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        await deleteTenant(db, id);
        successResponse(res, {}, 'Tenant deleted successfully');
      } catch (err: any) {
        return errorResponse(res, 500, err.message);
      }
    }
  };
}
