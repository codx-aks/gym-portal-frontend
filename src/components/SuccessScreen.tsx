import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { SportType } from '../../types.ts';
import { COLORS, QUOTES } from '../../constants.ts';
import { API_BASE_URL } from '../config.ts';
import type { StatusResponse, RegistrationResponse } from '../../types.ts';
import Button from './Button.tsx';
import Header from './Header.tsx';
import { useAuth } from '../contexts/AuthContext.tsx';
import Gym from '../assets/gym.jpg';
import Swim from '../assets/swim.jpeg';

const SuccessScreen: React.FC = () => {
  const { sport } = useParams<{ sport: string }>();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const sportType = sport?.toUpperCase() === 'SWIMMING' ? SportType.SWIMMING : SportType.GYM;
  const theme = sportType === SportType.GYM ? COLORS.GYM : COLORS.SWIM;
  const quotes = QUOTES[sportType];

  const [quoteIndex, setQuoteIndex] = useState(0);
  const [status, setStatus] = useState<StatusResponse | null>(null);
  const [currentQueuePosition, setCurrentQueuePosition] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAllocated, setIsAllocated] = useState(false);

  const registrationDataRef = useRef<RegistrationResponse | null>(null);
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Get registration data from sessionStorage
  useEffect(() => {
    const registrationStr = sessionStorage.getItem('registration');
    if (registrationStr) {
      registrationDataRef.current = JSON.parse(registrationStr);
    }
  }, []);

  // Poll status endpoint
  useEffect(() => {
    const pollStatus = async () => {
      try {
        const endpoint = sportType === SportType.GYM
          ? `${API_BASE_URL}/status/gymslot`
          : `${API_BASE_URL}/status/swimslot`;

        const response = await fetch(endpoint, {
          credentials: 'include',
        });

        if (!response.ok) {
          if (response.status === 503) {
            setError('Service currently unavailable');
            // Stop short polling if service unavailable
            if (pollingIntervalRef.current) {
              clearInterval(pollingIntervalRef.current);
              pollingIntervalRef.current = null;
            }
            setLoading(false);
            return;
          }
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
          setLoading(false);
          throw new Error('Failed to fetch status');
        }

        const statusData: StatusResponse = await response.json();
        setStatus(statusData);
        setLoading(false);
        setError(null);

        // Calculate current queue position only if we have registration data
        if (registrationDataRef.current) {
          const position = registrationDataRef.current.queue_no - statusData.filled;
          setCurrentQueuePosition(Math.max(0, position)); // Ensure non-negative
        }

        // Check if allocated
        if (statusData.status !== 'pending' && statusData.status !== '') {
          setIsAllocated(true);
          // Stop polling when allocated
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };

    // Initial poll
    pollStatus();

    // Set up polling interval (every 2.5 seconds to respect 50/min rate limit)
    // 50 requests/min = ~1.2 seconds between requests, so 2.5s is safe
    pollingIntervalRef.current = setInterval(pollStatus, 2500);

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [sportType]);

  // Rotate quotes
  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 25000);

    return () => clearInterval(quoteInterval);
  }, [quotes.length]);

  const handleGoHome = () => {
    navigate('/select');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const queueNo = registrationDataRef.current?.queue_no ?? 0;
  const backgroundImage = sportType === SportType.GYM ? Gym : Swim;
  const gradientClass = sportType === SportType.GYM ? COLORS.GYM.gradient : COLORS.SWIM.gradient;

  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden">
      {/* Background with image and gradient overlay - same as SlotSelectionScreen */}
      <div className="absolute inset-0 bg-gray-900">
        <img
          src={backgroundImage}
          alt={`${sportType} Background`}
          className="w-full h-full object-cover opacity-40"
        />
        <div className={`absolute inset-0 bg-linear-to-br ${gradientClass} opacity-80 mix-blend-multiply`} />
      </div>

      <Header isLoggedIn={true} onLogout={handleLogout} variant="dark" />

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-4">
        <div className="w-full max-w-3xl">
          {isAllocated ? (
            /* ALLOCATED STATE */
            <div className="flex flex-col items-center">
              {/* Success Animation */}
              <div className="mb-4">
                <div className="relative w-32 h-32 sm:w-36 sm:h-36">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: theme.primary }} />
                  <div
                    className="relative w-full h-full rounded-full flex items-center justify-center shadow-2xl"
                    style={{ backgroundColor: theme.light }}
                  >
                    <Sparkles size={56} fill={theme.primary} style={{ color: theme.primary }} className="animate-bounce" />
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
                Hey {user?.name ? user.name.split(' ')[0] : ''}, You're In!
              </h1>
              <p className="text-base sm:text-lg text-white/80 font-light mb-6"></p>

              {/* Allocated Slot Card */}
              {status?.final_slot && (
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl mb-6 w-full max-w-md">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    {/* <Sparkles size={16} className="text-white/60" /> */}
                    <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
                      Your Time Slot
                    </span>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl sm:text-5xl font-black text-white">
                      {status.final_slot}
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button
                variant={sportType === SportType.GYM ? 'solid-orange' : 'solid-teal'}
                onClick={handleGoHome}
                className="shadow-2xl hover:scale-105 transition-transform"
              >
                Continue
              </Button>
            </div>
          ) : (
            /* WAITING STATE */
            <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
              {/* Left: Animation + Status */}
              <div className="flex flex-col items-center lg:w-1/2">
                {/* Animation */}
                <div className="w-36 h-36 sm:w-40 sm:h-40 mb-4">
                  {sportType === SportType.SWIMMING ? (
                    // SWIMMING ANIMATION
                    <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="4" strokeDasharray="565" strokeDashoffset="565">
                        <animate attributeName="stroke-dashoffset" from="565" to="0" dur="2s" repeatCount="indefinite" />
                      </circle>
                      <path
                        d="M 40 100 Q 70 60 100 100 T 160 100"
                        fill="none"
                        stroke="rgba(255,255,255,0.9)"
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
                    <svg width="100%" height="100%" viewBox="0 0 200 200" className="overflow-visible">
                      <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="4" />
                      <g>
                        <line x1="40" y1="100" x2="160" y2="100" stroke="rgba(255,255,255,0.9)" strokeWidth="6" strokeLinecap="round" />
                        <rect x="30" y="80" width="10" height="40" rx="2" fill="rgba(255,255,255,0.9)" />
                        <rect x="42" y="85" width="6" height="30" rx="1" fill="rgba(255,255,255,0.9)" />
                        <rect x="160" y="80" width="10" height="40" rx="2" fill="rgba(255,255,255,0.9)" />
                        <rect x="152" y="85" width="6" height="30" rx="1" fill="rgba(255,255,255,0.9)" />
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

                {/* Status Message */}
                <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-1">
                  {loading ? 'Checking Status' : 'Allocation in Progress'}
                </h2>
                <p className="text-sm sm:text-base text-white/70 font-light text-center">
                  Hold tight, we're processing
                </p>
              </div>

              {/* Right: Queue Info + Quote */}
              <div className="flex flex-col gap-4 lg:w-1/2 w-full max-w-md">
                {/* Queue Info Card - Only show if we have queue data */}
                {queueNo > 0 && (
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-5 shadow-2xl">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Queue Number */}
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                          {/* <Users size={14} className="text-white/50" /> */}
                          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Queue No.
                          </span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-black text-white">
                          {queueNo}
                        </div>
                      </div>

                      {/* Current Position */}
                      <div className="text-center border-l border-white/20">
                        <div className="flex items-center justify-center gap-1.5 mb-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                          <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
                            Position
                          </span>
                        </div>
                        <div className="text-4xl sm:text-5xl font-black" style={{ color: theme.primary }}>
                          {currentQueuePosition ?? queueNo}
                        </div>
                        {currentQueuePosition !== null && currentQueuePosition < queueNo && (
                          <p className="text-xs text-green-400 mt-1 font-medium">
                            Moving up ↑
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Quote Card */}
                <div className="bg-white/5 backdrop-blur-md rounded-4xl border p-4 flex items-center justify-center min-h-[40px]">
                  <p className="text-sm sm:text-base text-white/90 italic text-center font-light leading-relaxed">
                    "{quotes[quoteIndex]}"
                  </p>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50/90 backdrop-blur-sm border border-red-200 text-red-700 p-4 rounded-xl">
                    <p className="text-sm font-medium">{error}</p>
                  </div>
                )}

                {/* Action Button */}
                <div className="flex justify-center">
                  <Button
                    variant={sportType === SportType.GYM ? 'solid-orange' : 'solid-teal'}
                    onClick={handleGoHome}
                    className="shadow-2xl hover:scale-105 transition-transform"
                  >
                    Go Home
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;

