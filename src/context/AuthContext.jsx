import { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(() => {
    const storedToken = localStorage.getItem('token');
    return storedToken ? jwtDecode(storedToken) : null;
  });

  const register = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem('token', token);
        setToken(token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        return { success: true };
      } else {
        throw new Error(data.error || 'Error al registrar usuario');
      }
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;
        localStorage.setItem('token', token);
        setToken(token);
        const decoded = jwtDecode(token);
        setUser(decoded);
        return { success: true };
      } else {
        throw new Error(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
  };

  useEffect(() => {
    const validateToken = () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const decoded = jwtDecode(storedToken);
          setUser(decoded);
          setToken(storedToken);
        } catch (error) {
          console.error('Token inválido:', error);
          logout();
        }
      }
    };
    validateToken();
  }, []);

  return (
    <AuthContext.Provider value={{ token, user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};