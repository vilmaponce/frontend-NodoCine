// src/components/user/Watchlist.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import api from '../../utils/api';

const Watchlist = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentProfile } = useProfile();

  useEffect(() => {
    if (currentProfile) {
      fetchWatchlist();
    }
  }, [currentProfile]);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/profiles/${currentProfile._id}/watchlist`);
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar watchlist:', err);
      setError('No se pudo cargar tu lista de películas');
      setLoading(false);
    }
  };

  const removeFromWatchlist = async (movieId) => {
    try {
      await api.delete(`/profiles/${currentProfile._id}/watchlist/${movieId}`);
      setMovies(movies.filter(movie => movie._id !== movieId));
    } catch (err) {
      console.error('Error al eliminar de watchlist:', err);
      setError('No se pudo eliminar la película de tu lista');
    }
  };

  if (!currentProfile) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">Debes seleccionar un perfil primero</p>
          <Link
            to="/select-profile"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Seleccionar perfil
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-10">Cargando tu lista...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Mi Lista</h1>
      
      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {movies.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No tienes películas en tu lista</p>
          <Link
            to="/movies"
            className="inline-block mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Explorar películas
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map(movie => (
            <div key={movie._id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg flex">
              <Link to={`/movies/${movie._id}`} className="w-1/3">
                <img
                  src={movie.imageUrl || '/images/default-movie.jpg'}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </Link>
              <div className="p-4 w-2/3 flex flex-col justify-between">
                <div>
                  <Link to={`/movies/${movie._id}`}>
                    <h3 className="text-lg font-medium text-white mb-1 hover:text-red-500">
                      {movie.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-400 mb-2">
                    {movie.year} • {movie.duration}
                  </p>
                  {movie.director && (
                    <p className="text-sm text-gray-400">
                      Director: {movie.director}
                    </p>
                  )}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-yellow-400">{movie.rating}/10</span>
                  <button
                    onClick={() => removeFromWatchlist(movie._id)}
                    className="text-sm text-gray-300 hover:text-red-500"
                    title="Eliminar de mi lista"
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
                        d="M6 18L18 6M6 6l12 12"
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

export default Watchlist;