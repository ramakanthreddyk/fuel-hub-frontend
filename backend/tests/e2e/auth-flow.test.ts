import express from 'express';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { createAuthRouter } from '../../src/routes/auth.route';
import { authenticateJWT } from '../../src/middlewares/authenticateJWT';
import { requireRole } from '../../src/middlewares/requireRole';
import { UserRole } from '../../src/constants/auth';

jest.mock('../../src/utils/jwt', () => ({
  generateToken: () => 'token',
  verifyToken: () => ({ userId: '1', role: 'manager', tenantId: 't1' }),
}));

describe('auth flow', () => {
  const app = express();
  app.use(express.json());

  const hash = bcrypt.hashSync('pass', 1);
  const db: any = {
    query: jest.fn().mockResolvedValue({ rows: [{ id: '1', password_hash: hash, role: 'manager' }] }),
  };

  app.use('/api/auth', createAuthRouter(db));
  app.get('/api/protected', authenticateJWT, requireRole([UserRole.Manager]), (_req, res) => {
    res.json({ ok: true });
  });

  test('login then access protected route', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({ email: 'e', password: 'pass' });
    const token = loginRes.body.token;
    const res = await request(app).get('/api/protected').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});
