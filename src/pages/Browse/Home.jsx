// src/pages/Browse/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfile } from '../../context/ProfileContext';
import api from '../../utils/api';

const Home = () => {
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [recentMovies, setRecentMovies] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { currentProfile } = useProfile();

  useEffect(() => {
    if (currentProfile) {
      fetchData();
    }
  }, [currentProfile]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Cargar películas destacadas
      const featuredResponse = await api.get('/movies?featured=true');
      
      // Cargar películas recientes
      const recentResponse = await api.get('/movies?sort=newest&limit=10');
      
      // Cargar watchlist del perfil actual
      const watchlistResponse = await api.get(`/profiles/${currentProfile._id}/watchlist`);
      
      // Filtrar según perfil (si es niño, mostrar solo animación)
      let filtered = featuredResponse.data;
      if (currentProfile.isChild) {
        filtered = filtered.filter(movie => 
          movie.genre === 'animation' || movie.rating <= 7
        );
      }
      
      setFeaturedMovies(filtered);
      setRecentMovies(recentResponse.data);
      setWatchlist(watchlistResponse.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('No se pudieron cargar los datos');
      setLoading(false);
    }
  };

  // Componente de carrusel horizontal para películas
  const MovieRow = ({ title, movies, moreLink }) => {
    if (movies.length === 0) return null;
    
    return (
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          {moreLink && (
            <Link to={moreLink} className="text-sm text-gray-400 hover:text-white">
              Ver más
            </Link>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <div className="flex space-x-4 pb-4">
            {movies.map(movie => (
              <div 
                key={movie._id} 
                className="flex-none w-52 relative rounded-lg overflow-hidden shadow-lg"
              >
                <Link to={`/movies/${movie._id}`}>
                  <img
                    src={movie.imageUrl || '/images/default-movie.jpg'}
                    alt={movie.title}
                    className="w-full h-72 object-cover hover:opacity-75 transition-opacity"
                  />
                </Link>
                <div className="p-3 bg-gray-800">
                  <Link to={`/movies/${movie._id}`}>
                    <h3 className="text-sm font-medium text-white mb-1 hover:text-red-500 truncate">
                      {movie.title}
                    </h3>
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-yellow-400">{movie.rating}/10</span>
                    <span className="text-xs text-gray-400">{movie.year}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
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
    return <div className="text-center py-10">Cargando contenido...</div>;
  }

  // Obtener película destacada aleatoria
  const featuredMovie = featuredMovies.length > 0 
    ? featuredMovies[Math.floor(Math.random() * featuredMovies.length)] 
    : null;

  return (
    <div className="bg-gray-900">
      {/* Banner principal */}
      {featuredMovie && (
        <div className="relative w-full h-96 md:h-[70vh] mb-8">
          <img
            src={featuredMovie.imageUrl || '/images/default-backdrop.jpg'}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <h1 className="text-4xl font-bold text-white mb-4">{featuredMovie.title}</h1>
              <p className="text-gray-300 mb-6 max-w-xl line-clamp-3">
                {featuredMovie.plot || `Una película de ${featuredMovie.genre || 'género variado'} dirigida por ${featuredMovie.director || 'un talentoso director'}.`}
              </p>
              <div className="flex space-x-4">
                <Link
                  to={`/movies/${featuredMovie._id}`}
                  className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                >
                  Ver detalles
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="container mx-auto p-4">
        {error && (
          <div className="bg-red-500 text-white p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        
        {/* Mi lista */}
        <MovieRow 
          title="Mi Lista" 
          movies={watchlist} 
          moreLink="/watchlist" 
        />
        
        {/* Películas destacadas */}
        <MovieRow 
          title="Destacadas" 
          movies={featuredMovies} 
          moreLink="/movies?featured=true" 
        />
        
        {/* Películas recientes */}
        <MovieRow 
          title="Recién agregadas" 
          movies={recentMovies} 
          moreLink="/movies" 
        />
      </div>
    </div>
  );
};

export default Home;