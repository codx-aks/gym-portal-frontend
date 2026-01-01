import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Waves, ChevronRight, BicepsFlexed } from 'lucide-react';
import { SportType } from '../../types.ts';
import { COLORS } from '../../constants.ts';
import { API_BASE_URL } from '../config.ts';
import type { StatusResponse } from '../../types.ts';
import Header from './Header';
import Gym from '../assets/gym.jpg';
import Swim from '../assets/swim.jpeg';
import { useAuth } from '../contexts/AuthContext.tsx';

const SelectionScreen: React.FC = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [hovered, setHovered] = useState<SportType | null>(null);
    const [gymStatus, setGymStatus] = useState<StatusResponse | null>(null);
    const [swimStatus, setSwimStatus] = useState<StatusResponse | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(true);

    // Check status for both sports on mount
    useEffect(() => {
        const checkStatuses = async () => {
            try {
                // Check gym status
                const gymResponse = await fetch(`${API_BASE_URL}/status/gymslot`, {
                    credentials: 'include',
                });
                if (gymResponse.ok) {
                    const gymData: StatusResponse = await gymResponse.json();
                    // If status exists (not empty), user has registered
                    if (gymData.status !== '' || gymData.final_slot) {
                        setGymStatus(gymData);
                    }
                }

                // Check swim status
                const swimResponse = await fetch(`${API_BASE_URL}/status/swimslot`, {
                    credentials: 'include',
                });
                if (swimResponse.ok) {
                    const swimData: StatusResponse = await swimResponse.json();
                    // If status exists (not empty), user has registered
                    if (swimData.status !== '' || swimData.final_slot) {
                        setSwimStatus(swimData);
                    }
                }
            } catch (err) {
                // Silently fail - user might not have registered yet
                console.error('Error checking status:', err);
            } finally {
                setLoadingStatus(false);
            }
        };

        checkStatuses();
    }, []);

    const handleSelectSport = (sport: SportType) => {
        // Check if user has status (allocated or pending) for this sport
        const status = sport === SportType.GYM ? gymStatus : swimStatus;
        
        if (status && (status.status !== '' || status.final_slot)) {
            // Navigate to success screen if allocated or pending
            navigate(`/success/${sport.toLowerCase()}`);
        } else {
            // Navigate to slot selection if not registered
            navigate(`/slots/${sport.toLowerCase()}`);
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="relative w-full h-screen flex flex-col overflow-hidden">
            <Header isLoggedIn={true} onLogout={handleLogout} variant="dark" />
            <div className="w-full h-screen flex flex-col bg-gray-50 overflow-hidden">

                <div className="flex-1 flex flex-col md:flex-row relative">
                    <div
                        className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out overflow-hidden group ${hovered === SportType.SWIMMING ? 'flex-[0.8]' : 'flex-1'}`}
                        onMouseEnter={() => setHovered(SportType.GYM)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleSelectSport(SportType.GYM)}
                    >
                        <div className="absolute inset-0 bg-gray-900">
                            <img
                                src={Gym}
                                alt="Gym Background"
                                className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-linear-to-br ${COLORS.GYM.gradient} opacity-80 mix-blend-multiply transition-opacity duration-500`} />
                            <div className={`absolute inset-0 bg-[#CA4E00] opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`} />
                        </div>

                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 p-6 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md">
                                <BicepsFlexed size={64} className="text-white" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">GYM</h1>

                            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                <span className="flex items-center text-white font-bold uppercase tracking-widest border-b-2 border-white pb-1 text-lg">
                                    {gymStatus && (gymStatus.status !== '' || gymStatus.final_slot) 
                                        ? 'Check Allocation' 
                                        : 'Select Slot Preferences'} <ChevronRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-[2px] bg-white/20 z-10 transform -skew-x-12 origin-top h-[120%] -translate-y-10 pointer-events-none"></div>

                    <div
                        className={`relative flex-1 cursor-pointer transition-all duration-700 ease-out overflow-hidden group ${hovered === SportType.GYM ? 'flex-[0.8]' : 'flex-1'}`}
                        onMouseEnter={() => setHovered(SportType.SWIMMING)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => handleSelectSport(SportType.SWIMMING)}
                    >
                        <div className="absolute inset-0 bg-gray-900">
                            <img
                                src={Swim}
                                alt="Swim Background"
                                className="w-full h-full object-cover opacity-40 transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className={`absolute inset-0 bg-linear-to-br ${COLORS.SWIM.gradient} opacity-80 mix-blend-multiply transition-opacity duration-500`} />
                            <div className={`absolute inset-0 bg-[#0da6b4] opacity-0 group-hover:opacity-30 transition-opacity duration-500 mix-blend-overlay`} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-8">
                            <div className="mb-6 transform group-hover:scale-110 transition-transform duration-500 p-6 rounded-full border-2 border-white/20 bg-white/10 backdrop-blur-md">
                                <Waves size={64} className="text-white" strokeWidth={1.5} />
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-4">SWIMMING<br />POOL</h1>

                            <div className="mt-8 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200">
                                <span className="flex items-center text-white font-bold uppercase tracking-widest text-lg border-b-2 border-white pb-1">
                                    {swimStatus && (swimStatus.status !== '' || swimStatus.final_slot) 
                                        ? 'Check Allocation' 
                                        : 'Select Slot Preferences'} <ChevronRight size={16} className="ml-2" />
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default SelectionScreen;
