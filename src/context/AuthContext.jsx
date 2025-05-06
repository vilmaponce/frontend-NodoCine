// Versión depurada de AuthContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Función para verificar el token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('🔐 Verificando token almacenado:', token ? 'Existe' : 'No existe');
      
      if (!token) {
        console.log('🔒 No hay token, usuario no autenticado');
        setLoading(false);
        return;
      }

      try {
        // Intentar verificar el token con el backend
        console.log('🔍 Verificando token con el backend...');
        const response = await api.get('/auth/verify');
        console.log('✅ Token verificado:', response.data);
        
        // Actualizar estado con la información del usuario
        setUser(response.data.user);
        setIsAuthenticated(true);
        
        // Verificar si es admin (compatible con ambos formatos)
        const adminStatus = response.data.user.isAdmin || response.data.user.role === 'admin';
        setIsAdmin(adminStatus);
        console.log('👑 Es administrador:', adminStatus);
      } catch (error) {
        console.error('❌ Error al verificar token:', error);
        // Limpiar token inválido
        localStorage.removeItem('token');
        setAuthError('Sesión expirada o inválida');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = async (credentials) => {
    try {
      console.log('Enviando credenciales:', {
        email: credentials.email,
        passwordLength: credentials.password.length // No imprimas la contraseña completa por seguridad
      });
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login exitoso:', response.data);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      // Actualizar estado
      setUser(response.data.user);
      setIsAuthenticated(true);
      
      // Verificar si es admin (compatible con ambos formatos)
      const adminStatus = response.data.user.isAdmin || response.data.user.role === 'admin';
      setIsAdmin(adminStatus);
      console.log('👑 Es administrador:', adminStatus);
      
      return response.data;
    } catch (error) {
      console.error('❌ Error en login:', error);
      const errorMsg = error.response?.data?.message || 'Error de conexión';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Función para registrar usuario
  const register = async (email, password) => {
    try {
      console.log('📝 Intentando registrar:', email);
      const response = await api.post('/auth/register', { email, password });
      console.log('✅ Registro exitoso:', response.data);
      
      // Guardar token en localStorage
      localStorage.setItem('token', response.data.token);
      
      // Iniciar sesión automáticamente tras registro
      return login({ email, password });
    } catch (error) {
      console.error('❌ Error en registro:', error);
      const errorMsg = error.response?.data?.message || 'Error de conexión';
      setAuthError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    console.log('👋 Cerrando sesión...');
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const makeAdmin = async (email) => {
    try {
      console.log('🔑 Intentando hacer admin a:', email);
      const response = await api.post('/auth/make-admin', { email });
      console.log('✅ Usuario actualizado a admin:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error al hacer admin:', error);
      throw new Error(error.response?.data?.message || 'Error al actualizar permisos');
    }
  };

  // Objeto de contexto con todos los valores y funciones
  const contextValue = {
    user,
    isAuthenticated,
    isAdmin,
    loading,
    authError,
    login,
    register,
    logout,
    makeAdmin,
    setAuthError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};