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
