import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { toast } from 'react-toastify';

export default function CreateProfile() {
  const { createNewProfile } = useProfile();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    isChild: false,
    imageFile: null,
    previewUrl: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createNewProfile(formData);
      toast.success('Perfil creado exitosamente');
      navigate('/select-profile');
    } catch (error) {
      toast.error(error.message || 'Error al crear perfil');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageFile: file,
          previewUrl: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 p-8 rounded-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear nuevo perfil</h2>
        
        <div className="mb-6 flex justify-center">
          <label className="cursor-pointer">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
              {formData.previewUrl ? (
                <img src={formData.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-4xl">+</div>
              )}
            </div>
            <input 
              type="file" 
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </label>
        </div>
        
        <div className="mb-4">
          <label className="block mb-2">Nombre del perfil</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full px-4 py-2 bg-gray-700 rounded"
            required
          />
        </div>
        
        <div className="mb-6 flex items-center">
          <input
            type="checkbox"
            id="isChild"
            checked={formData.isChild}
            onChange={(e) => setFormData({...formData, isChild: e.target.checked})}
            className="mr-2"
          />
          <label htmlFor="isChild">Perfil infantil (filtra contenido para niños)</label>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/select-profile')}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded"
          >
            Crear Perfil
          </button>
        </div>
      </form>
    </div>
  );
}