import { SportType } from './types.ts';
import type { TimeSlot } from './types.ts';

export const COLORS = {
    SWIM: {
        primary: '#006D77', // Deep Teal
        accent: '#83C5BE', // Bright Turquoise
        gradient: 'from-[#006D77] to-[#003d42]',
        light: '#E0F7FA',
    },
    GYM: {
        primary: '#CA4E00', // Burnt Orange
        accent: '#FFBA08', // Gold/Amber
        gradient: 'from-[#CA4E00] to-[#9a3c00]',
        light: '#FFF3E0',
    },
    NEUTRAL: {
        bg: '#F4F6F8',
        text: '#222222',
    },
};

export const INITIAL_SLOTS_SWIM: TimeSlot[] = [
    { id: 's1', timeRange: '06:00 AM – 07:00 AM', availability: 'LOW', type: 'Lap Swim' },
    { id: 's2', timeRange: '07:00 AM – 08:00 AM', availability: 'MEDIUM', type: 'Lap Swim' },
    { id: 's3', timeRange: '05:00 PM – 06:00 PM', availability: 'HIGH', type: 'Leisure & Laps' },
    { id: 's4', timeRange: '06:00 PM – 07:00 PM', availability: 'HIGH', type: 'Diving Well' },
    { id: 's5', timeRange: '08:00 PM – 09:00 PM', availability: 'HIGH', type: 'Leisure Swim' },
];

export const INITIAL_SLOTS_GYM: TimeSlot[] = [
    { id: 'g1', timeRange: '05:30 AM – 07:00 AM', availability: 'LOW', type: 'Cardio & Strength' },
    { id: 'g2', timeRange: '07:00 AM – 08:30 AM', availability: 'MEDIUM', type: 'Free Weights' },
    { id: 'g3', timeRange: '05:00 PM – 06:30 PM', availability: 'HIGH', type: 'CrossFit Zone' },
    { id: 'g4', timeRange: '06:30 PM – 08:00 PM', availability: 'HIGH', type: 'General Access' },
    { id: 'g5', timeRange: '08:00 PM – 09:30 PM', availability: 'HIGH', type: 'Strength' },
];

export const QUOTES = {
    [SportType.SWIMMING]: [
        "The water doesn't know your age. It only knows your effort.",
        "Just keep swimming.",
        "Chlorine is my perfume.",
        "Silence the noise. Find your rhythm."
    ],
    [SportType.GYM]: [
        "The only bad workout is the one that didn't happen.",
        "Sweat is just fat crying.",
        "Respect your body. It’s the only one you get.",
        "Discipline over motivation."
    ]
};
