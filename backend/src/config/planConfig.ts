export interface PlanRules {
  maxStations: number;
  maxPumpsPerStation: number;
  maxNozzlesPerPump: number;
  maxEmployees: number;
  enableCreditors: boolean;
  enableReports: boolean;
  enableApiAccess: boolean;
}

// Built-in rule presets
export const planConfig: Record<string, PlanRules> = {
  starter: {
    maxStations: 1,
    maxPumpsPerStation: 2,
    maxNozzlesPerPump: 2,
    maxEmployees: 3,
    enableCreditors: false,
    enableReports: false,
    enableApiAccess: false,
  },
  pro: {
    maxStations: 3,
    maxPumpsPerStation: 4,
    maxNozzlesPerPump: 4,
    maxEmployees: 10,
    enableCreditors: true,
    enableReports: true,
    enableApiAccess: false,
  },
  enterprise: {
    maxStations: Infinity,
    maxPumpsPerStation: Infinity,
    maxNozzlesPerPump: Infinity,
    maxEmployees: Infinity,
    enableCreditors: true,
    enableReports: true,
    enableApiAccess: true,
  },
};

// Map seeded UUIDs to rule presets
const planIdMap: Record<string, keyof typeof planConfig> = {
  '00000000-0000-0000-0000-000000000001': 'starter',
  '00000000-0000-0000-0000-000000000002': 'pro',
  '00000000-0000-0000-0000-000000000003': 'enterprise',
};

export function getPlanRules(planId: string): PlanRules {
  const key = planIdMap[planId] || planId;
  return planConfig[key] || planConfig.starter;
}
