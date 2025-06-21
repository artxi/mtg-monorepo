// src/auth/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as authApi from '../api/auth';

const API_URL = process.env.REACT_APP_API_URL;

interface UserProfile {
  email: string;
  displayName: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile> & { password?: string }) => Promise<{ message?: string } | undefined>;
  getRandomDisplayName: () => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const fetchProfile = async (jwt: string) => {
    const res = await fetch(`${API_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  };

  const login = async (email: string, password: string) => {
    const data = await authApi.login(email, password);
    setToken(data.token); // Use 'token' instead of 'access_token'
    localStorage.setItem('token', data.token);
    const profile = await fetchProfile(data.token);
    setUser(profile);
    localStorage.setItem('user', JSON.stringify(profile));
  };

  const register = async (email: string, password: string) => {
    await authApi.register(email, password);
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateProfile = async (updates: Partial<UserProfile> & { password?: string }) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/auth/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updates),
    });
    const result = await res.json();
    if (res.ok) {
      setUser(result);
      localStorage.setItem('user', JSON.stringify(result));
    }
    return result;
  };

  const getRandomDisplayName = async () => {
    if (!token) return '';
    const res = await fetch(`${API_URL}/auth/random-display-name`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return '';
    const data = await res.json();
    return data.displayName || '';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, updateProfile, getRandomDisplayName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
