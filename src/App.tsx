import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen.tsx';
import SelectionScreen from './components/SelectionScreen.tsx';
import SlotSelectionScreen from './components/SlotSelectionScreen.tsx';
import SubmissionScreen from './components/SubmissionScreen.tsx';
import { ScreenState, SportType } from '../types.ts';
import type { UserPreferences, TimeSlot } from '../types.ts';
import { INITIAL_SLOTS_GYM, INITIAL_SLOTS_SWIM, COLORS } from '../constants.ts';
import { CheckCircle } from 'lucide-react';
import Button from './components/Button.tsx';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenState>(ScreenState.LANDING);
  const [preferences, setPreferences] = useState<UserPreferences>({
    sport: null,
    rankedSlots: [],
  });

  // State Transition Handlers
  const handleLogin = () => {
    setCurrentScreen(ScreenState.SPORT_SELECTION);
  };

  const handleSelectSport = (sport: SportType) => {
    setPreferences(prev => ({ ...prev, sport }));
    setCurrentScreen(ScreenState.SLOT_SELECTION);
  };

  const handleBackToSport = () => {
    setCurrentScreen(ScreenState.SPORT_SELECTION);
    setPreferences(prev => ({ ...prev, sport: null }));
  };

  const handleSubmitSlots = (rankedSlots: TimeSlot[]) => {
    setPreferences(prev => ({ ...prev, rankedSlots }));
    setCurrentScreen(ScreenState.SUBMISSION);
  };

  const handleFinish = () => {
    setCurrentScreen(ScreenState.SUCCESS);
  };

  const handleReset = () => {
    setCurrentScreen(ScreenState.LANDING);
    setPreferences({ sport: null, rankedSlots: [] });
  };

  const handleLogout = () => {
    setCurrentScreen(ScreenState.LANDING);
    setPreferences({ sport: null, rankedSlots: [] });
  };

  // Render Logic
  const renderScreen = () => {
    switch (currentScreen) {
      case ScreenState.LANDING:
        return <LandingScreen onLogin={handleLogin} />;

      case ScreenState.SPORT_SELECTION:
        return <SelectionScreen onSelectSport={handleSelectSport} onLogout={handleLogout} />;

      case ScreenState.SLOT_SELECTION:
        return (
          <SlotSelectionScreen
            sport={preferences.sport!}
            initialSlots={preferences.sport === SportType.GYM ? INITIAL_SLOTS_GYM : INITIAL_SLOTS_SWIM}
            onBack={handleBackToSport}
            onSubmit={handleSubmitSlots}
            onLogout={handleLogout}
          />
        );

      case ScreenState.SUBMISSION:
        return (
          <SubmissionScreen
            sport={preferences.sport!}
            onFinish={handleFinish}
            onLogout={handleLogout}
          />
        );

      case ScreenState.SUCCESS:
        const theme = preferences.sport === SportType.GYM ? COLORS.GYM : COLORS.SWIM;
        return (
          <div className="w-full h-screen flex flex-col items-center justify-center bg-white text-center p-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-[pulse-glow_2s_ease-in-out]"
              style={{ backgroundColor: theme.light }}
            >
              <CheckCircle size={48} style={{ color: theme.primary }} />
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4 uppercase">You're In!</h1>
            <p className="text-gray-600 max-w-md mb-8">
              Your preferences have been recorded. You will receive a confirmation email shortly with your allocated slot.
            </p>
            <div className="bg-gray-50 p-6 rounded-2xl w-full max-w-sm mb-8 border border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Top Choice</h3>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-800">{preferences.rankedSlots[0]?.timeRange}</span>
                <span className="text-sm font-medium" style={{ color: theme.primary }}>{preferences.sport}</span>
              </div>
            </div>
            <Button variant={preferences.sport === SportType.GYM ? 'solid-orange' : 'solid-teal'} onClick={handleReset}>
              Done
            </Button>
          </div>
        );

      default:
        return <div>Error: Unknown state</div>;
    }
  };

  return (
    <div className="antialiased text-slate-800 bg-white min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
      {renderScreen()}
    </div>
  );
};

export default App;
