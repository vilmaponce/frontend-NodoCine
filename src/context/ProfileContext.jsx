import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const { user } = useContext(AuthContext);
  // Añadir un flag para controlar si ya intentamos cargar perfiles
  const loadAttempted = useRef(false);

  // Cargar perfil actual de localStorage al inicio
  useEffect(() => {
    const savedProfile = localStorage.getItem('currentProfile');
    if (savedProfile) {
      try {
        setCurrentProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error al cargar el perfil guardado:', error);
        localStorage.removeItem('currentProfile');
      }
    }
  }, []);

  // Cargar perfiles solo cuando el usuario cambia y está definido
  useEffect(() => {
    // Solo cargar si hay un usuario con ID y no hemos intentado cargar antes
    if (user && user.id && !loadAttempted.current) {
      loadUserProfiles();
      loadAttempted.current = true; // Marcar que ya intentamos cargar
    } else if (!user || !user.id) {
      // Resetear el flag si el usuario cambia o se elimina
      loadAttempted.current = false;
    }
  }, [user]);

  const loadUserProfiles = async (userId = null) => {
    try {
      // Usar el ID pasado como parámetro o el ID del contexto
      const id = userId || (user && user.id);

      // Verificar que hay un ID disponible y salir temprano si no hay
      if (!id) {
        console.warn('No hay usuario autenticado o ID disponible - carga de perfiles cancelada');
        return; // No modificar el estado para evitar ciclos
      }

      console.log('Cargando perfiles para usuario con ID:', id);

      const response = await api.get(`/profiles/user/${id}`);

      if (response.data && Array.isArray(response.data)) {
        // Normalizar los perfiles para consistencia
        const normalizedProfiles = response.data.map(profile => ({
          ...profile,
          id: profile.id || profile._id
        }));
        setProfiles(normalizedProfiles);
      } else {
        console.warn('La respuesta no es un array:', response.data);
        setProfiles([]); // Array vacío en vez de null
      }
    } catch (error) {
      console.error('Error cargando perfiles:', error);
      // No cambiar el estado si hay un error de autenticación (401)
      if (error.response && error.response.status !== 401) {
        setProfiles([]);
      }
    }
  };

  const updateCurrentProfile = async (profile) => {
    try {
      // 1. Validar que el perfil existe
      if (!profile) {
        throw new Error('No se recibió ningún perfil');
      }
  
      // 2. Normalizar el perfil (asegurar que tenga id)
      const normalizedProfile = {
        ...profile,
        id: profile.id || profile._id
      };
  
      if (!normalizedProfile.id) {
        throw new Error('El perfil no tiene ID válido');
      }
  
      // 3. Guardar en localStorage
      localStorage.setItem('currentProfile', JSON.stringify(normalizedProfile));
      
      // 4. Actualizar el estado
      setCurrentProfile(normalizedProfile);
      
      return normalizedProfile;
      
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      throw error; // Re-lanzamos el error para manejarlo donde se llame
    }
  };

  // En ProfileContext.jsx, modifica la función createNewProfile
  // Dentro de tu ProfileContext.jsx, actualiza la función createNewProfile
  const createNewProfile = async (profileData) => {
    try {
      // Verificar que tenemos un ID de usuario
      if (!profileData.userId) {
        console.error('No se proporcionó userId en los datos del perfil');

        // Intentar obtener el ID del contexto user
        if (user && user.id) {
          console.log('Usando ID del contexto user:', user.id);
          profileData.userId = user.id;
        } else {
          // Intentar obtener el ID del localStorage como último recurso
          try {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const parsedUser = JSON.parse(storedUser);
              if (parsedUser && parsedUser.id) {
                console.log('Usando ID del usuario almacenado:', parsedUser.id);
                profileData.userId = parsedUser.id;
              }
            }
          } catch (error) {
            console.error('Error obteniendo ID del localStorage:', error);
          }
        }

        // Si todavía no tenemos un ID, lanzar error
        if (!profileData.userId) {
          throw new Error('No se pudo obtener el ID del usuario');
        }
      }

      // Verificar token
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No hay token disponible al crear perfil');
        throw new Error('No hay sesión activa');
      }

      // Crear FormData y añadir los datos
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('isChild', String(profileData.isChild));
      formData.append('userId', profileData.userId);

      // Añadir imagen si existe
      if (profileData.imageFile) {
        formData.append('image', profileData.imageFile);
        console.log('Imagen añadida al FormData');
      } else {
        console.log('No se proporcionó imagen');
      }

      console.log('Datos que se enviarán al backend:', {
        name: profileData.name,
        isChild: String(profileData.isChild),
        userId: profileData.userId,
        imagePresente: !!profileData.imageFile
      });

      // Hacer la solicitud con el token en cabeceras
      const response = await api.post('/profiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Respuesta del servidor:', response.data);

      // Normalizar el perfil recibido
      const newProfile = {
        ...response.data,
        id: response.data.id || response.data._id
      };

      // Actualizar el estado de perfiles
      setProfiles(prev => Array.isArray(prev) ? [...prev, newProfile] : [newProfile]);

      return newProfile;
    } catch (error) {
      console.error('Error completo al crear perfil:', error);

      if (error.response) {
        console.error('Datos de respuesta del error:', {
          status: error.response.status,
          data: error.response.data
        });
      }

      throw error;
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        currentProfile,
        profiles,
        setCurrentProfile: updateCurrentProfile,
        loadUserProfiles,
        createNewProfile
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export const useProfile = () => useContext(ProfileContext);