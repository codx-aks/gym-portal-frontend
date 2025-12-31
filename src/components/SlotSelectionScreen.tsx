import React, { useState } from 'react';
import { GripVertical, Clock, Activity, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { SportType } from '../../types.ts';
import type { TimeSlot } from '../../types.ts';
import { COLORS } from '../../constants.ts';
import Button from './Button';
import Header from './Header';
import Gym from '../assets/gym.jpg';
import Swim from '../assets/swim.jpeg';

interface SlotSelectionScreenProps {
    sport: SportType;
    initialSlots: TimeSlot[];
    onBack: () => void;
    onSubmit: (rankedSlots: TimeSlot[]) => void;
    onLogout?: () => void;
}

const SlotSelectionScreen: React.FC<SlotSelectionScreenProps> = ({ sport, initialSlots, onBack, onSubmit, onLogout }) => {
    const [slots, setSlots] = useState(initialSlots);
    const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

    const theme = COLORS[sport === SportType.GYM ? 'GYM' : 'SWIM'];

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

            <Header isLoggedIn={true} onLogout={onLogout} variant="dark" />

            {/* <button onClick={onBack} className="p-2 rounded-full hover:bg-white/20 hover:text-white transition-colors z-50 absolute top-30 left-0 text-white cursor-pointer border border-white/40">
                <ArrowLeft size={20} />
            </button> */}

            <div className="relative z-10 flex-1 overflow-y-auto p-4 pb-32 mt-24">
                <div className="max-w-2xl mx-auto space-y-3">
                    {slots.map((slot, index) => (
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
                                <div className="flex items-center gap-2">
                                    <span className={`inline-block w-2 h-2 rounded-full ${slot.availability === 'HIGH' ? 'bg-green-500' :
                                        slot.availability === 'MEDIUM' ? 'bg-yellow-500' : 'bg-red-500'
                                        }`} />
                                    <span className="text-xs font-semibold text-gray-800 uppercase tracking-wide">
                                        {slot.availability === 'HIGH' ? 'High Availability' :
                                            slot.availability === 'MEDIUM' ? 'Filling Fast' : 'Limited Spots'}
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
                        onClick={() => onSubmit(slots)}
                        className="py-4 text-lg"
                    >
                        SUBMIT PREFERENCES
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SlotSelectionScreen;
