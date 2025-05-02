import { useEffect, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import CardMovie from '../../components/movies/CardMovie';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';


export default function Home() {
  const { currentProfile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [featuredMovies, setFeaturedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirigir si no hay perfil seleccionado o si es admin
  useEffect(() => {
    if (!currentProfile) {
      navigate('/select-profile');
    }
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [currentProfile, user, navigate]);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/movies');
        const data = await response.json();
        
        // Filtrar por perfil infantil
        const filteredMovies = currentProfile?.isChild 
          ? data.filter(movie => movie.isForKids)
          : data;
        
        setMovies(filteredMovies);
        setFeaturedMovies(filteredMovies.slice(0, 3)); // Primeras 3 películas como destacadas
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

  if (isLoading || !currentProfile) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header showProfileSwitch={true} />
      
      <main className="flex-grow">
        {/* Banner destacado */}
        {featuredMovies.length > 0 && (
          <div className="relative h-96 w-full">
            <img
              src={featuredMovies[0].imageUrl.includes('http') 
                ? featuredMovies[0].imageUrl 
                : `http://localhost:3001${featuredMovies[0].imageUrl}`}
              alt={featuredMovies[0].title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-8">
              <h2 className="text-4xl font-bold text-white">{featuredMovies[0].title}</h2>
              <p className="text-gray-300 mt-2 line-clamp-2">{featuredMovies[0].description}</p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-white mb-6">
            Bienvenido, <span className="text-red-500">{currentProfile.name}</span>
          </h1>

          {/* Watchlist integrada */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">Mi Lista</h2>
            <Watchlist profileId={currentProfile._id} />
          </section>

          {/* Películas */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-4">
              {currentProfile.isChild ? 'Películas Infantiles' : 'Todas las Películas'}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movies.map(movie => (
                <CardMovie 
                  key={movie._id} 
                  movie={movie} 
                  inWatchlist={currentProfile?.watchlist?.some(m => m._id === movie._id)}
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

// Componente de carga
function LoadingScreen() {
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