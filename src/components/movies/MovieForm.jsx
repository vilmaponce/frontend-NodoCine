// src/components/movies/MovieForm.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const MovieForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  
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

  // Cargar datos de la película si estamos en modo edición
  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return; // Si no hay ID, estamos en modo creación
      
      try {
        setLoading(true);
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
        
        if (response.data.imageUrl) {
          setPreviewUrl(response.data.imageUrl);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error al cargar película:', err);
        setError('No se pudo cargar la información de la película');
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setMovie({
      ...movie,
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
      
      // Agregar campos de la película
      Object.keys(movie).forEach(key => {
        if (key !== 'imageUrl' || !image) {
          formData.append(key, movie[key]);
        }
      });
      
      // Agregar imagen si existe
      if (image) {
        formData.append('image', image);
      }
      
      let response;
      
      if (id) {
        // Modo edición
        response = await api.put(`/movies/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Película actualizada:', response.data);
      } else {
        // Modo creación
        response = await api.post('/movies', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log('Película creada:', response.data);
      }
      
      // Redirigir a la lista de películas
      navigate('/admin/movies');
      
    } catch (err) {
      console.error('Error al guardar película:', err);
      setError(err.response?.data?.message || 'Error al guardar la película');
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-6">
        {id ? 'Editar Película' : 'Crear Nueva Película'}
      </h2>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label htmlFor="title" className="block text-gray-300 mb-1">
            Título *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={movie.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        {/* Director */}
        <div>
          <label htmlFor="director" className="block text-gray-300 mb-1">
            Director
          </label>
          <input
            id="director"
            name="director"
            type="text"
            value={movie.director}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        {/* Año y Duración (fila) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="year" className="block text-gray-300 mb-1">
              Año
            </label>
            <input
              id="year"
              name="year"
              type="number"
              min="1900"
              max="2099"
              value={movie.year}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="duration" className="block text-gray-300 mb-1">
              Duración (min)
            </label>
            <input
              id="duration"
              name="duration"
              type="text"
              placeholder="90 min"
              value={movie.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
        
        {/* Género */}
        <div>
          <label htmlFor="genre" className="block text-gray-300 mb-1">
            Género
          </label>
          <select
            id="genre"
            name="genre"
            value={movie.genre}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="">Seleccionar género</option>
            <option value="action">Acción</option>
            <option value="comedy">Comedia</option>
            <option value="drama">Drama</option>
            <option value="horror">Terror</option>
            <option value="scifi">Ciencia Ficción</option>
            <option value="thriller">Thriller</option>
            <option value="animation">Animación</option>
            <option value="documentary">Documental</option>
          </select>
        </div>
        
        {/* Rating */}
        <div>
          <label htmlFor="rating" className="block text-gray-300 mb-1">
            Rating (0-10)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={movie.rating}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        {/* Imagen */}
        <div>
          <label className="block text-gray-300 mb-1">
            Imagen de portada
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          
          {previewUrl && (
            <div className="mt-2">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="h-40 object-contain rounded border border-gray-600"
              />
            </div>
          )}
        </div>
        
        {/* Destacado */}
        <div className="flex items-center">
          <input
            id="isFeatured"
            name="isFeatured"
            type="checkbox"
            checked={movie.isFeatured}
            onChange={handleChange}
            className="h-4 w-4 text-red-600 border-gray-500 rounded focus:ring-red-500 bg-gray-700"
          />
          <label htmlFor="isFeatured" className="ml-2 block text-gray-300">
            Destacar en inicio
          </label>
        </div>
        
        {/* Botones */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => navigate('/admin/movies')}
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

export default MovieForm;