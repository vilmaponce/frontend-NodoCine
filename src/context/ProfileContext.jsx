import { createContext, useContext, useState, useEffect } from 'react';

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [currentProfile, setCurrentProfile] = useState(
    JSON.parse(localStorage.getItem('currentProfile')) || null
  );
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfiles = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/profiles/all', { // Cambiado a la ruta correcta
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!response.ok) throw new Error('Error al cargar perfiles');
      
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error("Error loading profiles:", error);
      // Si falla, carga perfiles por defecto
      setProfiles([
        { _id: '1', name: 'Adulto', imageName: 'profile1.png', isChild: false },
        { _id: '2', name: 'Niño', imageName: 'profile2.png', isChild: true }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  return (
    <ProfileContext.Provider value={{ 
      currentProfile, 
      profiles,
      isLoading,
      setCurrentProfile,
      loadProfiles
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);