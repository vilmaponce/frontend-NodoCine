// src/pages/Admin/ProfileManager.jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { normalizeImageUrl } from '../../utils/imageUtils';
import ProfileFormModal from '../../components/ProfileFormModal'; // Importación añadida


const ProfileManager = () => {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [familyProfiles, setFamilyProfiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [filterActive, setFilterActive] = useState(false);

  const navigate = useNavigate();

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      // Obtener token desde localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        throw new Error('No hay token disponible');
      }

      const response = await axios.get('http://localhost:3001/api/profiles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log('Perfiles obtenidos:', response.data);

      const normalizedProfiles = response.data.map(profile => ({
        ...profile,
        imageUrl: normalizeImageUrl(profile.imageUrl)
      }));

      // Eliminar duplicados basados en _id
      const uniqueProfiles = [];
      const seenIds = new Set();

      normalizedProfiles.forEach(profile => {
        if (!seenIds.has(profile._id)) {
          seenIds.add(profile._id);
          uniqueProfiles.push(profile);
        }
      });

      // Organizar perfiles por userId
      const profilesByUser = {};
      uniqueProfiles.forEach(profile => {
        const userId = profile.userId || 'sin-usuario';
        if (!profilesByUser[userId]) {
          profilesByUser[userId] = [];
        }
        profilesByUser[userId].push(profile);
      });

      setProfiles(uniqueProfiles);
      setFamilyProfiles(profilesByUser);
    } catch (err) {
      console.error('Error al cargar perfiles:', err);
      setError(err.response?.data?.message || 'Error al cargar perfiles');
      toast.error('Error al cargar perfiles');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);


  const handleCreateProfile = async (formData) => {
    try {
      const token = localStorage.getItem('token');

      await axios.post('http://localhost:3001/api/profiles', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Perfil creado correctamente');
      fetchProfiles();
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear perfil');
      console.error('Error al crear perfil:', err);
    }
  };

  const handleUpdateProfile = async (id, profileData) => {
    try {
      const token = localStorage.getItem('token');

      const response = await axios.put(`http://localhost:3001/api/profiles/${id}`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setProfiles(prev => prev.map(p =>
          p._id === id ? { ...p, ...response.data.profile } : p
        ));
        toast.success('Perfil actualizado correctamente');
        return response.data;
      }

      throw new Error(response.data.error || 'Error al actualizar perfil');

    } catch (err) {
      console.error('Error al actualizar perfil:', {
        status: err.response?.status,
        data: err.response?.data,
        config: err.config
      });
      toast.error(err.response?.data?.error || 'Error al actualizar perfil');
      throw err;
    }
  };

  const handleDeleteProfile = async (profileId) => {
    if (!window.confirm('¿Estás seguro de eliminar este perfil?')) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:3001/api/profiles/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Perfil eliminado correctamente');
      fetchProfiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar perfil');
      console.error('Error al eliminar perfil:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-white">Cargando perfiles...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="mr-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
          title="Regresar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold text-white">Gestión de Perfiles</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setFilterActive(!filterActive)}
            className={`${filterActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'} text-white px-4 py-2 rounded transition`}
          >
            {filterActive ? 'Mostrando Familia' : 'Mostrar Todos'}
          </button>
          <button
            onClick={() => {
              setEditingProfile(null);
              setIsModalOpen(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            + Crear Perfil
          </button>
        </div>
      </div>

      {filterActive ? (
        // Vista por familia
        Object.entries(familyProfiles).map(([userId, userProfiles]) => (
          <div key={userId} className="mb-8">
            <h3 className="text-lg font-medium text-white mb-3 border-b border-gray-700 pb-2">
              {userId === 'sin-usuario' ? 'Perfiles sin usuario asignado' : `Familia ID: ${userId.substring(0, 8)}...`}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userProfiles.map(profile => (
                <div key={profile._id} className="border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-800">
                  <div className="relative">
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.target.src = '/images/profiles/default-profile.png';
                      }}
                    />
                    {profile.isChild && (
                      <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        Niño
                      </span>
                    )}
                    <div className="absolute top-2 right-2 flex space-x-2">
                      <button
                        onClick={() => {
                          setEditingProfile(profile);
                          setIsModalOpen(true);
                        }}
                        className="bg-yellow-500 text-white p-1 rounded-full"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(profile._id)}
                        className="bg-red-500 text-white p-1 rounded-full"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-white">{profile.name}</h3>
                    <p className="text-sm text-gray-400">
                      {profile.isChild ? 'Perfil Infantil' : 'Perfil Adulto'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Creado: {new Date(profile.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      ) : (
        // Vista de todos los perfiles
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {profiles.map(profile => (
            <div key={profile._id} className="border border-gray-700 rounded-lg overflow-hidden shadow-md bg-gray-800">
              <div className="relative">
                <img
                  src={profile.imageUrl}
                  alt={profile.name}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = '/images/profiles/default-profile.png';
                  }}
                />
                {profile.isChild && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    Niño
                  </span>
                )}
                <div className="absolute top-2 right-2 flex space-x-2">
                  <button
                    onClick={() => {
                      setEditingProfile(profile);
                      setIsModalOpen(true);
                    }}
                    className="bg-yellow-500 text-white p-1 rounded-full"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProfile(profile._id)}
                    className="bg-red-500 text-white p-1 rounded-full"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg text-white">{profile.name}</h3>
                <p className="text-sm text-gray-400">
                  {profile.isChild ? 'Perfil Infantil' : 'Perfil Adulto'}
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Creado: {new Date(profile.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {profiles.length === 0 && !loading && (
        <div className="bg-gray-800 p-8 text-center rounded-lg">
          <p className="text-gray-400 mb-4">No hay perfiles disponibles.</p>
          <button
            onClick={() => {
              setEditingProfile(null);
              setIsModalOpen(true);
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Crear primer perfil
          </button>
        </div>
      )}

      {/* Modal para crear/editar perfiles */}
      <ProfileFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProfile(null);
        }}
        onSubmit={async (formData) => {
          try {
            if (editingProfile) {
              await handleUpdateProfile(editingProfile._id, formData);
            } else {
              await handleCreateProfile(formData);
            }
          } catch (error) {
            console.error("Error en el modal:", error);
            throw error;
          }
        }}
        initialData={editingProfile}
      />
    </div>
  );
};

export default ProfileManager;