import request from 'supertest';
import { createApp } from '../../src/app';
import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

describe('API contract', () => {
  const app = createApp();
  const specPath = path.resolve(__dirname, '../../docs/openapi-spec.yaml');
  const doc = yaml.load(fs.readFileSync(specPath, 'utf8')) as any;

  for (const [route, methods] of Object.entries<any>(doc.paths || {})) {
    if (!route.startsWith('/api/v1')) continue;
    if (route.includes('{')) continue;
    for (const [method] of Object.entries<any>(methods)) {
      test(`${method.toUpperCase()} ${route} responds`, async () => {
        const url = route.replace('/api', '');
        const res = await (request(app) as any)[method](url);
        expect(res.status).not.toBe(404);
      });
    }
  }
});

