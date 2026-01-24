// Pricing and Limits Configuration

export const PRICING_CONSTANTS = {
  FREE_PLAN: {
    MAX_DAILY_AI_REQUESTS: 15,
    MAX_DAILY_HOMEWORK_GEN: 3,
    NAME: "Gratuit",
    PRICE: 0
  },
  PREMIUM_PLAN: {
    MAX_DAILY_AI_REQUESTS: 100, // Or infinity
    MAX_DAILY_HOMEWORK_GEN: 20,
    NAME: "Premium",
    PRICE: 29.99 // Example
  }
};

export const canUserPerformAction = (
  plan: 'FREE' | 'PREMIUM', 
  currentUsage: number, 
  actionType: 'CHAT' | 'HOMEWORK'
): boolean => {
  if (plan === 'PREMIUM') return true; // Assuming Premium is unlimited or high limit

  const limits = PRICING_CONSTANTS.FREE_PLAN;
  if (actionType === 'CHAT') {
    return currentUsage < limits.MAX_DAILY_AI_REQUESTS;
  }
  if (actionType === 'HOMEWORK') {
    return currentUsage < limits.MAX_DAILY_HOMEWORK_GEN;
  }
  
  return false;
};
