import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContextType, User } from '../types/auth';
import { authApi } from '../api/authApi';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => 
    localStorage.getItem('token')
  );
  const navigate = useNavigate();

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchUserData = useCallback(async (authToken: string) => {
    try {
      const userData = await authApi.getCurrentUser(authToken);
      setUser(userData);
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken && !user) {
      fetchUserData(savedToken);
    }
  }, [fetchUserData, user]);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { access_token } = response;
      setToken(access_token);
      localStorage.setItem('token', access_token);
      await fetchUserData(access_token);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const hasRole = (role: string): boolean => {
    return user?.roles.includes(role) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};