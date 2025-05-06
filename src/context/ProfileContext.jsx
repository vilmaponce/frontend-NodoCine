// Versión mejorada de ProfileContext.jsx
import { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export const useProfile = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [profiles, setProfiles] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Cargar perfiles cuando el usuario se autentica
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchProfiles();
    } else {
      // Limpiar perfiles si no hay usuario autenticado
      setProfiles([]);
      setCurrentProfile(null);
    }
  }, [isAuthenticated, user]);

  // Cargar perfiles del usuario actual
  const fetchProfiles = async () => {
    if (!user?.id) {
      console.warn('🚫 No se puede cargar perfiles sin ID de usuario');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 Obteniendo perfiles para usuario: ${user.id}`);
      const response = await api.get(`/profiles/user/${user.id}`);
      console.log('✅ Perfiles obtenidos:', response.data);
      setProfiles(response.data);
      
      // Restaurar perfil actual si existe en localStorage
      restoreCurrentProfile(response.data);
    } catch (err) {
      console.error('❌ Error al obtener perfiles:', err);
      setError('No se pudieron cargar los perfiles');
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Restaurar perfil seleccionado de localStorage
  const restoreCurrentProfile = (fetchedProfiles) => {
    const savedProfileId = localStorage.getItem('currentProfileId');
    
    if (savedProfileId && fetchedProfiles.length > 0) {
      const found = fetchedProfiles.find(p => p._id === savedProfileId);
      if (found) {
        console.log('🔄 Restaurando perfil guardado:', found.name);
        setCurrentProfile(found);
      } else {
        console.log('⚠️ Perfil guardado no encontrado entre los perfiles del usuario');
        localStorage.removeItem('currentProfileId');
      }
    }
  };

  // Seleccionar un perfil
  const selectProfile = (profile) => {
    console.log('👤 Seleccionando perfil:', profile.name);
    setCurrentProfile(profile);
    localStorage.setItem('currentProfileId', profile._id);
    
    // Redirigir al home después de seleccionar perfil
    navigate('/home');
  };

  // Crear un nuevo perfil
  const createProfile = async (profileData) => {
    setLoading(true);
    setError(null);

    try {
      console.log('📝 Creando nuevo perfil:', profileData.name);
      
      // Crear FormData para manejar la imagen si existe
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('isChild', profileData.isChild || false);
      
      if (profileData.image && profileData.image instanceof File) {
        formData.append('image', profileData.image);
        console.log('🖼️ Imagen adjunta:', profileData.image.name);
      }

      const response = await api.post('/profiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('✅ Perfil creado:', response.data);
      
      // Actualizar la lista de perfiles
      await fetchProfiles();
      
      return response.data;
    } catch (err) {
      console.error('❌ Error al crear perfil:', err);
      const errorMessage = err.response?.data?.message || 'No se pudo crear el perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Actualizar un perfil
  const updateProfile = async (profileId, profileData) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`✏️ Actualizando perfil ${profileId}:`, profileData);
      
      // Igual que en createProfile, usar FormData para imágenes
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('isChild', profileData.isChild || false);
      
      if (profileData.image && profileData.image instanceof File) {
        formData.append('image', profileData.image);
      }

      const response = await api.put(`/profiles/${profileId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      console.log('✅ Perfil actualizado:', response.data);
      
      // Actualizar la lista de perfiles
      await fetchProfiles();
      
      // Si era el perfil actual, actualizarlo
      if (currentProfile && currentProfile._id === profileId) {
        setCurrentProfile(response.data.profile);
      }
      
      return response.data;
    } catch (err) {
      console.error('❌ Error al actualizar perfil:', err);
      const errorMessage = err.response?.data?.message || 'No se pudo actualizar el perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar un perfil
  const deleteProfile = async (profileId) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🗑️ Eliminando perfil ${profileId}`);
      await api.delete(`/profiles/${profileId}`);
      
      console.log('✅ Perfil eliminado');
      
      // Si era el perfil actual, limpiarlo
      if (currentProfile && currentProfile._id === profileId) {
        setCurrentProfile(null);
        localStorage.removeItem('currentProfileId');
      }
      
      // Actualizar la lista de perfiles
      await fetchProfiles();
      
      return true;
    } catch (err) {
      console.error('❌ Error al eliminar perfil:', err);
      const errorMessage = err.response?.data?.message || 'No se pudo eliminar el perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Objeto de contexto con valores y funciones
  const contextValue = {
    profiles,
    currentProfile,
    loading,
    error,
    fetchProfiles,
    selectProfile,
    updateProfile,
    restoreCurrentProfile,
    setCurrentProfile,
    createProfile,
    updateProfile,
    deleteProfile,
    setError
  };

  return (
    <ProfileContext.Provider value={contextValue}>
      {children}
    </ProfileContext.Provider>
  );
};