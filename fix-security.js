const fs = require('fs');
const path = require('path');

// Files to fix
const filesToFix = [
  'src/api/services/todaysSalesService.ts',
  'src/api/nozzles.ts',
  'src/api/creditors.ts',
  'src/api/pumps.ts',
  'src/api/tenants.ts',
  'src/api/diagnostic.ts',
  'src/api/services/cashReport.service.ts',
  'src/api/contract/fuel-prices.service.ts',
  'src/api/contract/owner.service.ts',
  'src/api/config.ts',
  'src/api/alerts.ts',
  'src/api/services/attendantService.ts'
];

function fixFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Add security import if not present
    if (!content.includes('from \'@/utils/security\'') && !content.includes('from "@/utils/security"')) {
      const importMatch = content.match(/^(import[^;]+;[\r\n]+)+/m);
      if (importMatch) {
        const lastImport = importMatch[0];
        content = content.replace(lastImport, lastImport + 'import { secureLog, sanitizeUrlParam } from \'@/utils/security\';\n');
        modified = true;
      }
    }

    // Fix console.log statements
    content = content.replace(/console\.(log|info|warn|error|debug)\(/g, 'secureLog.$1(');
    
    // Fix URL parameter injections
    content = content.replace(/`\/[^`]*\$\{([^}]+)\}[^`]*`/g, (match, param) => {
      if (!param.includes('sanitizeUrlParam') && !param.includes('encodeURIComponent')) {
        return match.replace(param, `sanitizeUrlParam(${param})`);
      }
      return match;
    });

    // Fix specific patterns
    content = content.replace(/params\.stationId(?!\))/g, 'sanitizeUrlParam(params.stationId)');
    content = content.replace(/stationId(?=\s*\?\s*)/g, 'sanitizeUrlParam(stationId)');

    if (modified || content !== fs.readFileSync(filePath, 'utf8')) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Fix all files
filesToFix.forEach(file => {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    fixFile(fullPath);
  }
});

console.log('Security fixes applied!');