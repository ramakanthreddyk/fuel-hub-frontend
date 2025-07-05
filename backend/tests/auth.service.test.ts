import bcrypt from 'bcrypt';
import { login } from '../src/services/auth.service';

jest.mock('../src/utils/jwt', () => ({
  generateToken: () => 'signed-token',
}));

describe('auth.service.login', () => {
  test('returns null when no user', async () => {
    const db = { query: jest.fn().mockResolvedValue({ rows: [] }) } as any;
    const token = await login(db, 'a@test.com', 'pw', 'tenant1');
    expect(token).toBeNull();
  });

  test('returns token when password matches', async () => {
    const hash = await bcrypt.hash('pw', 1);
    const db = { query: jest.fn().mockResolvedValue({ rows: [{ id: '1', email: 'a@test.com', password_hash: hash, role: 'manager' }] }) } as any;
    const result = await login(db, 'a@test.com', 'pw', 'tenant1');
    expect(result).toEqual({
      token: 'signed-token',
      user: {
        id: '1',
        name: 'a',
        email: 'a@test.com',
        role: 'manager',
        tenantId: 'tenant1',
        tenantName: undefined
      }
    });
  });

  test('uses bcrypt.compare for password validation', async () => {
    const hash = await bcrypt.hash('pw', 1);
    const compareSpy = jest.spyOn(bcrypt as any, 'compare').mockResolvedValue(true as any);
    const db = { query: jest.fn().mockResolvedValue({ rows: [{ id: '1', email: 'a@test.com', password_hash: hash, role: 'manager' }] }) } as any;
    await login(db, 'a@test.com', 'pw', 'tenant1');
    expect(compareSpy).toHaveBeenCalledWith('pw', hash);
    compareSpy.mockRestore();
  });
});
