import React from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRef } from 'react'; // Añadir useRef

export default function ProfileSelect() {
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  const { profiles, setCurrentProfile, loadUserProfiles } = useProfile();
  const navigate = useNavigate();

  // Añadir un ref para controlar si ya se intentó cargar
  const loadAttempted = React.useRef(false);

  useEffect(() => {
    // Evitar múltiples llamadas usando el ref
    if (!loadAttempted.current && user && user.id) {
      const fetchProfiles = async () => {
        try {
          setLoading(true);
          await loadUserProfiles(user.id);
        } catch (error) {
          console.error('Error al obtener perfiles:', error);
          toast.error('Error al cargar perfiles');
        } finally {
          setLoading(false);
        }
      };

      fetchProfiles();
      loadAttempted.current = true;
    } else if (!user) {
      // Si no hay usuario, redirigir al login
      navigate('/login');
    } else if (profiles.length > 0) {
      // Si ya tenemos perfiles cargados, no estamos cargando
      setLoading(false);
    }
  }, [user, navigate]); // Quitar loadUserProfiles de las dependencias

  const handleSelectProfile = (profile) => {
    // Guardar el perfil seleccionado en el contexto
    setCurrentProfile(profile);
    // Redirigir a la página principal
    navigate('/home');
  };

  const goToAdminPanel = () => {
    navigate('/admin');
  };

  if (loading && profiles.length === 0) {
    return <div className="text-white text-center p-8">Cargando perfiles...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold text-white mb-8">¿Quién está viendo?</h1>

      {/* Mostrar opción de panel de administrador si el usuario es admin */}
      {isAdmin && (
        <div className="mb-8">
          <button
            onClick={goToAdminPanel}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition duration-300"
          >
            Panel de Administrador
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-4xl mx-auto">
        {profiles.map(profile => (
          <div
            key={profile.id || profile._id}
            className="cursor-pointer transition transform hover:scale-105"
            onClick={() => handleSelectProfile(profile)}
          >
            <div className="bg-gray-800 rounded-lg overflow-hidden">
              <img
                src={profile.imageUrl?.includes('http')
                  ? profile.imageUrl
                  : `http://localhost:3001${profile.imageUrl || ''}`}
                alt={profile.name}
                className="w-full h-40 object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/profile_default.png';
                }}
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                {profile.isChild && (
                  <span className="inline-block bg-blue-500 text-white text-xs px-2 py-1 rounded mt-2">
                    Kids
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Botón de añadir perfil */}
        <div
          className="cursor-pointer transition transform hover:scale-105"
          onClick={() => navigate('/create-profile')}
        >
          <div className="bg-gray-800 rounded-lg flex items-center justify-center h-full min-h-[200px]">
            <div className="text-center">
              <div className="text-5xl text-gray-400 font-light mb-2">+</div>
              <p className="text-gray-400">Añadir perfil</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}