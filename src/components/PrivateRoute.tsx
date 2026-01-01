import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { loggedIn, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-white">
        <p className="text-gray-600">Loading…</p>
      </div>
    );
  }

  if (!loggedIn) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;

