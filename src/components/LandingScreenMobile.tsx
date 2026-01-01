import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.tsx';
import Header from './Header';
import Gym from '../assets/gym.jpg';
import Swim from '../assets/swim.jpeg';
import { COLORS } from '../../constants.ts';
import Run from '../assets/run.png';

const LandingScreenMobile: React.FC = () => {
    const { loggedIn, loading, login } = useAuth();

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white">
                <p className="text-gray-600">Loading…</p>
            </div>
        );
    }

    if (loggedIn) {
        return <Navigate to="/select" replace />;
    }

    return (
        <>
            <Header isLoggedIn={false} onLogin={login} variant="dark" />
            <div className="relative w-full h-screen overflow-hidden flex flex-col">
                <div className="relative w-full h-1/2 bg-gray-900">
                    <img
                        src={Gym}
                        alt="Gym Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className={`absolute inset-0 bg-linear-to-br ${COLORS.GYM.gradient} opacity-80 mix-blend-multiply`} />
                    <div className="absolute top-10 left-5 opacity-30 pointer-events-none z-10">
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter mt-16">GYM</h1>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-screen">
                    <img
                        src={Run}
                        alt="Run"
                        className="w-auto h-full object-cover shadow-2xl"
                    />
                </div>

                <div className="relative w-full h-1/2 bg-gray-900">
                    <img
                        src={Swim}
                        alt="Swim Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className={`absolute inset-0 bg-linear-to-br ${COLORS.SWIM.gradient} opacity-80 mix-blend-multiply`} />
                    <div className="absolute bottom-10 right-5 opacity-30 pointer-events-none z-10">
                        <h1 className="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter">SWIM</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LandingScreenMobile;

