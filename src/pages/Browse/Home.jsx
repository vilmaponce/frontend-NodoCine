import { useEffect, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import CardMovie from '../../components/movies/CardMovie';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Watchlist from '../../pages/Browse/Watchlist';

export default function Home() {
  const { currentProfile } = useProfile();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingWatchlist, setIsLoadingWatchlist] = useState(true);

  // Redirigir si no hay perfil seleccionado
  useEffect(() => {
    if (!currentProfile) {
      navigate('/select-profile');
    }
  }, [currentProfile, navigate]);

  // Cargar películas
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get('http://localhost:3001/api/movies');
        
        // Filtrar por perfil infantil
        const filteredMovies = currentProfile?.isChild 
          ? response.data.filter(movie => movie.isForKids)
          : response.data;
        
        setMovies(filteredMovies);
      } catch (error) {
        console.error("Error loading movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentProfile) {
      loadMovies();
    }
  }, [currentProfile]);

  // Cargar watchlist
  useEffect(() => {
    const loadWatchlist = async () => {
      if (!currentProfile) return;
      
      try {
        setIsLoadingWatchlist(true);
        
        // Intentar obtener la watchlist
        try {
          const token = localStorage.getItem('token');
          const response = await axios.get(
            `http://localhost:3001/api/profiles/${currentProfile._id}/watchlist`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          
          setWatchlistMovies(response.data || []);
        } catch (err) {
          console.error("Error al cargar watchlist:", err);
          // Si hay error, mostrar lista vacía
          setWatchlistMovies([]);
        }
      } finally {
        setIsLoadingWatchlist(false);
      }
    };
    
    loadWatchlist();
  }, [currentProfile]);

  const handleRemoveFromWatchlist = (movieId) => {
    setWatchlistMovies(prev => prev.filter(movie => movie._id !== movieId));
  };

  if (isLoading || !currentProfile) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-900">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-white">Cargando...</div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header showProfileSwitch={true} />
      
      <main className="flex-grow">
        {/* Mostrar botón de administración si el usuario es admin */}
      {isAdmin && (
        <div className="container mx-auto px-4 py-4">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg mb-6">
            <div className="flex justify-between items-center">
              <h3 className="text-white font-bold">Acceso de Administrador</h3>
              <button
                onClick={() => navigate('/admin')}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Ir al Panel de Administración
              </button>
            </div>
          </div>
        </div>
      )}
        {/* Banner destacado */}
        {movies.length > 0 && (
          <div className="relative h-96 w-full">
            <img
              src={movies[0].imageUrl?.includes('http') 
                ? movies[0].imageUrl 
                : `http://localhost:3001${movies[0].imageUrl || ''}`}
              alt={movies[0].title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/default-movie.jpg';
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
              <h2 className="text-4xl font-bold text-white">{movies[0].title}</h2>
              <p className="text-gray-300 mt-2 line-clamp-2">{movies[0].description}</p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Bienvenido, <span className="text-red-500">{currentProfile.name}</span>
          </h1>

          {/* Watchlist */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Mi Lista</h2>
            {isLoadingWatchlist ? (
              <div className="text-gray-400 text-center">Cargando lista...</div>
            ) : watchlistMovies.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {watchlistMovies.map(movie => (
                  <CardMovie 
                    key={movie._id} 
                    movie={movie} 
                    onRemove={handleRemoveFromWatchlist}
                  />
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center">
                No tienes películas en tu lista. Añade tus favoritas dando clic en "+ Lista"
              </div>
            )}
          </section>

          {/* Todas las películas */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentProfile.isChild ? 'Películas Infantiles' : 'Todas las Películas'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <CardMovie 
                  key={movie._id} 
                  movie={movie}
                />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}