import React, { useEffect, useState } from 'react';
import { SportType } from '../../types.ts';
import { COLORS, QUOTES } from '../../constants.ts';
import Header from './Header';

interface SubmissionScreenProps {
    sport: SportType;
    onFinish: () => void;
    onLogout?: () => void;
}

const SubmissionScreen: React.FC<SubmissionScreenProps> = ({ sport, onFinish, onLogout }) => {
    const [quoteIndex, setQuoteIndex] = useState(0);
    const theme = COLORS[sport === SportType.GYM ? 'GYM' : 'SWIM'];
    const quotes = QUOTES[sport];

    useEffect(() => {
        // Rotate quotes
        const quoteInterval = setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 2500);

        // Simulate Network Request
        const finishTimeout = setTimeout(() => {
            onFinish();
        }, 6000); // 6 seconds loader

        return () => {
            clearInterval(quoteInterval);
            clearTimeout(finishTimeout);
        };
    }, [quotes.length, onFinish]);

    return (
        <div className="w-full h-screen bg-white flex flex-col relative overflow-hidden">
            {/* Header */}
            <Header isLoggedIn={true} onLogout={onLogout} />
            
            <div className="flex-1 flex flex-col items-center justify-center p-6 pt-24">

            {/* Background Ambience */}
            <div
                className="absolute w-[800px] h-[800px] rounded-full opacity-5 blur-3xl animate-[pulse-glow_4s_ease-in-out_infinite]"
                style={{ backgroundColor: theme.primary }}
            ></div>

            {/* Main Animation Container */}
            <div className="relative z-10 w-64 h-64 mb-12 flex items-center justify-center">
                {sport === SportType.SWIMMING ? (
                    // SWIMMING ANIMATION
                    <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                        {/* Outer Circle */}
                        <circle cx="100" cy="100" r="90" fill="none" stroke={theme.light} strokeWidth="4" />
                        <circle cx="100" cy="100" r="90" fill="none" stroke={theme.primary} strokeWidth="4" strokeDasharray="565" strokeDashoffset="565">
                            <animate attributeName="stroke-dashoffset" from="565" to="0" dur="2s" repeatCount="indefinite" />
                        </circle>

                        {/* Wave Path */}
                        <path
                            d="M 40 100 Q 70 60 100 100 T 160 100"
                            fill="none"
                            stroke={theme.primary}
                            strokeWidth="8"
                            strokeLinecap="round"
                            className="opacity-80"
                        >
                            <animate attributeName="d"
                                values="M 40 100 Q 70 60 100 100 T 160 100; M 40 100 Q 70 140 100 100 T 160 100; M 40 100 Q 70 60 100 100 T 160 100"
                                dur="2s"
                                repeatCount="indefinite"
                                calcMode="spline"
                                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                            />
                        </path>
                    </svg>
                ) : (
                    // GYM ANIMATION (Barbell Lift)
                    <svg width="200" height="200" viewBox="0 0 200 200" className="overflow-visible">
                        {/* Outer Circle */}
                        <circle cx="100" cy="100" r="90" fill="none" stroke={theme.light} strokeWidth="4" />

                        {/* Barbell Assembly */}
                        <g>
                            {/* The Bar */}
                            <line x1="40" y1="100" x2="160" y2="100" stroke={theme.primary} strokeWidth="6" strokeLinecap="round" />
                            {/* Plates Left */}
                            <rect x="30" y="80" width="10" height="40" rx="2" fill={theme.primary} />
                            <rect x="42" y="85" width="6" height="30" rx="1" fill={theme.primary} />
                            {/* Plates Right */}
                            <rect x="160" y="80" width="10" height="40" rx="2" fill={theme.primary} />
                            <rect x="152" y="85" width="6" height="30" rx="1" fill={theme.primary} />

                            <animateTransform
                                attributeName="transform"
                                type="translate"
                                values="0 40; 0 -40; 0 40"
                                dur="2s"
                                repeatCount="indefinite"
                                keyTimes="0; 0.5; 1"
                                calcMode="spline"
                                keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                            />
                        </g>
                    </svg>
                )}
            </div>

            {/* Typography */}
            <div className="text-center z-10 max-w-md">
                <h2 className="text-lg font-semibold text-gray-900 mb-6 tracking-wide uppercase">
                    Finalizing your allocation...
                </h2>

                {/* Animated Quote */}
                <div className="h-20 flex items-center justify-center">
                    <p
                        key={quoteIndex}
                        className="text-2xl font-serif italic text-gray-500 animate-[pulse-glow_2s_ease-in-out]"
                    >
                        "{quotes[quoteIndex]}"
                    </p>
                </div>
            </div>
            </div>
        </div>
    );
};

export default SubmissionScreen;
