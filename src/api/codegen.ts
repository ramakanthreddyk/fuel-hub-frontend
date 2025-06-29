
/**
 * OpenAPI TypeScript Code Generator
 * 
 * This script generates TypeScript types and API clients from the OpenAPI specification.
 * Run with: npx tsx src/api/codegen.ts
 * 
 * Dependencies needed:
 * - openapi-typescript-codegen
 * - typescript
 * - tsx (for running TypeScript directly)
 */

import { generate } from 'openapi-typescript-codegen';
import * as path from 'path';

const OPENAPI_SPEC_PATH = path.resolve(__dirname, '../../docs/openapi-spec.yaml');
const OUTPUT_DIR = path.resolve(__dirname, './generated');

async function generateApiClient() {
  try {
    console.log('🚀 Generating TypeScript API client from OpenAPI spec...');
    console.log('📁 Spec file:', OPENAPI_SPEC_PATH);
    console.log('📂 Output directory:', OUTPUT_DIR);

    await generate({
      input: OPENAPI_SPEC_PATH,
      output: OUTPUT_DIR,
      httpClient: 'axios',
      clientName: 'FuelSyncApi',
      useOptions: true,
      useUnionTypes: true,
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: false,
      indent: '  ',
      postfixServices: 'Service',
      postfixModels: '',
      request: './request',
    });

    console.log('✅ API client generated successfully!');
    console.log('📋 Next steps:');
    console.log('  1. Import types from ./generated/models');
    console.log('  2. Import services from ./generated/services');
    console.log('  3. Update existing API files to use generated types');
    console.log('  4. Run type checking: npx tsc --noEmit');

  } catch (error) {
    console.error('❌ Error generating API client:', error);
    process.exit(1);
  }
}

// Run the generator
generateApiClient();
