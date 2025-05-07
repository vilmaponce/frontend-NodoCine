import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';


const getRandomAvatar = (name) => {
  // Usa DiceBear API para generar avatares basados en el nombre
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
};

export default function CreateProfile() {
  const [name, setName] = useState('');
  const [isChild, setIsChild] = useState(false);
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  const { user } = useAuth();
  const { createNewProfile } = useProfile();
  const navigate = useNavigate();

  
  // Obtener ID de usuario de localStorage como respaldo
  const getUserIdFromStorage = () => {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && parsedUser.id) {
          return parsedUser.id;
        }
      }
    } catch (error) {
      console.error('Error obteniendo ID del localStorage:', error);
    }
    return null;
  };

  
  
 // En handleSubmit de ProfileCreate.jsx
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);
  
  try {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('isChild', String(isChild));
    
    // Asegurarte de incluir el userId correcto
    if (user && user.id) {
      formData.append('userId', user.id);
    }
    
    // Si no hay imagen seleccionada, usar avatar aleatorio
    if (image) {
      formData.append('image', image);
      console.log('Imagen agregada al FormData:', {
        nombre: image.name,
        tipo: image.type,
        tamaño: image.size
      });
    } else {
      // Genera una URL para el avatar y la envía como imageUrl
      formData.append('imageUrl', getRandomAvatar(name));
    }
    
    // Usar la función del contexto o axios directamente
    const token = localStorage.getItem('token');
    console.log('Token presente:', !!token);
    
    const response = await axios.post(
      'http://localhost:3001/api/profiles',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('Respuesta completa:', response);
    console.log('Perfil creado:', response.data);
    
    toast.success('Perfil creado con éxito');
    navigate('/select-profile');
  } catch (error) {
    console.error('Error completo:', error);
    
    if (error.response) {
      console.error('Error del servidor:', {
        status: error.response.status,
        data: error.response.data
      });
    }
    
    toast.error('Error al crear perfil');
  } finally {
    setIsSubmitting(false);
  }
};
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Crear perfil</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-lg">Nombre del perfil</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 rounded py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Ingresa un nombre para el perfil"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isChild"
              checked={isChild}
              onChange={(e) => setIsChild(e.target.checked)}
              className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
            />
            <label htmlFor="isChild" className="ml-2 text-lg">
              Perfil infantil
            </label>
          </div>
          
          <div>
            <label className="block mb-2 text-lg">Imagen de perfil (opcional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files[0])}
              className="w-full bg-gray-700 rounded py-2 px-4 text-white"
            />
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/select-profile')}
              className="flex-1 py-3 px-6 rounded-lg bg-gray-700 hover:bg-gray-600 transition duration-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-lg bg-red-600 hover:bg-red-700 transition duration-200 disabled:opacity-70"
            >
              {isSubmitting ? 'Creando...' : 'Crear perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}