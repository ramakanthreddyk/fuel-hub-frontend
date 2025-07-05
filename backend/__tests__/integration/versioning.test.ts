import request from 'supertest';
import { createApp } from '../../src/app';

describe('API versioning', () => {
  const app = createApp();
  test('GET /v1/users responds', async () => {
    const res = await request(app).get('/v1/users');
    expect(res.status).not.toBe(404);
  });

  test('GET /v1/stations responds', async () => {
    const res = await request(app).get('/v1/stations');
    expect(res.status).not.toBe(404);
  });
});
