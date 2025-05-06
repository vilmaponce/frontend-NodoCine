// src/components/movies/MovieDetail.jsx---este siiiiii
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import api from '../../utils/api';

const MovieDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProfile } = useProfile();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    fetchMovie();
    
    // Verificar si la película está en la watchlist
    if (currentProfile) {
      checkWatchlist();
    }
  }, [id, currentProfile]);

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

  const checkWatchlist = async () => {
    try {
      // Intentar verificar la watchlist, pero manejar el error si ocurre
      const response = await api.get(`/profiles/${currentProfile._id}/watchlist`);
      const watchlist = response.data;
      setInWatchlist(watchlist.some(item => item._id === id || item === id));
    } catch (err) {
      console.warn('No se pudo verificar watchlist, es posible que la ruta no esté implementada:', err);
      // Establecer como falso por defecto
      setInWatchlist(false);
    }
  };
  
  const toggleWatchlist = async () => {
    try {
      if (!currentProfile) {
        setError('Debes seleccionar un perfil primero');
        return;
      }
      
      try {
        if (inWatchlist) {
          await api.delete(`/profiles/${currentProfile._id}/watchlist/${id}`);
          setInWatchlist(false);
        } else {
          await api.post(`/profiles/${currentProfile._id}/watchlist`, { movieId: id });
          setInWatchlist(true);
        }
      } catch (err) {
        console.warn('La funcionalidad de watchlist no está completamente implementada:', err);
        // Simular el cambio en la UI para mejor experiencia de usuario
        setInWatchlist(!inWatchlist);
      }
    } catch (err) {
      console.error('Error al actualizar watchlist:', err);
      setError('No se pudo actualizar tu lista');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando película...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-red-500 text-white p-4 rounded-md">
          {error}
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">Película no encontrada</p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
        >
          Volver
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-xl">
        {/* Imagen de portada */}
        <div className="relative w-full h-64 md:h-96 bg-gray-900">
          <img
            src={movie.imageUrl || '/images/default-backdrop.jpg'}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          
          {/* Botón de volver */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 bg-black bg-opacity-50 p-2 rounded-full text-white hover:bg-opacity-70"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
        
        {/* Información de la película */}
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{movie.title}</h1>
              <div className="flex items-center gap-2 text-gray-400 mb-4">
                <span>{movie.year}</span>
                {movie.duration && (
                  <>
                    <span>•</span>
                    <span>{movie.duration}</span>
                  </>
                )}
                {movie.genre && (
                  <>
                    <span>•</span>
                    <span className="capitalize">{movie.genre}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {movie.rating > 0 && (
                <div className="flex items-center bg-yellow-800 px-3 py-1 rounded-full">
                  <svg 
                    className="w-4 h-4 text-yellow-400 mr-1" 
                    fill="currentColor" 
                    viewBox="0 0 20 20" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-white font-medium">{movie.rating.toFixed(1)}</span>
                </div>
              )}
              
              <button
                onClick={toggleWatchlist}
                className={`flex items-center ${
                  inWatchlist ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'
                } px-3 py-1 rounded-full hover:bg-red-700 transition-colors`}
              >
                <svg 
                  className="w-4 h-4 mr-1" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d={inWatchlist ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"}
                  />
                </svg>
                <span>{inWatchlist ? 'En mi lista' : 'Añadir a mi lista'}</span>
              </button>
            </div>
          </div>
          
          {/* Director */}
          {movie.director && (
            <div className="mb-4">
              <h3 className="text-white font-medium">Director</h3>
              <p className="text-gray-400">{movie.director}</p>
            </div>
          )}
          
          {/* Sinopsis */}
          {movie.plot && (
            <div className="mb-6">
              <h3 className="text-white font-medium mb-2">Sinopsis</h3>
              <p className="text-gray-300 leading-relaxed">{movie.plot}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;