import { Router } from 'express';
import { Pool } from 'pg';
import { authenticateJWT } from '../middlewares/authenticateJWT';
import { requireRole } from '../middlewares/requireRole';
import { UserRole } from '../constants/auth';
import { createUserHandlers } from '../controllers/user.controller';

export function createUserRouter(db: Pool) {
  const router = Router();
  const handlers = createUserHandlers(db);
  
  // Middleware to ensure proper roles
  const requireOwnerOrManager = requireRole([UserRole.Owner, UserRole.Manager]);
  const requireOwner = requireRole([UserRole.Owner]);
  
  // List users
  router.get('/', authenticateJWT, requireOwnerOrManager, handlers.list);
  
  // Get user by ID
  router.get('/:userId', authenticateJWT, requireOwnerOrManager, handlers.get);
  
  // Create user (owner only)
  router.post('/', authenticateJWT, requireOwner, handlers.create);
  
  // Update user (owner only)
  router.put('/:userId', authenticateJWT, requireOwner, handlers.update);
  
  // Change password (user can change their own password)
  router.post('/:userId/change-password', authenticateJWT, handlers.changePassword);
  
  // Reset password (owner only)
  router.post('/:userId/reset-password', authenticateJWT, requireOwner, handlers.resetPassword);
  
  // Delete user (owner only)
  router.delete('/:userId', authenticateJWT, requireOwner, handlers.delete);
  
  return router;
}