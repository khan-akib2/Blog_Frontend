'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/services/api';

const AuthContext = createContext(null);

// sessionStorage is tab-isolated, so logging out in one tab won't affect others
const USER_TOKEN_KEY = 'user_token';
const ADMIN_TOKEN_KEY = 'admin_token';

function getStoredToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(USER_TOKEN_KEY) || sessionStorage.getItem(ADMIN_TOKEN_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      api.get('/auth/me')
        .then(({ data }) => setUser(data.user))
        .catch(() => {
          sessionStorage.removeItem(USER_TOKEN_KEY);
          sessionStorage.removeItem(ADMIN_TOKEN_KEY);
          delete api.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    const key = data.user.role === 'admin' ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY;
    sessionStorage.setItem(key, data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const { data } = await api.post('/auth/register', { name, email, password });
    // Registration no longer returns a token — email verification required
    return data;
  };

  const googleLogin = async (credential) => {
    const { data } = await api.post('/auth/google', { credential });
    const key = data.user.role === 'admin' ? ADMIN_TOKEN_KEY : USER_TOKEN_KEY;
    sessionStorage.setItem(key, data.token);
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    sessionStorage.removeItem(USER_TOKEN_KEY);
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
