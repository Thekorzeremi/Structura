import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { decodeToken } from '../security/TokenUtils';
import { useNavigate } from 'react-router-dom';

interface User {
  firstName: string;
  lastName: string;
  job: string | null;
  roles: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  user: User | null;
  roles: string[];
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      login(storedToken);
    }
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = decodeToken(newToken);
      if (!decoded) {
        throw new Error('Invalid token');
      }
      
      const userData: User = {
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        job: decoded.job,
        roles: decoded.roles || []
      };

      setUser(userData);
      setRoles(decoded.roles || []);
      setToken(newToken);
      setIsAuthenticated(true);
      localStorage.setItem('token', newToken);
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      navigate('/');
    } catch (error) {
      console.error('Invalid token:', error);
      logout();
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setToken(null);
    setRoles([]);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('rememberMe');
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, token, user, roles, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
