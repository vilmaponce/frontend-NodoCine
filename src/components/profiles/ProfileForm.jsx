// src/components/profiles/ProfileForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const ProfileForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
  const [profile, setProfile] = useState({
    name: '',
    isChild: false,
    imageUrl: '',
    userId: user?.id || ''
  });

  // Cargar datos del perfil si estamos en modo edición
  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return; // Si no hay ID, estamos en modo creación
      
      try {
        setLoading(true);
        const response = await api.get(`/profiles/${id}`);
        setProfile(response.data);
        
        if (response.data.imageUrl) {
          setPreviewUrl(response.data.imageUrl);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar perfil:', err);
        setError('No se pudo cargar la información del perfil');
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setProfile({
      ...profile,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Manejar selección de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImage(file);
    
    // Crear URL para previsualización
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      
      // Agregar campos del perfil
      formData.append('name', profile.name);
      formData.append('isChild', profile.isChild);
      
      // No es necesario enviar userId en edición, pero sí en creación
      if (!id) {
        formData.append('userId', user.id);
      }
      
      // Agregar imagen si existe
      if (image) {
        formData.append('image', image);
      }
      
      let response;
      
      if (id) {
        // Modo edición
        response = await api.put(`/profiles/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Perfil actualizado:', response.data);
      } else {
        // Modo creación
        response = await api.post('/profiles', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Perfil creado:', response.data);
      }
      
      // Redirigir a la selección de perfiles
      navigate('/select-profile');
      
    } catch (err) {
      console.error('Error al guardar perfil:', err);
      setError(err.response?.data?.message || 'Error al guardar el perfil');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        {id ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
      </h2>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-gray-300 mb-1">
            Nombre del Perfil *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={profile.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        {/* Es Niño */}
        <div className="flex items-center">
          <input
            id="isChild"
            name="isChild"
            type="checkbox"
            checked={profile.isChild}
            onChange={handleChange}
            className="h-4 w-4 text-red-600 border-gray-500 rounded focus:ring-red-500 bg-gray-700"
          />
          <label htmlFor="isChild" className="ml-2 block text-gray-300">
            Este es un perfil para niños
          </label>
        </div>
        
        {/* Imagen */}
        <div>
          <label className="block text-gray-300 mb-1">
            Imagen de perfil
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          
          {previewUrl && (
            <div className="mt-2 flex justify-center">
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                className="h-24 w-24 object-cover rounded-full border border-gray-600"
              />
            </div>
          )}
        </div>
        
        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/select-profile')}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 rounded text-white ${
              loading ? 'bg-gray-500' : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {loading ? 'Guardando...' : id ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;