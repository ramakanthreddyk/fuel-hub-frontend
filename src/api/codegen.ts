
/**
 * OpenAPI TypeScript Code Generator
 * 
 * This script generates TypeScript types and API clients from the OpenAPI specification.
 * Run with: npx tsx src/api/codegen.ts
 */

import { generate } from 'openapi-typescript-codegen';
import * as path from 'path';
import * as fs from 'fs';

const OPENAPI_SPEC_PATH = path.resolve(__dirname, '../../docs/openapi-spec.yaml');
const OUTPUT_DIR = path.resolve(__dirname, './generated');

async function generateApiClient() {
  try {
    console.log('🚀 Generating TypeScript API client from OpenAPI spec...');
    console.log('📁 Spec file:', OPENAPI_SPEC_PATH);
    console.log('📂 Output directory:', OUTPUT_DIR);

    // Check if spec file exists
    if (!fs.existsSync(OPENAPI_SPEC_PATH)) {
      throw new Error(`OpenAPI spec file not found at: ${OPENAPI_SPEC_PATH}`);
    }

    // Clean output directory
    if (fs.existsSync(OUTPUT_DIR)) {
      fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
    }

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
    });

    console.log('✅ API client generated successfully!');
    console.log('📋 Generated files:');
    console.log('  - models/: TypeScript interfaces');
    console.log('  - services/: API service classes');
    console.log('  - core/: HTTP client and configuration');
    
    console.log('🔄 Next steps:');
    console.log('  1. Update existing API files to use generated types');
    console.log('  2. Migrate hooks to use generated services');
    console.log('  3. Run type checking: npx tsc --noEmit');

  } catch (error) {
    console.error('❌ Error generating API client:', error);
    process.exit(1);
  }
}

// Run the generator
generateApiClient();
