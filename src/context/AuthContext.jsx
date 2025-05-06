import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';

// Crear el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const setAdminMode = () => {
    if (user) {
      const updatedUser = { ...user, isAdmin: true };
      setUser(updatedUser);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Modo administrador activado');
    }
  };
  // Verificar token al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token) {
        try {
          // Configurar el token para las solicitudes
          api.defaults.headers.Authorization = `Bearer ${token}`;

          // Intentar usar el usuario almacenado si existe
          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);

              // Asegurar que tiene todos los campos necesarios
              const normalizedUser = {
                id: parsedUser.id || parsedUser._id || '',
                name: parsedUser.name || 'Usuario',
                email: parsedUser.email,
                role: parsedUser.role || 'user' // Asignar rol predeterminado
              };

              setUser(normalizedUser);
              setIsAuthenticated(true);
              setIsAdmin(normalizedUser.role === 'admin');
              setLoading(false);
              return;
            } catch (parseError) {
              console.error('Error al parsear usuario almacenado:', parseError);
            }
          }

          // Si no hay usuario almacenado, verificar con el servidor
          const response = await api.get('/auth/verify');

          // Asegurar que tiene todos los campos necesarios
          const userData = {
            id: response.data.user._id || response.data.user.id || '',
            name: response.data.user.name || 'Usuario',
            email: response.data.user.email,
            role: response.data.user.role || 'user' // Asignar rol predeterminado
          };

          setUser(userData);
          setIsAuthenticated(true);
          setIsAdmin(userData.role === 'admin');

          // Actualizar usuario almacenado
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          console.error('Error verificando autenticación:', error);
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Función de login actualizada
  // En AuthContext.jsx, modifica la función login

  // En AuthContext.jsx, función login
  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);

      // Obtener datos del usuario
      const userFromResponse = response.data.user;

      // Determinar si el usuario es administrador (verificando ambos campos)
      const isAdminUser =
        userFromResponse.isAdmin === true ||
        userFromResponse.role === 'admin';

      // Crear objeto de usuario normalizado
      const userData = {
        id: userFromResponse._id || userFromResponse.id || '',
        username: userFromResponse.username || 'Usuario',
        email: userFromResponse.email,
        isAdmin: isAdminUser  // Usar el valor calculado
      };

      console.log('Usuario normalizado:', userData);
      console.log('Es admin?', userData.isAdmin);

      // Guardar y actualizar estado...
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(isAdminUser);

      return {
        ...response.data,
        user: userData
      };
    } catch (error) {
      // Manejo de errores...
    }
  };

  // Función de registro
  const register = async (email, password) => {
    try {
      const response = await api.post('/auth/register', { email, password });

      // Similar a login, asegurarse de normalizar los datos del usuario
      const userFromResponse = response.data.user;

      // Crear objeto de usuario normalizado
      const userData = {
        id: userFromResponse._id || userFromResponse.id || '',
        name: userFromResponse.name || 'Usuario',
        email: userFromResponse.email,
        role: userFromResponse.role || 'user' // Asignar 'user' como rol predeterminado
      };

      // Guardar token y usuario
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Actualizar estado
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.role === 'admin');

      return {
        ...response.data,
        user: userData
      };
    } catch (error) {
      throw error.response ? error.response.data : new Error('Error en el registro');
    }
  };

  // Función de logout
  const logout = () => {
    // Eliminar token y usuario del localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('currentProfile'); // También eliminar perfil actual si existe

    // Reiniciar estado
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
  };

  const makeAdmin = () => {
    if (user && user.email === 'admin@admin.com') {
      const updatedUser = { ...user, isAdmin: true };
      setUser(updatedUser);
      setIsAdmin(true);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isAdmin,
        loading,
        login,
        logout,
        register,
        setAdminMode, 
        makeAdmin, // Añadir makeAdmin al contexto
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};