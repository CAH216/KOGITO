export const PRICING_CONSTANTS = {
    CREDIT_VALUE_CAD: 1, // 1 Credit = 1$ CAD (Aligned with new Billing)
    PLATFORM_FEE_PERCENT: 0.15, // 15% Platform Fee added on top of Tutor Ask
};

export function calculateSessionCost(tutorHourlyRate: number | null, durationHours: number = 1): number {
    if (!tutorHourlyRate) return 35 * durationHours; // Default safe rate

    // The cost to the parent is TutorRate + PlatformFee
    // Example: Tutor wants 40$. Fee is 15%.
    // Cost = 40 * 1.15 = 46 Credits (46$)
    
    // We treat hoursBalance as raw Dollars now.
    const platformFee = Math.max(tutorHourlyRate * PRICING_CONSTANTS.PLATFORM_FEE_PERCENT, 5); // Minimum 5$ fee
    const totalRate = tutorHourlyRate + platformFee;
    
    // Round to 2 decimals
    return Math.ceil(totalRate * 100) / 100 * durationHours;
}

export function calculateTutorEarnings(tutorHourlyRate: number | null, durationHours: number = 1): number {
    // Tutor gets exactly their hourly rate * duration
    // The Markup is collected by the platform from the parent
    const rate = tutorHourlyRate || 25;
    return Math.floor((rate * durationHours) * 100) / 100;
}
