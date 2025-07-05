import { Router } from 'express';
import { Pool } from 'pg';
import { createAuthController } from '../controllers/auth.controller';

export function createAdminAuthRouter(db: Pool) {
  const router = Router();
  const controller = createAuthController(db);

  router.post('/login', controller.adminLogin);

  return router;
}
