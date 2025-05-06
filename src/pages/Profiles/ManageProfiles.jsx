// src/pages/Profiles/ManageProfiles.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ManageProfiles = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  const { user } = useAuth();
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

  const handleDelete = async (profileId) => {
    try {
      await api.delete(`/profiles/${profileId}`);
      setProfiles(profiles.filter(profile => profile._id !== profileId));
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error al eliminar perfil:', err);
      setError('No se pudo eliminar el perfil');
    }
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
      <h1 className="text-3xl font-bold text-white mb-6">Administrar Perfiles</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-6 max-w-md">
          {error}
        </div>
      )}
      
      <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 mb-6">
        {profiles.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No hay perfiles disponibles.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {profiles.map(profile => (
              <div 
                key={profile._id} 
                className="flex items-center justify-between p-4 bg-gray-700 rounded-lg"
              >
                <div className="flex items-center">
                  <img
                    src={profile.imageUrl || '/images/profiles/default-profile.png'}
                    alt={profile.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h3 className="text-white font-medium">{profile.name}</h3>
                    {profile.isChild && (
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">
                        Perfil infantil
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Link
                    to={`/edit-profile/${profile._id}`}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Editar
                  </Link>
                  
                  {deleteConfirm === profile._id ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleDelete(profile._id)}
                        className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                      >
                        Confirmar
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteConfirm(profile._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="flex space-x-4">
        <Link
          to="/create-profile"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Crear nuevo perfil
        </Link>
        <button
          onClick={() => navigate('/select-profile')}
          className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    </div>
  );
};

export default ManageProfiles;