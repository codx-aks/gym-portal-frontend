import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingScreen from './components/LandingScreen.tsx';
import SelectionScreen from './components/SelectionScreen.tsx';
import SlotSelectionScreen from './components/SlotSelectionScreen.tsx';
import SuccessScreen from './components/SuccessScreen.tsx';
import Callback from './components/Callback.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import Metrics from './components/metrics.tsx';

const App: React.FC = () => {
  return (
    <div className="antialiased text-slate-800 bg-white min-h-screen font-sans selection:bg-teal-100 selection:text-teal-900">
      <Routes>
        <Route path="/" element={<LandingScreen />} />
        <Route path="/callback" element={<Callback />} />
        <Route
          path="/select"
          element={
            <PrivateRoute>
              <SelectionScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/slots/:sport"
          element={
            <PrivateRoute>
              <SlotSelectionScreen />
            </PrivateRoute>
          }
        />
        <Route
          path="/success/:sport"
          element={
            <PrivateRoute>
              <SuccessScreen />
            </PrivateRoute>
          }
        />
        <Route 
          path="/metrics"
          element={
            <PrivateRoute>
              <Metrics />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;
