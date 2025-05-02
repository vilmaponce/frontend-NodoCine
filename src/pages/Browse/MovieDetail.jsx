import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../components/ui/LoadingSpinner';


export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentProfile, updateProfile } = useProfile();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [apiMovieData, setApiMovieData] = useState(null); // Datos de API externa

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        
        // 1. Obtener datos de tu API
        const localResponse = await axios.get(`/api/movies/${id}`);
        setMovie(localResponse.data);
        
        // 2. Verificar si está en watchlist
        if (currentProfile) {
          const inList = currentProfile.watchlist?.some(m => m._id === id);
          setIsInWatchlist(inList);
        }
        
        // 3. Obtener datos adicionales de API externa (OMDB)
        if (localResponse.data.imdbID) {
          const apiResponse = await axios.get(
            `https://www.omdbapi.com/?i=${localResponse.data.imdbID}&apikey=${import.meta.env.VITE_OMDB_API_KEY}`
          );
          setApiMovieData(apiResponse.data);
        }
        
      } catch (err) {
        console.error('Error fetching movie:', err);
        setError(err.response?.data?.message || 'Error al cargar la película');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id, currentProfile]);

  const handleWatchlistAction = async () => {
    if (!currentProfile) {
      toast.error('Selecciona un perfil primero');
      navigate('/profiles');
      return;
    }

    try {
      if (isInWatchlist) {
        await axios.delete(
          `/api/profiles/${currentProfile._id}/watchlist/${id}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success('Eliminada de tu lista');
      } else {
        await axios.post(
          `/api/profiles/${currentProfile._id}/watchlist`,
          { movieId: id },
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        toast.success('Agregada a tu lista');
      }
      
      // Actualizar estado local y contexto
      setIsInWatchlist(!isInWatchlist);
      updateProfile(); // Refrescar datos del perfil
      
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar tu lista');
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (error) return <NotFound message={error} />;
  if (!movie) return <NotFound />;

  // Verificar restricción de edad
  if (currentProfile?.isChild && !movie.isForKids) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Contenido no disponible</h2>
          <p>Esta película no está permitida para tu perfil infantil.</p>
          <button
            onClick={() => navigate('/home')}
            className="mt-6 px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner superior con imagen de fondo */}
      <div 
        className="relative h-96 w-full bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${
            movie.backdropUrl || 
            'https://image.tmdb.org/t/p/original' + movie.backdrop_path || 
            '/images/movie-placeholder.jpg'
          })` 
        }}
      >
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <h1 className="text-4xl font-bold">{movie.title}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span className="text-yellow-400">
              {apiMovieData?.imdbRating || movie.rating}/10
            </span>
            <span>{movie.releaseYear}</span>
            <span>{movie.duration} min</span>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Columna izquierda - Poster y acciones */}
          <div className="md:w-1/3 lg:w-1/4">
            <img
              src={movie.imageUrl.startsWith('/') 
                ? `http://localhost:3001${movie.imageUrl}` 
                : movie.imageUrl}
              alt={movie.title}
              className="w-full rounded-lg shadow-lg"
            />
            
            <div className="mt-4 space-y-4">
              <button
                onClick={handleWatchlistAction}
                className={`w-full py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                  isInWatchlist 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isInWatchlist ? (
                  <>
                    <span>★</span>
                    <span>En tu lista</span>
                  </>
                ) : (
                  <>
                    <span>☆</span>
                    <span>Agregar a lista</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Columna derecha - Detalles */}
          <div className="md:w-2/3 lg:w-3/4">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Sinopsis</h2>
              <p className="text-gray-300">
                {apiMovieData?.Plot || movie.description || 'Sin descripción disponible'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-semibold mb-2">Detalles</h3>
                <ul className="space-y-2 text-gray-300">
                  <li><strong>Género:</strong> {movie.genre?.join(', ') || apiMovieData?.Genre}</li>
                  <li><strong>Director:</strong> {apiMovieData?.Director || 'No disponible'}</li>
                  <li><strong>Reparto:</strong> {apiMovieData?.Actors || 'No disponible'}</li>
                  <li><strong>Clasificación:</strong> {apiMovieData?.Rated || (movie.isForKids ? 'Para todos' : 'Adultos')}</li>
                </ul>
              </div>

              {apiMovieData?.Ratings?.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Calificaciones</h3>
                  <ul className="space-y-2">
                    {apiMovieData.Ratings.map((rating, index) => (
                      <li key={index} className="text-gray-300">
                        <strong>{rating.Source}:</strong> {rating.Value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Trailer o video */}
            {movie.trailerUrl && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Tráiler</h3>
                <div className="aspect-w-16 aspect-h-9">
                  <iframe
                    src={`https://www.youtube.com/embed/${movie.trailerUrl}`}
                    title={`Tráiler de ${movie.title}`}
                    allowFullScreen
                    className="w-full h-64 md:h-96 rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}