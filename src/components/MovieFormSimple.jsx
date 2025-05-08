// Modificación de MovieFormSimple.jsx  //components/MovieFormSimple.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';

const MovieFormSimple = () => {
  const { id } = useParams(); // Para obtener el ID de la URL si estamos editando
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [movie, setMovie] = useState({
    title: '',
    director: '',
    year: new Date().getFullYear(),
    genre: '',
    imageUrl: '',
    duration: '',
    rating: 0,
    isFeatured: false
  });

  // Si hay un ID, cargar los datos de la película para editar
  useEffect(() => {
    if (id) {
      fetchMovie();
    }
  }, [id]);

  // Función para cargar una película existente
  const fetchMovie = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/movies/${id}`);
      setMovie(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar película:', err);
      setError('No se pudo cargar la información de la película');
      setLoading(false);
    }
  };

  // Manejar cambios en los campos
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMovie({
      ...movie,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Guardar película
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      // Aquí está el problema - necesitamos definir movieData
      const movieData = {
        title: movie.title,
        director: movie.director || '',
        year: Number(movie.year) || new Date().getFullYear(),
        genre: movie.genre || '',
        imageUrl: movie.imageUrl || '',
        duration: movie.duration || '',
        rating: Number(movie.rating) || 0,
        isFeatured: Boolean(movie.isFeatured)
      };
      
      console.log('Datos a enviar:', movieData);
      
      if (id) {
        // Actualizar película existente
        await api.put(`/movies/${id}`, movieData);
        console.log('Película actualizada');
        toast.success('¡Película actualizada con éxito!');
        // CAMBIO AQUÍ: Siempre redirigir al listado de películas del admin
        navigate('/admin/movies');
      } else {
        // Crear nueva película
        const response = await api.post('/movies', movieData);
        console.log('Película creada');
        toast.success('¡Película creada con éxito!');
        // CAMBIO AQUÍ: Siempre redirigir al listado de películas del admin
        navigate('/admin/movies');
      }
    } catch (err) {
      console.error('Error al guardar película:', err);
      setError('Error al guardar la película: ' + err.message);
      // Agregar toast de error
      toast.error('Error al guardar la película');
    } finally {
      setLoading(false);
    }
  };

  // Cancelar y volver
  const handleCancel = () => {
    navigate('/admin/movies');
  };

  if (loading && id) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div className="max-w-xl mx-auto bg-gray-800 p-6 rounded-lg">
      <button
        onClick={() => navigate(-1)}
        className="mr-4 p-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white"
        title="Regresar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold text-white mb-6">
        {id ? 'Editar Película' : 'Añadir Película'}
      </h2>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-300">Título*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={movie.title}
            onChange={handleChange}
            required
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div>
          <label htmlFor="director" className="block text-gray-300">Director</label>
          <input
            type="text"
            id="director"
            name="director"
            value={movie.director}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-gray-300">Año</label>
            <input
              type="number"
              id="year"
              name="year"
              value={movie.year}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            />
          </div>

          <div>
            <label htmlFor="genre" className="block text-gray-300">Género</label>
            <select
              id="genre"
              name="genre"
              value={movie.genre}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            >
              <option value="">Seleccionar</option>
              <option value="action">Acción</option>
              <option value="comedy">Comedia</option>
              <option value="romance">Romántica</option>
              <option value="thriller">Suspenso</option>
              <option value="adventure">Aventura</option>
              <option value="animation">Animación</option>
              <option value="family">Familia</option>
              <option value="drama">Drama</option>
              <option value="horror">Terror</option>
              <option value="scifi">Ciencia Ficción</option>
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-gray-300">URL de Imagen</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={movie.imageUrl}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
            placeholder="http://ejemplo.com/imagen.jpg"
          />
        </div>

        <div>
          <label htmlFor="rating" className="block text-gray-300">Rating (0-10)</label>
          <input
            type="number"
            id="rating"
            name="rating"
            min="0"
            max="10"
            step="0.1"
            value={movie.rating}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isFeatured"
            name="isFeatured"
            checked={movie.isFeatured}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="isFeatured" className="text-gray-300">Película destacada</label>
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-600 text-white rounded"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-red-600 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default MovieFormSimple;

