import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { MovieFormSimple } from '../../components/Admin/MovieFormSimple';

import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';
import { normalizeImageUrl } from '../../utils/imageUtils';


const ProfileManager = () => {
  const { user, token } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);

  const fetchProfiles = async () => {
    if (profiles.length > 0) return; // Evitar la carga repetida
  
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/api/profiles', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
  
      console.log(response.data); // Verifica la estructura de la respuesta
  
      const normalizedProfiles = response.data.map(profile => ({
        ...profile,
        imageUrl: normalizeImageUrl(profile.imageUrl)
      }));
  
      setProfiles(normalizedProfiles); // Aquí actualizas el estado
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar perfiles');
      toast.error('Error al cargar perfiles');
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };
  console.log("TOKEN ACTUAL:", token);

  useEffect(() => {
    console.log("Ejecutando useEffect con token:", token);
    if (!token) return;
  
    fetchProfiles();
  }, [token]);
  

  const handleCreateProfile = async (formData) => {
    try {
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
      console.error('Error creating profile:', err);
    }
  };

  const handleUpdateProfile = async (id, profileData) => {
    try {
      const response = await axios.put(`http://localhost:3001/api/profiles/${id}`, profileData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`  // ✅ Usás el token directamente
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
      console.error('Error updating profile:', {
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
      await axios.delete(`http://localhost:3001/api/profiles/${profileId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      toast.success('Perfil eliminado correctamente');
      fetchProfiles();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar perfil');
      console.error('Error deleting profile:', err);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl">Cargando perfiles...</div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-xl text-red-500">{error}</div>
    </div>
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestión de Perfiles</h2>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {profiles.map(profile => (
          <div key={profile._id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="relative">
              <img
                src={profile.imageUrl} // Ya viene normalizada desde el backend
                alt={profile.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  if (!e.target.src.includes('default-profile.png')) {
                    e.target.src = normalizeImageUrl('/images/default-profile.png');
                  }
                }}
              />


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
              <h3 className="font-bold text-lg">{profile.name}</h3>
              <p className="text-sm text-gray-600">
                {profile.isChild ? 'Perfil Infantil' : 'Perfil Adulto'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Creado: {new Date(profile.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
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
            throw error; // Esto se manejará en el FormModal
          }
        }}
        initialData={editingProfile}
      />
    </div>
  );
};

export default ProfileManager;