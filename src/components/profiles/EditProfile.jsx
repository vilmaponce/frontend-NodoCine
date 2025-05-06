import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import { toast } from 'react-toastify';

const EditProfile = ({ profile }) => {
  const [name, setName] = useState(profile?.name || '');
  const [isChild, setIsChild] = useState(profile?.isChild || false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(profile?.imageUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { updateProfile } = useProfile(); // Asumiendo que tienes esta función en tu contexto
  const navigate = useNavigate();
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Crear una URL temporal para la vista previa
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await updateProfile(profile.id, {
        name,
        isChild,
        imageFile: image
      });
      
      toast.success('Perfil actualizado correctamente');
      navigate('/select-profile');
    } catch (error) {
      toast.error('Error al actualizar el perfil');
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Editar perfil</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-lg">Nombre del perfil</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-gray-700 rounded py-3 px-4 text-white"
              required
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isChild"
              checked={isChild}
              onChange={(e) => setIsChild(e.target.checked)}
              className="w-5 h-5"
            />
            <label htmlFor="isChild" className="ml-2 text-lg">
              Perfil infantil
            </label>
          </div>
          
          <div>
            <label className="block mb-2 text-lg">Imagen de perfil</label>
            <div className="flex items-center space-x-4">
              {imagePreview && (
                <div className="w-24 h-24 rounded-lg overflow-hidden">
                  <img 
                    src={imagePreview}
                    alt="Vista previa"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="bg-gray-700 p-2 rounded"
              />
            </div>
          </div>
          
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/select-profile')}
              className="flex-1 py-3 px-6 rounded-lg bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 px-6 rounded-lg bg-red-600"
            >
              {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;