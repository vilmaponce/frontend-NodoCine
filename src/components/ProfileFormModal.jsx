// src/components/ProfileFormModal.jsx
import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ProfileFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    isChild: false,
    image: null,
    imagePreview: null
  });

  // Inicialización del estado
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData?.name || '',
        isChild: initialData?.isChild || false,
        image: null,
        // Construir la URL completa si la imagen existe
        imagePreview: initialData?.imageUrl 
          ? initialData.imageUrl.includes('http') 
            ? initialData.imageUrl 
            : `http://localhost:3001${initialData.imageUrl}` 
          : '/images/profiles/default-profile.png'
      });
    }
  }, [isOpen, initialData]);
  
  // Manejo de cambios
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Manejo de archivos
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('isChild', formData.isChild);

      if (formData.image) {
        data.append('image', formData.image);
      }

      console.log('Datos a enviar:', {
        name: formData.name,
        hasImage: !!formData.image
      });

      await onSubmit(data);
      onClose();
    } catch (error) {
      console.error('Error en submit:', error);
      alert(error.message || 'Error al actualizar perfil');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {initialData ? 'Editar Perfil' : 'Crear Nuevo Perfil'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6 flex flex-col items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-700 mb-4">
              {formData.imagePreview ? (
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-gray-400">Sin imagen</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Cambiar imagen
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-300 mb-1">Nombre:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-2 border border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white"
              required
              autoComplete="off"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isChild"
                checked={formData.isChild}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-300">Perfil infantil</span>
            </label>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-600 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {initialData ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileFormModal;