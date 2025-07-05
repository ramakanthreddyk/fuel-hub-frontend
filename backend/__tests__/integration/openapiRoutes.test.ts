import request from 'supertest';
import { createApp } from '../../src/app';
import yaml from 'js-yaml';
import fs from 'fs';
import path from 'path';

describe('OpenAPI endpoint existence', () => {
  const app = createApp();
  const specPath = path.resolve(__dirname, '../../docs/openapi-spec.yaml');
  const doc = yaml.load(fs.readFileSync(specPath, 'utf8')) as any;
  const paths = doc.paths || {};

  for (const [route, methods] of Object.entries<any>(paths)) {
    if (route.includes('{')) continue; // skip paths with parameters
    if (methods.get) {
      const url = route.replace('/api', ''); // adapt for test prefix
      test(`GET ${route} should respond`, async () => {
        const res = await request(app).get(url);
        expect(res.status).not.toBe(404);
      });
    }
  }
});
