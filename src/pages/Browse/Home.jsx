import { useEffect, useState } from 'react';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import CardMovie from '../../components/movies/CardMovie';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

import ErrorMessage from '../../components/ui/ErrorMessage';

export default function Home() {
  const { currentProfile } = useProfile();
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentProfile) {
      navigate('/profiles');
      return;
    }

    const loadMovies = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:3001/api/movies');
        
        if (!response.ok) throw new Error('Error al cargar películas');
        
        const data = await response.json();
        setMovies(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadMovies();
  }, [currentProfile, navigate]);

  if (!currentProfile) {
    return <LoadingSpinner message="Redirigiendo..." />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <LoadingSpinner message="Cargando películas..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <ErrorMessage 
            message="Error al cargar películas" 
            error={error} 
            onRetry={() => window.location.reload()} 
          />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* Header con navegación */}
      <Header showAuthButtons={true} />
      
      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">
            Bienvenido, <span className="text-red-500">{currentProfile.name}</span>
          </h1>
          <p className="text-gray-400 mt-2">Explora nuestro catálogo</p>
        </div>

        {/* Grid de películas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map(movie => (
            <CardMovie key={movie._id} movie={movie} />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}