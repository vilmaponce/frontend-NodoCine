import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const ProfileContext = createContext();

export function ProfileProvider({ children }) {
  const [currentProfile, setCurrentProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const { user } = useAuth();

  const loadUserProfiles = async (userId) => {
    try {
      const response = await fetch(`/api/profiles/user/${userId}`);
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      throw error;
    }
  };

  const updateCurrentProfile = async (profile) => {
    try {
      // Guardar en localStorage para persistencia
      localStorage.setItem('currentProfile', JSON.stringify(profile));
      setCurrentProfile(profile);
    } catch (error) {
      throw error;
    }
  };

  const createNewProfile = async (profileData) => {
    try {
      const formData = new FormData();
      formData.append('name', profileData.name);
      formData.append('isChild', profileData.isChild);
      if (profileData.imageFile) {
        formData.append('image', profileData.imageFile);
      }

      const response = await fetch('/api/profiles', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al crear perfil');

      const newProfile = await response.json();
      setProfiles(prev => [...prev, newProfile]);
      return newProfile;
    } catch (error) {
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
