import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';

export default function ProfileSelect() {
  const { profiles, isLoading, setCurrentProfile } = useProfile();
  const navigate = useNavigate();

  const handleSelect = (profile) => {
    setCurrentProfile(profile);
    localStorage.setItem('currentProfile', JSON.stringify(profile));
    navigate('/home');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12">¿Quién está viendo?</h1>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-4xl">
        {profiles.length > 0 ? (
          profiles.map(profile => (
            <div 
              key={profile._id} 
              className="flex flex-col items-center cursor-pointer group"
              onClick={() => handleSelect(profile)}
            >
              <div className="w-32 h-32 rounded-md overflow-hidden border-2 border-transparent group-hover:border-red-600 transition-all">
                <img
                  src={`http://localhost:3001/public/images/${profile.imageName || 'default-profile.png'}`}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = '/images/default-profile.png';
                  }}
                />
              </div>
              <span className="mt-4 text-xl text-gray-400 group-hover:text-white transition-colors">
                {profile.name}
              </span>
            </div>
          ))
        ) : (
          <div className="text-center">
            <p className="text-xl mb-4">No se encontraron perfiles</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}