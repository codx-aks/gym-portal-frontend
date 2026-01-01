import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GripVertical, Clock } from 'lucide-react';
import { SportType } from '../../types.ts';
import type { TimeSlot, GymSlot, SwimSlot, RegistrationResponse } from '../../types.ts';
import { COLORS } from '../../constants.ts';
import { API_BASE_URL } from '../config.ts';
import Button from './Button';
import Header from './Header';
import Gym from '../assets/gym.jpg';
import Swim from '../assets/swim.jpeg';
import { useAuth } from '../contexts/AuthContext.tsx';

const SlotSelectionScreen: React.FC = () => {
    const { sport: sportParam } = useParams<{ sport: string }>();
    const navigate = useNavigate();
    const { logout } = useAuth();

    const sport = sportParam?.toUpperCase() === 'SWIMMING' ? SportType.SWIMMING : SportType.GYM;

    const [slots, setSlots] = useState<TimeSlot[]>([]);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const theme = COLORS[sport === SportType.GYM ? 'GYM' : 'SWIM'];

    // Helper function to calculate availability
    const calculateAvailability = (filled: number, capacity: number): 'HIGH' | 'MEDIUM' | 'LOW' => {
        const ratio = filled / capacity;
        if (ratio < 0.5) return 'HIGH';
        if (ratio < 0.8) return 'MEDIUM';
        return 'LOW';
    };

    // Convert API response to TimeSlot format
    const convertGymSlot = (slot: GymSlot): TimeSlot => ({
        id: slot.id,
        timeRange: slot.timings,
        availability: calculateAvailability(slot.filled, slot.capacity),
        capacity: slot.capacity,
        filled: slot.filled,
    });

    const convertSwimSlot = (slot: SwimSlot): TimeSlot => ({
        id: slot.id,
        timeRange: slot.timings,
        availability: calculateAvailability(slot.filled, slot.capacity),
        capacity: slot.capacity,
        filled: slot.filled,
        days: slot.days,
    });

    // Fetch slots from API
    useEffect(() => {
        const fetchSlots = async () => {
            setLoading(true);
            setError(null);

            try {
                const endpoint = sport === SportType.GYM
                    ? `${API_BASE_URL}/get/gymslots`
                    : `${API_BASE_URL}/get/swimslots`;

                const response = await fetch(endpoint, {
                    credentials: 'include',
                });

                if (!response.ok) {
                    if (response.status === 503) {
                        throw new Error('Service currently unavailable - stay tuned');
                    }
                    if (response.status === 417) {
                        throw new Error('No slots available');
                    }
                    throw new Error('Failed to fetch slots');
                }

                const data = await response.json();

                if (sport === SportType.GYM) {
                    const gymSlots = data as GymSlot[];
                    setSlots(gymSlots.map(convertGymSlot));
                } else {
                    const swimSlots = data as SwimSlot[];
                    setSlots(swimSlots.map(convertSwimSlot));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchSlots();
    }, [sport]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSubmit = async () => {
        if (slots.length === 0) return;

        setSubmitting(true);
        setSubmitError(null);

        try {
            // Extract slot IDs in priority order (as they appear in the array)
            const priorities = slots.map(slot => slot.id);

            const endpoint = sport === SportType.GYM
                ? `${API_BASE_URL}/register/gym`
                : `${API_BASE_URL}/register/swim`;

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ priorities }),
            });

            if (!response.ok) {
                let errorMessage = 'Failed to submit registration';

                if (response.status === 503) {
                    errorMessage = 'Service currently unavailable - stay tuned';
                } else if (response.status === 417) {
                    errorMessage = 'Registration queue limit reached';
                } else if (response.status === 409) {
                    errorMessage = 'You have already registered';
                } else if (response.status === 400) {
                    const errorText = await response.text();
                    errorMessage = errorText || 'Invalid slot priorities';
                } else if (response.status === 500) {
                    errorMessage = 'Server error. Please try again later';
                }

                throw new Error(errorMessage);
            }

            const registrationData: RegistrationResponse = await response.json();

            // Store preferences and registration data in sessionStorage
            sessionStorage.setItem('preferences', JSON.stringify({
                sport,
                rankedSlots: slots,
            }));
            sessionStorage.setItem('registration', JSON.stringify(registrationData));

            // Navigate directly to success screen for status polling
            navigate(`/success/${sport.toLowerCase()}`);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : 'An error occurred during registration');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        setDraggedItemIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";

        if (draggedItemIndex === null) return;
        if (draggedItemIndex === index) return;

        const newSlots = [...slots];
        const draggedItem = newSlots[draggedItemIndex];
        newSlots.splice(draggedItemIndex, 1);
        newSlots.splice(index, 0, draggedItem);

        setSlots(newSlots);
        setDraggedItemIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItemIndex(null);
    };

    const backgroundImage = sport === SportType.GYM ? Gym : Swim;
    const gradientClass = sport === SportType.GYM ? COLORS.GYM.gradient : COLORS.SWIM.gradient;

    return (
        <div className="w-full h-screen flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-gray-900">
                <img
                    src={backgroundImage}
                    alt={`${sport} Background`}
                    className="w-full h-full object-cover opacity-40"
                />
                <div className={`absolute inset-0 bg-linear-to-br ${gradientClass} opacity-80 mix-blend-multiply`} />
            </div>

            <Header isLoggedIn={true} onLogout={handleLogout} variant="dark" />

            <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-32 mt-24">
                <div className="max-w-2xl mx-auto space-y-3">
                    {loading && (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-white text-lg">Loading slots...</p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-500/90 text-white p-4 rounded-xl mb-4">
                            <p className="font-semibold">{error}</p>
                        </div>
                    )}

                    {submitError && (
                        <div className="bg-red-500/90 text-white p-4 rounded-xl mb-4">
                            <p className="font-semibold">{submitError}</p>
                        </div>
                    )}

                    {!loading && !error && slots.length === 0 && (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-white text-lg">No slots available</p>
                        </div>
                    )}

                    {!loading && !error && slots.map((slot, index) => (
                        <div
                            key={slot.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`
                        relative bg-white rounded-xl p-4 flex items-center gap-4 border border-transparent transition-all duration-200 select-none
                        ${draggedItemIndex === index ? 'opacity-50 scale-95 shadow-none ring-2 ring-blue-400' : 'shadow-sm hover:shadow-md hover:border-gray-200'}
                    `}
                            style={{ cursor: 'grab' }}
                        >
                            <div className="flex items-center gap-3 pr-4 border-r border-gray-100">
                                <div className="cursor-grab text-gray-300 hover:text-gray-900 active:cursor-grabbing">
                                    <GripVertical size={20} />
                                </div>
                                <span
                                    className="text-2xl font-black tabular-nums"
                                    style={{ color: index === 0 ? theme.primary : '#374151' }}
                                >
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <Clock size={16} className="text-gray-400" />
                                    <h3 className="text-lg font-bold text-gray-900">{slot.timeRange}</h3>
                                </div>
                                {sport === SportType.SWIMMING && slot.days && (
                                    <div className="mb-1">
                                        <span className="text-sm text-gray-600 font-medium">{slot.days}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <span className={`inline-block w-2 h-2 rounded-full ${slot.availability === 'HIGH' ? 'bg-green-500' :
                                        slot.availability === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />
                                    <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
                                        {slot.availability === 'HIGH' ? 'High Availability' :
                                            slot.availability === 'MEDIUM' ? 'Filling Fast' : 'Limited Spots'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        ({slot.filled}/{slot.capacity} filled)
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black/80 via-black/60 to-transparent z-20">
                <div className="max-w-2xl mx-auto">
                    <Button
                        variant={sport === SportType.GYM ? 'solid-orange' : 'solid-teal'}
                        fullWidth
                        onClick={handleSubmit}
                        className="py-4 text-lg"
                        disabled={loading || error !== null || slots.length === 0 || submitting}
                    >
                        {submitting ? 'SUBMITTING...' : 'SUBMIT PREFERENCES'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SlotSelectionScreen;
