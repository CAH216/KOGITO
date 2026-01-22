export const PRICING_CONSTANTS = {
    CREDIT_VALUE_CAD: 25, // Value of 1 Credit in system currency
    PLATFORM_FEE_PERCENT: 0.20, // 20% Commission
};

export function calculateSessionCost(tutorHourlyRate: number | null, durationHours: number = 1): number {
    if (!tutorHourlyRate) return 1 * durationHours; // Default to 1 credit/hour if no rate set

    // Formula: (TutorRate * (1 + Fee)) / CreditValue
    // Example: (20 * 1.20) / 25 = 24 / 25 = 0.96 Credits
    // Example: (25 * 1.20) / 25 = 1.2 Credits
    
    const costInCredits = (tutorHourlyRate * (1 + PRICING_CONSTANTS.PLATFORM_FEE_PERCENT)) / PRICING_CONSTANTS.CREDIT_VALUE_CAD;
    
    // Round to 2 decimals
    return Math.ceil(costInCredits * durationHours * 100) / 100;
}

export function calculateTutorEarnings(tutorHourlyRate: number | null, durationHours: number = 1): number {
    if (!tutorHourlyRate) return 20 * durationHours; // Default assumption: Tutor gets $20 if unspecified (Consuming 1 credit of $25)
    return tutorHourlyRate * durationHours;
}
