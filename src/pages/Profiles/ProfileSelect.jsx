// src/pages/Profiles/ProfileSelect.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { normalizeImageUrl } from '../../utils/imageUtils';
import api from '../../utils/api';

const ProfileSelect = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { selectProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.id) {
      fetchProfiles();
    }
  }, [user]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profiles/user/${user.id}`);
      setProfiles(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar perfiles:', err);
      setError('No se pudieron cargar los perfiles');
      setLoading(false);
    }
  };

  const handleSelectProfile = (profile) => {
    selectProfile(profile);
    navigate('/home');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-xl text-white">Cargando perfiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-white mb-10">¿Quién está viendo?</h1>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-6 max-w-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-10">
        {profiles.map(profile => (
          <div
            key={profile._id}
            className="flex flex-col items-center cursor-pointer group"
            onClick={() => handleSelectProfile(profile)}
          >
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-red-600 transition-all duration-200">
              <img
                src="http://localhost:3001/images/profiles/default-profile.png"
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-2 text-gray-400 group-hover:text-white text-center">
              {profile.name}
              {profile.isChild && (
                <span className="ml-1 text-xs bg-blue-500 text-white px-1 rounded">
                  Niño
                </span>
              )}
            </span>
          </div>
        ))}

        {/* Botón de Añadir Perfil */}
        {/* Botón de Añadir Perfil */}
        <Link
          to="/create-profile"
          className="flex flex-col items-center"
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden border-4 border-transparent hover:border-red-600 flex items-center justify-center bg-gray-800 transition-all duration-200">
            <svg
              className="w-16 h-16 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <span className="mt-2 text-gray-400 hover:text-white">Añadir Perfil</span>
        </Link>
      </div>

      {/* Botón para administrar perfiles */}
      {profiles.length > 0 && (
        <button
          onClick={() => navigate('/manage-profiles')}
          className="mt-4 px-6 py-2 border border-gray-600 text-gray-400 hover:text-white hover:border-white rounded-md transition-colors"
        >
          Administrar perfiles
        </button>
      )}
    </div>
  );
};

export default ProfileSelect;