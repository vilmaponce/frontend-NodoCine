import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import axios from 'axios'; // Añadir esta importación
import { toast } from 'react-toastify';

export default function ProfileCreate() {
  const [name, setName] = useState('');
  const [isChild, setIsChild] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  
  const { user } = useAuth();
  const { createNewProfile } = useProfile();
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verificar tamaño y tipo antes de aceptar
      if (file.size > 5 * 1024 * 1024) {
        toast.error('La imagen debe ser menor a 5MB');
        return;
      }
      
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Solo se permiten imágenes JPG y PNG');
        return;
      }
      
      setImageFile(file);
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      console.log('Imagen seleccionada:', {
        nombre: file.name,
        tipo: file.type,
        tamaño: `${(file.size / 1024).toFixed(2)}KB`
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Usar directamente FormData para mejor depuración
      const formData = new FormData();
      formData.append('name', name);
      formData.append('isChild', String(isChild));
      
      // Asegurar que el ID de usuario esté incluido
      if (user && user.id) {
        formData.append('userId', user.id);
      } else {
        throw new Error('No hay ID de usuario disponible');
      }
      
      // Añadir imagen si existe
      if (imageFile) {
        formData.append('image', imageFile);
        console.log('Imagen añadida al FormData:', {
          nombre: imageFile.name, 
          tipo: imageFile.type, 
          tamaño: `${(imageFile.size / 1024).toFixed(2)}KB`
        });
      } else {
        console.log('No se seleccionó imagen, se usará la imagen por defecto');
      }
      
      // Verificar token
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay sesión activa');
      }
      
      console.log('Token presente:', !!token);
      console.log('Enviando datos al servidor...');
      
      // Usar axios directamente para depuración
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
      
      console.log('Respuesta del servidor:', response.data);
      
      toast.success('Perfil creado con éxito');
      navigate('/select-profile');
    } catch (error) {
      console.error('Error completo al crear perfil:', error);
      
      if (error.response) {
        console.error('Datos de respuesta del error:', {
          status: error.response.status,
          data: error.response.data
        });
        
        // Mostrar mensaje de error específico si está disponible
        const errorMsg = error.response.data?.message || 'Error al crear perfil';
        toast.error(errorMsg);
      } else {
        toast.error(`Error: ${error.message || 'Error al crear perfil'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-white mb-6">Crear Nuevo Perfil</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-300 mb-2">Nombre del Perfil</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-2 bg-gray-700 text-white rounded border border-gray-600"
            placeholder="Ej: Juan, Niños, etc."
          />
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isChild"
            checked={isChild}
            onChange={(e) => setIsChild(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="isChild" className="text-gray-300">
            ¿Es un perfil infantil?
          </label>
        </div>
        
        <div>
          <label className="block text-gray-300 mb-2">Imagen de Perfil</label>
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageChange}
            className="w-full p-2 text-gray-300"
          />
          
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Vista previa"
                className="h-32 w-32 object-cover rounded-md"
              />
            </div>
          )}
          <p className="text-xs text-gray-400 mt-1">
            Formatos permitidos: JPG, PNG. Tamaño máximo: 5MB
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-md font-medium ${
            loading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          {loading ? 'Creando...' : 'Crear Perfil'}
        </button>
      </form>
    </div>
  );
}