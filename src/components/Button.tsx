import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'glass' | 'solid-teal' | 'solid-orange';
    fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    fullWidth = false,
    className = '',
    ...props
}) => {
    const baseStyles = "relative px-8 py-3 rounded-full font-semibold transition-all duration-300 transform active:scale-95 flex items-center justify-center gap-2 overflow-hidden group cursor-pointer";

    const variants = {
        primary: "bg-white text-gray-900 hover:bg-gray-100 shadow-lg hover:shadow-xl",
        glass: "glass-button text-white hover:bg-white/30 border border-white/40",
        'solid-teal': "bg-[#006D77] text-white hover:bg-[#005a63] shadow-lg shadow-[#006D77]/30",
        'solid-orange': "bg-[#CA4E00] text-white hover:bg-[#a84100] shadow-lg shadow-[#CA4E00]/30",
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
            {...props}
        >
            <span className="relative z-10 flex justify-center items-stretch gap-2">{children}</span>
            {/* Simple glow effect on hover */}
            <div className="absolute inset-0 rounded-full bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
};

export default Button;
