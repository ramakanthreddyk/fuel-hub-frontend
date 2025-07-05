export interface TenantInput {
  name: string;
  planId: string;
}

export function validateTenantInput(data: any): TenantInput {
  const { name, planId, planType } = data || {};
  
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid tenant name');
  }
  
  // Handle both planId and planType (frontend uses planType)
  let finalPlanId = planId;
  if (!finalPlanId && planType) {
    // Convert planType to planId by looking up in database
    // For now, we'll use a simple mapping
    if (planType === 'basic') finalPlanId = 'basic';
    else if (planType === 'pro') finalPlanId = 'pro';
    else if (planType === 'premium') finalPlanId = 'premium';
    else finalPlanId = 'basic'; // Default
  }
  
  if (!finalPlanId || typeof finalPlanId !== 'string') {
    throw new Error('Invalid plan ID or type');
  }
  
  return { name, planId: finalPlanId };
}
