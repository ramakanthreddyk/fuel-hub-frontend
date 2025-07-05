import { Request, Response } from 'express';
import { Pool } from 'pg';
import { ServiceError } from '../errors/ServiceError';
import prisma from '../utils/prisma';

// Handles creditor CRUD endpoints for the frontend
import {
  createCreditor,
  listCreditors,
  updateCreditor,
  markCreditorInactive,
  createCreditPayment,
  listCreditPayments,
} from '../services/creditor.service';
import {
  validateCreateCreditor,
  validateUpdateCreditor,
  validateCreatePayment,
  parsePaymentQuery,
} from '../validators/creditor.validator';
import { errorResponse } from '../utils/errorResponse';
import { successResponse } from '../utils/successResponse';

export function createCreditorHandlers(db: Pool) {
  return {
    create: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateCreateCreditor(req.body);
        const id = await createCreditor(db, tenantId, data);
        successResponse(res, { id }, undefined, 201);
      } catch (err: any) {
        if (err instanceof ServiceError) {
          return errorResponse(res, err.code, err.message);
        }
        return errorResponse(res, 400, err.message);
      }
    },
    list: async (req: Request, res: Response) => {
      const tenantId = req.user?.tenantId;
      if (!tenantId) {
        return errorResponse(res, 400, 'Missing tenant context');
      }
      const creditors = await listCreditors(db, tenantId);
      if (creditors.length === 0) {
        return successResponse(res, []);
      }
      successResponse(res, { creditors });
    },

    get: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const creditor = await prisma.creditor.findFirst({
          where: { id: req.params.id, tenant_id: tenantId }
        });
        if (!creditor) return errorResponse(res, 404, 'Creditor not found');
        successResponse(res, {
          id: creditor.id,
          name: creditor.party_name,
          partyName: creditor.party_name,
          contactNumber: creditor.contact_number,
          address: creditor.address,
          status: creditor.status,
          creditLimit: Number(creditor.credit_limit),
          createdAt: creditor.created_at
        });
      } catch (err: any) {
        if (err instanceof ServiceError) {
          return errorResponse(res, err.code, err.message);
        }
        return errorResponse(res, 400, err.message);
      }
    },
    update: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateUpdateCreditor(req.body);
        await updateCreditor(db, tenantId, req.params.id, data);
        successResponse(res, { status: 'ok' });
      } catch (err: any) {
        if (err instanceof ServiceError) {
          return errorResponse(res, err.code, err.message);
        }
        return errorResponse(res, 400, err.message);
      }
    },
    remove: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        await markCreditorInactive(db, tenantId, req.params.id);
        successResponse(res, { status: 'ok' });
      } catch (err: any) {
        if (err instanceof ServiceError) {
          return errorResponse(res, err.code, err.message);
        }
        return errorResponse(res, 400, err.message);
      }
    },
    createPayment: async (req: Request, res: Response) => {
      try {
        const user = req.user;
        if (!user?.tenantId || !user.userId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const data = validateCreatePayment(req.body);
        const id = await createCreditPayment(db, user.tenantId, data, user.userId);
        successResponse(res, { id }, undefined, 201);
      } catch (err: any) {
        if (err instanceof ServiceError) {
          return errorResponse(res, err.code, err.message);
        }
        return errorResponse(res, 400, err.message);
      }
    },
    listPayments: async (req: Request, res: Response) => {
      try {
        const tenantId = req.user?.tenantId;
        if (!tenantId) {
          return errorResponse(res, 400, 'Missing tenant context');
        }
        const query = parsePaymentQuery(req.query);
        const payments = await listCreditPayments(db, tenantId, query);
        if (payments.length === 0) {
          return successResponse(res, []);
        }
        successResponse(res, { payments });
      } catch (err: any) {
        if (err instanceof ServiceError) {
          return errorResponse(res, err.code, err.message);
        }
        return errorResponse(res, 400, err.message);
      }
    },
  }
}
