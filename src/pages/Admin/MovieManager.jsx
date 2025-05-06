import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api'; // Asegúrate de que la ruta sea correcta
import { toast } from 'react-toastify';

const MovieManager = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchMovie = async () => {
        try {
          const response = await api.get(`/movies/${id}`);
          setMovie(response.data);
        } catch (error) {
          toast.error('Error cargando película');
        } finally {
          setLoading(false);
        }
      };
      fetchMovie();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleSave = async (movieData) => {
    setIsSubmitting(true);
    try {
      // 1. Obtener el token del localStorage
      const token = localStorage.getItem('token');
      
      // 2. Configurar los headers con el token
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
  
      // 3. Hacer la petición según si es edición o creación
      if (id) {
        await api.put(`/movies/${id}`, movieData, config);
        toast.success('🎬 Película actualizada correctamente');
      } else {
        await api.post('/movies', movieData, config);
        toast.success('🍿 Película creada correctamente');
      }
      
      // 4. Redirigir después de guardar
      navigate('/admin');
      
    } catch (error) {
      // 5. Manejo detallado de errores
      console.error('Error completo:', error);
      
      if (error.response?.status === 403) {
        toast.error('🔒 No tienes permisos de administrador');
      } else if (error.response?.data?.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error('❌ Error al guardar la película');
      }
    } finally {
      // 6. Quitar el estado de carga
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="text-white p-6">Cargando...</div>;

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <MovieFormSimple
        movie={movie || {}}
        onSave={handleSave}
        onClose={() => navigate('/admin')}
        onBackToList={() => navigate('/admin')}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default MovieManager;