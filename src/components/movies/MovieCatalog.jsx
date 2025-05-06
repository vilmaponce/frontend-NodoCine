// src/components/movies/MovieCatalog.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import api from '../../utils/api';

const MovieCatalog = () => {
  const [movies, setMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const { currentProfile } = useProfile();

  // Géneros disponibles
  const genres = [
    { value: '', label: 'Todos los géneros' },
    { value: 'action', label: 'Acción' },
    { value: 'comedy', label: 'Comedia' },
    { value: 'drama', label: 'Drama' },
    { value: 'horror', label: 'Terror' },
    { value: 'scifi', label: 'Ciencia Ficción' },
    { value: 'animation', label: 'Animación' }
  ];

  useEffect(() => {
    fetchMovies();
  }, []);

  // Cargar películas
  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/movies');
      
      // Filtrar películas según el perfil (si es niño, mostrar solo animación)
      let availableMovies = response.data;
      if (currentProfile?.isChild) {
        availableMovies = availableMovies.filter(movie => 
          movie.genre === 'animation' || movie.rating <= 7
        );
      }
      
      setMovies(availableMovies);
      setFilteredMovies(availableMovies);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar películas:', err);
      setError('No se pudieron cargar las películas');
      setLoading(false);
    }
  };

  // Filtrar películas según búsqueda y género
  useEffect(() => {
    let result = movies;
    
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(movie => 
        movie.title.toLowerCase().includes(term) || 
        (movie.director && movie.director.toLowerCase().includes(term))
      );
    }
    
    // Filtrar por género
    if (genreFilter) {
      result = result.filter(movie => movie.genre === genreFilter);
    }
    
    setFilteredMovies(result);
  }, [searchTerm, genreFilter, movies]);

  // Agregar película a la watchlist
  const addToWatchlist = async (movieId) => {
    try {
      if (!currentProfile) {
        setError('Debes seleccionar un perfil primero');
        return;
      }
      
      await api.post(`/profiles/${currentProfile._id}/watchlist`, { movieId });
      alert('Película añadida a tu lista');
    } catch (err) {
      console.error('Error al añadir a watchlist:', err);
      setError('No se pudo añadir la película a tu lista');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando películas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Películas</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:w-1/2">
          <input
            type="text"
            placeholder="Buscar por título o director..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="md:w-1/2">
          <select
            value={genreFilter}
            onChange={(e) => setGenreFilter(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {genres.map(genre => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Catálogo de películas */}
      {filteredMovies.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No se encontraron películas con estos filtros</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map(movie => (
            <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105">
              <Link to={`/movies/${movie._id}`}>
                <img
                  src={movie.imageUrl || '/images/default-movie.jpg'}
                  alt={movie.title}
                  className="w-full h-56 object-cover"
                />
              </Link>
              <div className="p-4">
                <Link to={`/movies/${movie._id}`}>
                  <h3 className="text-lg font-medium text-white mb-1 hover:text-red-500">
                    {movie.title}
                  </h3>
                </Link>
                <p className="text-sm text-gray-400 mb-1">{movie.year} • {movie.duration}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-yellow-400">{movie.rating}/10</span>
                  <button
                    onClick={() => addToWatchlist(movie._id)}
                    className="text-sm text-gray-300 hover:text-red-500"
                    title="Añadir a mi lista"
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MovieCatalog;