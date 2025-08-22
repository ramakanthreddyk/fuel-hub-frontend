#!/usr/bin/env node
/**
 * @file scripts/update-imports.js
 * @description Script to update import statements to use new architecture
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcPath = path.join(__dirname, '../src');

// Import mapping rules
const importMappings = [
  // Update imports from old component structure to features
  {
    pattern: /from ['"]\.\.\/components\/dashboard\/([^'"]+)['"]/g,
    replacement: "from '@/features/dashboard/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/dashboard\/([^'"]+)['"]/g,
    replacement: "from '@/features/dashboard/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/stations\/([^'"]+)['"]/g,
    replacement: "from '@/features/stations/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/stations\/([^'"]+)['"]/g,
    replacement: "from '@/features/stations/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/pumps\/([^'"]+)['"]/g,
    replacement: "from '@/features/pumps/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/pumps\/([^'"]+)['"]/g,
    replacement: "from '@/features/pumps/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/nozzles\/([^'"]+)['"]/g,
    replacement: "from '@/features/nozzles/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/nozzles\/([^'"]+)['"]/g,
    replacement: "from '@/features/nozzles/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/readings\/([^'"]+)['"]/g,
    replacement: "from '@/features/readings/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/readings\/([^'"]+)['"]/g,
    replacement: "from '@/features/readings/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/users\/([^'"]+)['"]/g,
    replacement: "from '@/features/users/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/users\/([^'"]+)['"]/g,
    replacement: "from '@/features/users/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/reports\/([^'"]+)['"]/g,
    replacement: "from '@/features/reports/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/reports\/([^'"]+)['"]/g,
    replacement: "from '@/features/reports/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/auth\/([^'"]+)['"]/g,
    replacement: "from '@/features/auth/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/auth\/([^'"]+)['"]/g,
    replacement: "from '@/features/auth/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/settings\/([^'"]+)['"]/g,
    replacement: "from '@/features/settings/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/settings\/([^'"]+)['"]/g,
    replacement: "from '@/features/settings/components/$1'"
  },

  // Update hook imports
  {
    pattern: /from ['"]\.\.\/hooks\/useStations['"]/g,
    replacement: "from '@/features/stations/hooks/useStations'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useStations['"]/g,
    replacement: "from '@/features/stations/hooks/useStations'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/usePumps['"]/g,
    replacement: "from '@/features/pumps/hooks/usePumps'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/usePumps['"]/g,
    replacement: "from '@/features/pumps/hooks/usePumps'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/useNozzles['"]/g,
    replacement: "from '@/features/nozzles/hooks/useNozzles'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useNozzles['"]/g,
    replacement: "from '@/features/nozzles/hooks/useNozzles'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/useReadings['"]/g,
    replacement: "from '@/features/readings/hooks/useReadings'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useReadings['"]/g,
    replacement: "from '@/features/readings/hooks/useReadings'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/useUsers['"]/g,
    replacement: "from '@/features/users/hooks/useUsers'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useUsers['"]/g,
    replacement: "from '@/features/users/hooks/useUsers'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/useReports['"]/g,
    replacement: "from '@/features/reports/hooks/useReports'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useReports['"]/g,
    replacement: "from '@/features/reports/hooks/useReports'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/useDashboard['"]/g,
    replacement: "from '@/features/dashboard/hooks/useDashboard'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useDashboard['"]/g,
    replacement: "from '@/features/dashboard/hooks/useDashboard'"
  },
  {
    pattern: /from ['"]\.\.\/hooks\/useFuelPrices['"]/g,
    replacement: "from '@/features/fuel-prices/hooks/useFuelPrices'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/hooks\/useFuelPrices['"]/g,
    replacement: "from '@/features/fuel-prices/hooks/useFuelPrices'"
  },

  // Update page imports
  {
    pattern: /from ['"]\.\.\/pages\/StationsPage['"]/g,
    replacement: "from '@/features/stations/pages/StationsPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/StationsPage['"]/g,
    replacement: "from '@/features/stations/pages/StationsPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/PumpsPage['"]/g,
    replacement: "from '@/features/pumps/pages/PumpsPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/PumpsPage['"]/g,
    replacement: "from '@/features/pumps/pages/PumpsPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/NozzlesPage['"]/g,
    replacement: "from '@/features/nozzles/pages/NozzlesPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/NozzlesPage['"]/g,
    replacement: "from '@/features/nozzles/pages/NozzlesPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/ReadingsPage['"]/g,
    replacement: "from '@/features/readings/pages/ReadingsPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/ReadingsPage['"]/g,
    replacement: "from '@/features/readings/pages/ReadingsPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/UsersPage['"]/g,
    replacement: "from '@/features/users/pages/UsersPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/UsersPage['"]/g,
    replacement: "from '@/features/users/pages/UsersPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/SettingsPage['"]/g,
    replacement: "from '@/features/settings/pages/SettingsPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/SettingsPage['"]/g,
    replacement: "from '@/features/settings/pages/SettingsPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/LoginPage['"]/g,
    replacement: "from '@/features/auth/pages/LoginPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/LoginPage['"]/g,
    replacement: "from '@/features/auth/pages/LoginPage'"
  },
  {
    pattern: /from ['"]\.\.\/pages\/FuelPricesPage['"]/g,
    replacement: "from '@/features/fuel-prices/pages/FuelPricesPage'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/pages\/FuelPricesPage['"]/g,
    replacement: "from '@/features/fuel-prices/pages/FuelPricesPage'"
  },

  // Update shared imports
  {
    pattern: /from ['"]\.\.\/types\/([^'"]+)['"]/g,
    replacement: "from '@/shared/types/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/types\/([^'"]+)['"]/g,
    replacement: "from '@/shared/types/$1'"
  },
  {
    pattern: /from ['"]\.\.\/utils\/([^'"]+)['"]/g,
    replacement: "from '@/shared/utils/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/utils\/([^'"]+)['"]/g,
    replacement: "from '@/shared/utils/$1'"
  },

  // Update common UI component imports  
  {
    pattern: /from ['"]\.\.\/components\/ui\/([^'"]+)['"]/g,
    replacement: "from '@/shared/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/ui\/([^'"]+)['"]/g,
    replacement: "from '@/shared/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/components\/common\/([^'"]+)['"]/g,
    replacement: "from '@/shared/components/$1'"
  },
  {
    pattern: /from ['"]\.\.\/\.\.\/components\/common\/([^'"]+)['"]/g,
    replacement: "from '@/shared/components/$1'"
  },
];

function updateFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let hasChanges = false;
    
    importMappings.forEach(({ pattern, replacement }) => {
      const newContent = content.replace(pattern, replacement);
      if (newContent !== content) {
        content = newContent;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated imports in: ${path.relative(srcPath, filePath)}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

function scanDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) return 0;
  
  let updatedCount = 0;
  const items = fs.readdirSync(dirPath);
  
  items.forEach(item => {
    const itemPath = path.join(dirPath, item);
    const stat = fs.statSync(itemPath);
    
    if (stat.isDirectory()) {
      updatedCount += scanDirectory(itemPath);
    } else if (item.match(/\\.(ts|tsx|js|jsx)$/)) {
      if (updateFile(itemPath)) {
        updatedCount++;
      }
    }
  });
  
  return updatedCount;
}

async function main() {
  console.log('🔄 Starting import path updates...');
  console.log('');
  
  // Update files in features directory
  console.log('📁 Updating feature imports...');
  const featuresUpdated = scanDirectory(path.join(srcPath, 'features'));
  
  // Update files in remaining components
  console.log('📁 Updating remaining component imports...');
  const componentsUpdated = scanDirectory(path.join(srcPath, 'components'));
  
  // Update files in pages
  console.log('📁 Updating page imports...');
  const pagesUpdated = scanDirectory(path.join(srcPath, 'pages'));
  
  // Update files in hooks
  console.log('📁 Updating hook imports...');
  const hooksUpdated = scanDirectory(path.join(srcPath, 'hooks'));
  
  // Update App.tsx and other root files
  console.log('📁 Updating root files...');
  let rootUpdated = 0;
  const rootFiles = ['App.tsx', 'main.tsx'];
  rootFiles.forEach(file => {
    const filePath = path.join(srcPath, file);
    if (fs.existsSync(filePath) && updateFile(filePath)) {
      rootUpdated++;
    }
  });
  
  const totalUpdated = featuresUpdated + componentsUpdated + pagesUpdated + hooksUpdated + rootUpdated;
  
  console.log('');
  console.log('✅ Import path updates completed!');
  console.log('');
  console.log('📊 Summary:');
  console.log(`- Features: ${featuresUpdated} files updated`);
  console.log(`- Components: ${componentsUpdated} files updated`);
  console.log(`- Pages: ${pagesUpdated} files updated`);
  console.log(`- Hooks: ${hooksUpdated} files updated`);
  console.log(`- Root files: ${rootUpdated} files updated`);
  console.log(`- Total: ${totalUpdated} files updated`);
  console.log('');
  console.log('🔍 Next steps:');
  console.log('1. Run TypeScript compiler to check for any remaining import issues');
  console.log('2. Test the application to ensure everything works correctly');
  console.log('3. Fix any remaining import paths manually if needed');
}

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export {
  updateFile,
  scanDirectory,
  importMappings
};
