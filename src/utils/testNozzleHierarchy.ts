/**
 * Frontend utility to test nozzle hierarchy and debug reading issues
 */

import { nozzlesService } from '../api/services/nozzlesService';
import { readingsService } from '../api/services/readingsService';

export async function testNozzleHierarchy() {
  console.log('🧪 Frontend Nozzle Hierarchy Test...\n');
  
  try {
    // Test 1: Get all nozzles
    console.log('📋 Test 1: Fetching all nozzles...');
    const allNozzles = await nozzlesService.getNozzles();
    
    console.log(`Found ${allNozzles.length} nozzles:`);
    allNozzles.forEach(nozzle => {
      console.log(`  - Nozzle #${nozzle.nozzleNumber} (${nozzle.fuelType}): lastReading = ${nozzle.lastReading}`);
    });
    
    // Test 2: Get nozzles for a specific pump
    if (allNozzles.length > 0) {
      const firstPumpId = allNozzles[0].pumpId;
      console.log(`\n📋 Test 2: Fetching nozzles for pump ${firstPumpId}...`);
      
      const pumpNozzles = await nozzlesService.getNozzles(firstPumpId);
      console.log(`Found ${pumpNozzles.length} nozzles for pump:`);
      pumpNozzles.forEach(nozzle => {
        console.log(`  - Nozzle #${nozzle.nozzleNumber} (${nozzle.fuelType}): lastReading = ${nozzle.lastReading}`);
      });
      
      // Test 3: Get latest reading for each nozzle via API
      console.log(`\n📊 Test 3: Fetching latest readings via API...`);
      for (const nozzle of pumpNozzles) {
        try {
          const latestReading = await readingsService.getLatestReading(nozzle.id);
          console.log(`  - Nozzle #${nozzle.nozzleNumber}: API reading = ${latestReading?.reading || 'No readings'}`);
          console.log(`    Comparison: nozzle.lastReading = ${nozzle.lastReading}, API reading = ${latestReading?.reading || 'null'}`);
          
          if (nozzle.lastReading !== latestReading?.reading) {
            console.log(`    ⚠️  MISMATCH detected!`);
          } else {
            console.log(`    ✅ Values match`);
          }
        } catch (error) {
          console.log(`  - Nozzle #${nozzle.nozzleNumber}: API error = ${error.message}`);
          if (nozzle.lastReading) {
            console.log(`    ⚠️  Nozzle has lastReading but API failed`);
          } else {
            console.log(`    ✅ Both nozzle.lastReading and API show no readings`);
          }
        }
      }
    }
    
    console.log('\n🎉 Frontend hierarchy test completed!');
    
  } catch (error) {
    console.error('❌ Frontend test failed:', error);
  }
}

// Helper function to run test from browser console
(window as any).testNozzleHierarchy = testNozzleHierarchy;
