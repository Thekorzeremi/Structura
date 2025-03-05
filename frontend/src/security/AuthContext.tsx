import React, { createContext, useContext, useState, useEffect } from 'react';
import { decodeToken } from './TokenUtils';

interface User {
  isAuthenticated: boolean;
  roles: string[];
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (decoded && decoded.exp * 1000 > Date.now()) {
        return {
          isAuthenticated: true,
          roles: decoded.roles,
          token
        };
      }
      localStorage.removeItem('token');
    }
    return null;
  });

  const login = (token: string) => {
    const decoded = decodeToken(token);
    if (decoded && decoded.exp * 1000 > Date.now()) {
      const newUser: User = {
        isAuthenticated: true,
        roles: decoded.roles,
        token
      };
      localStorage.setItem('token', token);
      setUser(newUser);
    } else {
      console.error('Invalid or expired token');
      logout();
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = decodeToken(token);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        logout();
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
