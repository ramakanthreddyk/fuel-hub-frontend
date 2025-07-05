/**
 * Shared API Types for FuelSync Hub
 * Generated from frontend api-contract and OpenAPI spec.
 */
export * from '../src/api/api-contract';

// Expose OpenAPI schemas when running in Node (for tooling/tests)
let schemas: Record<string, any> = {};
if (typeof window === 'undefined') {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const yaml = await import('js-yaml');
    const specPath = path.resolve(__dirname, '../docs/openapi-spec.yaml');
    const doc = yaml.load(fs.readFileSync(specPath, 'utf8')) as any;
    schemas = doc.components?.schemas || doc.paths?.schemas || {};
  } catch (err) {
    console.error('[shared/apiTypes] Failed to load OpenAPI schemas', err);
  }
}
export const openApiSchemas = schemas;
