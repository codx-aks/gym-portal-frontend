import React from 'react';
import { Lock } from 'lucide-react';
import Button from './Button';
import Header from './Header';
import Gym from '../assets/gym.jpg';
import Swim from '../assets/swim.jpeg';
import { COLORS } from '../../constants.ts';
import Run from '../assets/run.png';

interface LandingScreenProps {
    onLogin: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onLogin }) => {
    return (
        <>
            <Header isLoggedIn={false} onLogin={onLogin} variant="dark" />
            <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gray-900" style={{ clipPath: 'polygon(0 0, 55% 0, 35% 100%, 0% 100%)' }}>
                    <img
                        src={Gym}
                        alt="Gym Background"
                        className="h-full opacity-40"
                    />
                    <div className={`absolute inset-0 bg-linear-to-br ${COLORS.GYM.gradient} opacity-80 mix-blend-multiply`} />
                </div>

                <div className="absolute inset-0 bg-gray-900" style={{ clipPath: 'polygon(55% 0, 100% 0, 100% 100%, 35% 100%)' }}>
                    <img
                        src={Swim}
                        alt="Swim Background"
                        className="w-full h-full object-cover opacity-40"
                    />
                    <div className={`absolute inset-0 bg-linear-to-br ${COLORS.SWIM.gradient} opacity-80 mix-blend-multiply`} />
                </div>

                <div className="absolute top-20 left-10 opacity-30 pointer-events-none z-10">
                    <h1 className="text-[12rem] font-black text-white leading-none tracking-tighter">GYM</h1>
                </div>
                <div className="absolute bottom-10 right-10 opacity-30 pointer-events-none z-10">
                    <h1 className="text-[12rem] font-black text-white leading-none tracking-tighter">SWIM</h1>
                </div>

                <img src={Run} alt="Run" className="absolute mx-auto w-[40%] h-auto object-cover z-10" />
            </div >
        </>
    );
};

export default LandingScreen;
