import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const u = localStorage.getItem('user');
      return u ? JSON.parse(u) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function refresh() {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await api.get('/auth/me');
        setUser(res.data.user);
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } catch {
        logout();
      }
    }
    refresh();
  }, []);

  async function login({ email, password }) {
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setLoading(false);
      return { ok: true, user };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err?.response?.data?.message || 'Login failed' };
    }
  }

  async function register({ name, email, password, role }) {
    setLoading(true);
    try {
      const res = await api.post('/auth/register', { name, email, password, role });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      setLoading(false);
      return { ok: true, user };
    } catch (err) {
      setLoading(false);
      return { ok: false, message: err?.response?.data?.message || 'Register failed' };
    }
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  }

  const value = { user, loading, login, register, logout, isAuthenticated: !!user };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;