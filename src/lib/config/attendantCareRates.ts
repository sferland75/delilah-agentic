// Current rates (as of 2025)
export const CURRENT_RATES = {
    A: 14.90, // Level 1 - Routine Personal Care
    B: 14.00, // Level 2 - Basic Supervisory Functions
    C: 21.11  // Level 3 - Complex Health/Care and Hygiene Functions
};

// Historical rates (2008-2010)
export const HISTORICAL_RATES = {
    A: 11.23,
    B: 8.75,
    C: 17.98
};

export interface AttendantCareRates {
    A: number;
    B: number;
    C: number;
}

export const DEFAULT_RATES = CURRENT_RATES;