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
    const originalContent = content;
    let modified = false;

    // Add security import if not present
    if (!content.includes('from \'@/utils/security\'') && !content.includes('from "@/utils/security"')) {
      const importLines = content.split('\n').filter(line => line.trim().startsWith('import'));
      if (importLines.length > 0) {
        const lastImportIndex = content.lastIndexOf(importLines[importLines.length - 1]);
        const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
        content = content.slice(0, insertIndex) + 'import { secureLog, sanitizeUrlParam } from \'@/utils/security\';\n' + content.slice(insertIndex);
        modified = true;
      }
    }

    // Fix console.log statements
    const consoleRegex = /console\.(log|info|warn|error|debug)\(/g;
    if (consoleRegex.test(content)) {
      content = content.replace(/console\.(log|info|warn|error|debug)\(/g, 'secureLog.$1(');
      modified = true;
    }
    
    // Fix URL parameter injections - more specific patterns
    const urlPatterns = [
      /`\/[^`]*\$\{([^}]+)\}[^`]*`/g,
      /\$\{([^}]+)\}/g
    ];
    
    urlPatterns.forEach(pattern => {
      content = content.replace(pattern, (match, param) => {
        if (param && !param.includes('sanitizeUrlParam') && !param.includes('encodeURIComponent') && 
            (param.includes('id') || param.includes('Id') || param.includes('stationId') || param.includes('userId'))) {
          return match.replace(param, `sanitizeUrlParam(${param})`);
        }
        return match;
      });
    });

    if (content !== originalContent) {
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
  } else {
    console.log(`File not found: ${fullPath}`);
  }
});

console.log('Security fixes applied!');