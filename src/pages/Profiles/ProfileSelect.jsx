import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-toastify';
import { useState } from 'react';


export default function ProfileSelect() {
  const { user } = useAuth();
  const { currentProfile, profiles, setCurrentProfile, loadUserProfiles } = useProfile();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndProfiles = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      if (user.role === 'admin') {
        navigate('/admin');
        return;
      }

      if (currentProfile) {
        navigate('/home');
        return;
      }

      try {
        if (!profiles || profiles.length === 0) {
          await loadUserProfiles(user._id);
        }
      } catch (error) {
        toast.error('Error al cargar perfiles');
        console.error('Profile loading error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndProfiles();
  }, [user, currentProfile, navigate, profiles, loadUserProfiles]);

  const handleSelectProfile = async (profile) => {
    try {
      await setCurrentProfile(profile);
      toast.success(`Perfil ${profile.name} seleccionado`);
      navigate('/home');
    } catch (error) {
      toast.error('Error al seleccionar perfil');
      console.error('Profile selection error:', error);
    }
  };

  const handleCreateProfile = () => {
    navigate('/create-profile');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <LoadingSpinner className="h-16 w-16 text-red-500" />
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">No tienes perfiles creados</h1>
        <button
          onClick={handleCreateProfile}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-8 rounded-lg transition duration-200 transform hover:scale-105"
        >
          Crear nuevo perfil
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">¿Quién está viendo?</h1>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {profiles.map((profile) => (
            <ProfileCard 
              key={profile._id}
              profile={profile}
              onSelect={handleSelectProfile}
            />
          ))}
          
          <AddProfileCard onCreate={handleCreateProfile} />
        </div>
      </div>
    </div>
  );
}

// Componente de tarjeta de perfil
function ProfileCard({ profile, onSelect }) {
  return (
    <div 
      className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={() => onSelect(profile)}
    >
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-red-600 mb-4 transition-all duration-300">
        <img
          src={profile.imageUrl || '/images/profiles/default-profile.png'}
          alt={profile.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = '/images/profiles/default-profile.png';
          }}
        />
        {profile.isChild && (
          <span className="absolute bottom-2 right-2 bg-blue-500 text-xs font-bold px-2 py-1 rounded-full">
            Kids
          </span>
        )}
      </div>
      <span className="text-xl text-gray-300 group-hover:text-white transition-colors duration-200">
        {profile.name}
      </span>
    </div>
  );
}

// Componente para añadir nuevo perfil
function AddProfileCard({ onCreate }) {
  return (
    <div 
      className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={onCreate}
    >
      <div className="w-32 h-32 rounded-lg flex items-center justify-center bg-gray-800 border-2 border-dashed border-gray-600 group-hover:border-gray-400 mb-4 transition-all duration-300">
        <svg 
          className="w-16 h-16 text-gray-400 group-hover:text-white transition-colors duration-200" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <span className="text-xl text-gray-400 group-hover:text-white transition-colors duration-200">
        Añadir perfil
      </span>
    </div>
  );
}