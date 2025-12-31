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

export interface TimeSlot {
    id: string;
    timeRange: string;
    availability: 'HIGH' | 'MEDIUM' | 'LOW';
    type: string; // e.g., "Lap Swim", "Cardio"
}

export interface UserPreferences {
    sport: SportType | null;
    rankedSlots: TimeSlot[];
}
