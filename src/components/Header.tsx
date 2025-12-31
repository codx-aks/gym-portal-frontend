import React from 'react';

interface HeaderProps {
    isLoggedIn: boolean;
    onLogin?: () => void;
    onLogout?: () => void;
    variant?: 'light' | 'dark'; // 'light' for dark text on light bg, 'dark' for white text on dark bg
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, onLogin, onLogout, variant = 'light' }) => {
    const textColor = variant === 'dark' ? 'text-white' : 'text-gray-900';

    // Glass morphism styles based on variant
    const glassStyles = variant === 'dark'
        ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg'
        : 'bg-white/80 backdrop-blur-md border border-white/30 shadow-lg';

    return (
        <header
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 w-[calc(94%)] px-6 py-3 flex justify-between items-center z-50 ${glassStyles} rounded-4xl`}
            style={{
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
            }}
        >
            <div className={`${textColor} font-bold tracking-wider text-xl uppercase`}>
                SPORTS COUNCIL
            </div>
            <button
                onClick={isLoggedIn ? onLogout : onLogin}
                className={`${textColor} font-semibold tracking-wider uppercase hover:opacity-80 transition-opacity px-4 py-2 rounded-4xl cursor-pointer hover:bg-black/5 ${variant === 'dark' ? 'hover:bg-white/10' : ''}`}
            >
                {isLoggedIn ? 'LOGOUT' : 'LOGIN'}
            </button>
        </header>
    );
};

export default Header;