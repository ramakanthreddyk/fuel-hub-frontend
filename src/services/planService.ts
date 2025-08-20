// planService.ts
// Handles business logic for plan usage and upgrade recommendations
import { apiClient } from '@/api/client';

export async function fetchPlanInfo() {
  const response = await apiClient.get('/settings/plan');
  return response.data;
}

// Add more business logic here as needed
