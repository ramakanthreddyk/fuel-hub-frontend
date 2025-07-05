const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
require('dotenv').config();

const prisma = new PrismaClient();

async function seedData() {
  try {
    console.log('Starting seed data creation...');
    
    // Create plans
    const basicPlan = await prisma.plan.upsert({
      where: { id: '00000000-0000-0000-0000-000000000001' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000001',
        name: 'Basic',
        max_stations: 2,
        max_pumps_per_station: 4,
        max_nozzles_per_pump: 2,
        price_monthly: 29.99,
        price_yearly: 299.99,
        features: JSON.stringify(['Basic reporting', 'Single user'])
      }
    });
    
    const standardPlan = await prisma.plan.upsert({
      where: { id: '00000000-0000-0000-0000-000000000002' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000002',
        name: 'Standard',
        max_stations: 5,
        max_pumps_per_station: 8,
        max_nozzles_per_pump: 4,
        price_monthly: 59.99,
        price_yearly: 599.99,
        features: JSON.stringify(['Advanced reporting', 'Up to 5 users', 'Email support'])
      }
    });
    
    const premiumPlan = await prisma.plan.upsert({
      where: { id: '00000000-0000-0000-0000-000000000003' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000003',
        name: 'Premium',
        max_stations: 15,
        max_pumps_per_station: 16,
        max_nozzles_per_pump: 6,
        price_monthly: 99.99,
        price_yearly: 999.99,
        features: JSON.stringify(['Full analytics suite', 'Unlimited users', 'Priority support', 'Custom branding'])
      }
    });
    
    console.log('✅ Created subscription plans');
    
    // Create superadmin
    const passwordHash = await bcrypt.hash('Admin@123', 10);
    
    const superAdmin = await prisma.adminUser.upsert({
      where: { email: 'admin@fuelsync.com' },
      update: {},
      create: {
        email: 'admin@fuelsync.com',
        password_hash: passwordHash,
        name: 'System Admin',
        role: 'superadmin'
      }
    });
    
    console.log('✅ Created superadmin user');
    
    // Create a demo tenant
    const demoTenant = await prisma.tenant.upsert({
      where: { id: '00000000-0000-0000-0000-000000000010' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000010',
        name: 'Demo Fuels Ltd',
        plan_id: standardPlan.id,
        status: 'active'
      }
    });
    
    console.log('✅ Created demo tenant');
    
    // Create tenant settings
    await prisma.tenantSettings.upsert({
      where: { tenant_id: demoTenant.id },
      update: {},
      create: {
        tenant_id: demoTenant.id,
        receipt_template: 'Standard Receipt',
        fuel_rounding: '2',
        branding_logo_url: 'https://example.com/logo.png'
      }
    });
    
    console.log('✅ Created tenant settings');
    
    // Create tenant owner user
    const ownerPasswordHash = await bcrypt.hash('Owner@123', 10);
    
    const ownerUser = await prisma.user.upsert({
      where: { 
        tenant_id_email: {
          tenant_id: demoTenant.id,
          email: 'owner@demofuels.com'
        }
      },
      update: {},
      create: {
        tenant_id: demoTenant.id,
        email: 'owner@demofuels.com',
        password_hash: ownerPasswordHash,
        name: 'Demo Owner',
        role: 'owner'
      }
    });
    
    console.log('✅ Created tenant owner user');
    
    // Create a station
    const mainStation = await prisma.station.upsert({
      where: { 
        id: '00000000-0000-0000-0000-000000000020'
      },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000020',
        tenant_id: demoTenant.id,
        name: 'Main Street Station',
        address: '123 Main Street, Cityville',
        status: 'active'
      }
    });
    
    console.log('✅ Created station');
    
    // Create pumps
    const pump1 = await prisma.pump.upsert({
      where: { id: '00000000-0000-0000-0000-000000000030' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000030',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        name: 'Pump 1',
        serial_number: 'P10001',
        status: 'active'
      }
    });
    
    const pump2 = await prisma.pump.upsert({
      where: { id: '00000000-0000-0000-0000-000000000031' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000031',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        name: 'Pump 2',
        serial_number: 'P10002',
        status: 'active'
      }
    });
    
    console.log('✅ Created pumps');
    
    // Create nozzles
    await prisma.nozzle.upsert({
      where: { id: '00000000-0000-0000-0000-000000000040' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000040',
        tenant_id: demoTenant.id,
        pump_id: pump1.id,
        nozzle_number: 1,
        fuel_type: 'petrol',
        status: 'active'
      }
    });
    
    await prisma.nozzle.upsert({
      where: { id: '00000000-0000-0000-0000-000000000041' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000041',
        tenant_id: demoTenant.id,
        pump_id: pump1.id,
        nozzle_number: 2,
        fuel_type: 'diesel',
        status: 'active'
      }
    });
    
    await prisma.nozzle.upsert({
      where: { id: '00000000-0000-0000-0000-000000000042' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000042',
        tenant_id: demoTenant.id,
        pump_id: pump2.id,
        nozzle_number: 1,
        fuel_type: 'premium',
        status: 'active'
      }
    });
    
    console.log('✅ Created nozzles');
    
    // Create fuel prices
    await prisma.fuelPrice.upsert({
      where: { id: '00000000-0000-0000-0000-000000000050' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000050',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        fuel_type: 'petrol',
        price: 1.45,
        cost_price: 1.20,
        valid_from: new Date()
      }
    });
    
    await prisma.fuelPrice.upsert({
      where: { id: '00000000-0000-0000-0000-000000000051' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000051',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        fuel_type: 'diesel',
        price: 1.35,
        cost_price: 1.10,
        valid_from: new Date()
      }
    });
    
    await prisma.fuelPrice.upsert({
      where: { id: '00000000-0000-0000-0000-000000000052' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000052',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        fuel_type: 'premium',
        price: 1.65,
        cost_price: 1.35,
        valid_from: new Date()
      }
    });
    
    console.log('✅ Created fuel prices');
    
    // Create fuel inventory
    await prisma.fuelInventory.upsert({
      where: { id: '00000000-0000-0000-0000-000000000060' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000060',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        fuel_type: 'petrol',
        current_stock: 5000,
        minimum_level: 1000
      }
    });
    
    await prisma.fuelInventory.upsert({
      where: { id: '00000000-0000-0000-0000-000000000061' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000061',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        fuel_type: 'diesel',
        current_stock: 4500,
        minimum_level: 1000
      }
    });
    
    await prisma.fuelInventory.upsert({
      where: { id: '00000000-0000-0000-0000-000000000062' },
      update: {},
      create: {
        id: '00000000-0000-0000-0000-000000000062',
        tenant_id: demoTenant.id,
        station_id: mainStation.id,
        fuel_type: 'premium',
        current_stock: 3000,
        minimum_level: 800
      }
    });
    
    console.log('✅ Created fuel inventory');
    
    // Link user to station
    await prisma.userStation.upsert({
      where: {
        user_id_station_id: {
          user_id: ownerUser.id,
          station_id: mainStation.id
        }
      },
      update: {},
      create: {
        user_id: ownerUser.id,
        station_id: mainStation.id
      }
    });
    
    console.log('✅ Linked user to station');
    
    console.log('Seed data creation completed successfully!');
    
    // Log credentials for easy access
    console.log('\n=== SEED CREDENTIALS ===');
    console.log('SuperAdmin Login:');
    console.log('Email: admin@fuelsync.com');
    console.log('Password: Admin@123');
    console.log('\nTenant Owner Login:');
    console.log('Email: owner@demofuels.com');
    console.log('Password: Owner@123');
    console.log('========================\n');
    
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedData();