import React, { createContext, useState, useEffect } from 'react';
import api from '../api/axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user_data = localStorage.getItem('user_data');
    if (user_data) {
      const { user: savedUser, token } = JSON.parse(user_data);
      if (savedUser && token) {
        setUser(savedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password });
    const { user, token } = res.data;
    localStorage.setItem('user_data', JSON.stringify({ user, token }));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };
  
  const signup = async (email, password) => {
    const res = await api.post('/api/auth/register', { email, password });
    const { user, token } = res.data;
    localStorage.setItem('user_data', JSON.stringify({ user, token }));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(user);
  };

  const googleLogin = async (credential) => {
    const res = await api.post('/api/auth/google', { credential });
    const { user: signedInUser, token } = res.data;
    localStorage.setItem('user_data', JSON.stringify({ user: signedInUser, token }));
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setUser(signedInUser);
  };

  const logout = () => {
    localStorage.removeItem('user_data');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
  };
  
  const value = { user, loading, login, signup, googleLogin, logout };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};