import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import MovieForm from './Admin/MovieForm'; // Componente para el formulario de película
import Header from '../ui/Header';
import Footer from '../ui/Footer';// Componente de pie de página

export default function MovieList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingMovie, setEditingMovie] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const { user } = useAuth();

  // Configuración común para Axios
  const axiosConfig = {
    headers: user?.token ? { Authorization: `Bearer ${user.token}` } : {}
  };

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('http://localhost:3001/api/movies', axiosConfig);
      setMovies(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar películas');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta película?')) return;
    
    try {
      await axios.delete(`http://localhost:3001/api/movies/${id}`, axiosConfig);
      setMovies(movies.filter(movie => movie._id !== id));
      setSuccessMessage('Película eliminada correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar película');
      console.error('Error:', err);
    }
  };

  const handleUpdate = async (updatedMovie) => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/movies/${updatedMovie._id}`,
        updatedMovie,
        axiosConfig
      );
      
      setMovies(movies.map(movie => 
        movie._id === updatedMovie._id ? response.data : movie
      ));
      setEditingMovie(null);
      setSuccessMessage('Película actualizada correctamente');
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al actualizar película');
      console.error('Error:', err);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [user?.token]);

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  if (error) return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
      <p>{error}</p>
      <button 
        onClick={fetchMovies}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm"
      >
        Reintentar
      </button>
    </div>
  );

  return (
    <div className="p-4">
      <Header /> {/* Aquí está tu Header */}

      {successMessage && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
          {successMessage}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Catálogo de Películas</h2>
        <button
          onClick={() => setEditingMovie({})}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + Añadir Película
        </button>
      </div>
      
      {movies.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No hay películas disponibles</p>
          <button
            onClick={fetchMovies}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Recargar
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map(movie => (
            <div key={movie._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative h-48 bg-gray-200">
                <img
                  src={movie.imageUrl ? `http://localhost:3001${movie.imageUrl}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x450?text=No+Image';
                  }}
                />
                <span className="absolute top-2 right-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
                  ⭐ {movie.rating || 'N/A'}
                </span>
              </div>
              
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{movie.title}</h3>
                <p className="text-gray-600 text-sm mb-1">
                  {movie.director && <span>Dir: {movie.director}</span>}
                </p>
                <div className="flex justify-between text-xs text-gray-500 mb-3">
                  <span>{movie.year}</span>
                  <span>{movie.genre}</span>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingMovie(movie)}
                    className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(movie._id)}
                    className="flex-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {editingMovie && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingMovie._id ? 'Editar Película' : 'Añadir Película'}
              </h3>
              <button 
                onClick={() => setEditingMovie(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <MovieForm 
              movie={editingMovie} 
              onSubmit={handleUpdate}
              onCancel={() => setEditingMovie(null)}
            />
          </div>
        </div>
      )}

      <Footer /> {/* Aquí está tu Footer */}
    </div>
  );
}
