export const ScreenState = {
    LANDING: 'LANDING',
    SPORT_SELECTION: 'SPORT_SELECTION',
    SLOT_SELECTION: 'SLOT_SELECTION',
    SUBMISSION: 'SUBMISSION',
    SUCCESS: 'SUCCESS',
} as const;

export type ScreenState = typeof ScreenState[keyof typeof ScreenState];

export const SportType = {
    GYM: 'GYM',
    SWIMMING: 'SWIMMING',
} as const;

export type SportType = typeof SportType[keyof typeof SportType];

// API Response Types
export interface GymSlot {
    id: string;
    timings: string;
    gender: string;
    capacity: number;
    filled: number;
}

export interface SwimSlot {
    id: string;
    timings: string;
    days: string;
    gender: string;
    capacity: number;
    filled: number;
}

// UI Display Type (with computed availability)
export interface TimeSlot {
    id: string;
    timeRange: string;
    availability: 'HIGH' | 'MEDIUM' | 'LOW';
    type?: string; // Optional, for backward compatibility
    capacity: number;
    filled: number;
    days?: string; // For swim slots
}

export interface UserPreferences {
    sport: SportType | null;
    rankedSlots: TimeSlot[];
}

// Registration Response Types
export interface RegistrationResponse {
    queue_no: number;
    category: string;
}

// Status Response Types
export interface StatusResponse {
    filled: number;
    status: string;
    final_slot?: string;
}
