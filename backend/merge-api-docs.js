#!/usr/bin/env node
/**
 * merge-api-docs.js
 *
 * Compare endpoints listed in backend_brain.md with those in docs/openapi.yaml.
 * Usage: `node merge-api-docs.js`
 *
 * The script reports endpoints missing from either source.
 * It can be extended to compare summaries or auto-update docs.
 */
const fs = require('fs');
const yaml = require('js-yaml');

function parseBrainEndpoints(content) {
  const endpoints = [];
  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const match = line.match(/^\|\s*(GET|POST|PUT|PATCH|DELETE)\s*\|\s*([^\s|]+)\s*\|/i);
    if (match) {
      const method = match[1].toUpperCase();
      const path = match[2];
      endpoints.push(`${method} ${path}`);
    }
  }
  return endpoints;
}

function parseOpenApiEndpoints(doc) {
  const endpoints = [];
  const paths = doc.paths || {};
  for (const [path, methods] of Object.entries(paths)) {
    for (const method of Object.keys(methods)) {
      if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
        endpoints.push(`${method.toUpperCase()} ${path}`);
      }
    }
  }
  return endpoints;
}

function main() {
  const brainText = fs.readFileSync('docs/backend_brain.md', 'utf8');
  const openapiText = fs.readFileSync('docs/openapi.yaml', 'utf8');
  const mdEndpoints = parseBrainEndpoints(brainText);
  const spec = yaml.load(openapiText);
  const specEndpoints = parseOpenApiEndpoints(spec);

  const mdSet = new Set(mdEndpoints);
  const specSet = new Set(specEndpoints);

  const onlyInBrain = [...mdSet].filter(e => !specSet.has(e));
  const onlyInSpec = [...specSet].filter(e => !mdSet.has(e));

  console.log('Endpoints in backend_brain.md but not in OpenAPI:');
  console.log(onlyInBrain.length ? onlyInBrain.join('\n') : 'None');
  console.log('\nEndpoints in OpenAPI but not in backend_brain.md:');
  console.log(onlyInSpec.length ? onlyInSpec.join('\n') : 'None');
}

main();
