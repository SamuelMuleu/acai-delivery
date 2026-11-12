import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { api, TOKEN_KEY } from './api/api';

interface User {
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

const EXPIRES_KEY = 'acai:admin-token-expires';
const ADMIN: User = { name: 'Admin', isAdmin: true };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRES_KEY);
    localStorage.removeItem('user'); // legacy key from the old mock login
    setUser(null);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expires = Number(localStorage.getItem(EXPIRES_KEY));
    if (token && expires > Date.now()) setUser(ADMIN);
    else logout();
    setLoading(false);

    // The server rejected the token (expired or revoked): sign out
    const id = api.interceptors.response.use(undefined, (error) => {
      if (error?.response?.status === 401 && localStorage.getItem(TOKEN_KEY)) logout();
      return Promise.reject(error);
    });
    return () => api.interceptors.response.eject(id);
  }, [logout]);

  // Credentials are checked by the API; nothing secret lives in the front-end
  const login = async (password: string) => {
    const { data } = await api.post<{ token: string; expiresIn: number }>('/auth/login', { password });
    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(EXPIRES_KEY, String(Date.now() + data.expiresIn * 1000));
    setUser(ADMIN);
  };

  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
