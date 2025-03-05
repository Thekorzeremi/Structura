import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    isAuthenticated: true,
    roles: ['ROLE_USER'],
    token: 'fake-jwt-token',
  });

  const login = (roles = ['ROLE_USER']) => {
    setUser({
      isAuthenticated: true,
      roles,
      token: 'fake-jwt-token',
    });
  };

  const logout = () => {
    setUser({
      isAuthenticated: false,
      roles: [],
      token: null,
    });
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
