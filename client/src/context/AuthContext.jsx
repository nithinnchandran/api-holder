import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const res = await api.get('/auth/profile');
          setUser(res.data.data);
        }
      } catch (err) {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password) => {
    try {
      setError(null);
      const res = await api.post('/auth/register', { name, email, password });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.get('/auth/logout');
      localStorage.removeItem('token');
      setUser(null);
    } catch (err) {
      console.error(err);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const res = await api.put('/auth/profile', profileData);
      setUser(res.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
      return false;
    }
  };

  const updateProfilePhoto = async (file) => {
    try {
      setError(null);
      const formData = new FormData();
      formData.append('photo', file);
      const res = await api.put('/auth/profile/photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUser(res.data.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile photo');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile, updateProfilePhoto }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
