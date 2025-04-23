import { useState } from 'react';
import { login, register } from '../services/authService';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async (email, password) => {
    try {
      const data = await login(email, password);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      return false;
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const data = await register(email, password);
      setUser(data.user);
      localStorage.setItem('token', data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrarse');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, error, login: handleLogin, register: handleRegister, logout };
};