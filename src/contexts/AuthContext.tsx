import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { API_BASE_URL, DAUTH_CONFIG } from '../config';

interface User {
  roll_no: string;
  name: string;
  gender: string;
  batch: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/me`, { credentials: 'include' });
      if (!res.ok) throw new Error();
      const userData = await res.json();
      setUser(userData);
      setLoggedIn(true);
    } catch {
      setUser(null);
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    const params = new URLSearchParams({
      client_id: DAUTH_CONFIG.clientId,
      redirect_uri: DAUTH_CONFIG.redirectUri,
      response_type: 'code',
      grant_type: 'authorization_code',
      scope: 'openid email profile user',
      state: crypto.randomUUID(),
      nonce: crypto.randomUUID(),
    });

    window.location.href = `${DAUTH_CONFIG.authorizeUrl}?${params.toString()}`;
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clear server-side session
      await fetch(`${API_BASE_URL}/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      // Even if logout fails, clear local state
      console.error('Logout error:', err);
    } finally {
      // Clear local state regardless of API call result
      setUser(null);
      setLoggedIn(false);
      // Clear sessionStorage
      sessionStorage.removeItem('preferences');
      sessionStorage.removeItem('registration');
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loggedIn, login, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

