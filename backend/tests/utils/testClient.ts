import request from 'supertest';
import { createApp } from '../../src/app';

export function getTestClient() {
  const app = createApp();
  return request(app);
}
