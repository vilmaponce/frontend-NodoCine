// src/context/MoviesContext.jsx
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useProfile } from '../context/ProfileContext';

export const MoviesContext = createContext();

export const MoviesProvider = ({ children }) => {
  const { currentProfile } = useProfile();
  
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/movies');
        const data = await response.json();
        setMovies(data);
      } catch (error) {
        console.error('Error fetching movies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [currentProfile]);

  const featured = useMemo(() => 
    movies.filter(m => m.isFeatured), 
    [movies]
  );
  
  const trending = useMemo(() => 
    movies.filter(m => m.isTrending), 
    [movies]
  );
  
  const myList = useMemo(() => 
    currentProfile?.watchlist 
      ? movies.filter(m => currentProfile.watchlist.includes(m.id))
      : [], 
    [movies, currentProfile]
  );

  // Mientras se cargan las películas, mostrar un spinner
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-red-500 rounded-full mb-4" />
        <p>Cargando películas...</p>
      </div>
    );
  }

  return (
    <MoviesContext.Provider value={{ 
      movies, 
      featured, 
      trending, 
      myList,
      isLoading
    }}>
      {children}
    </MoviesContext.Provider>
  );
};

export const useMovies = () => {
  const context = useContext(MoviesContext);
  if (!context) {
    throw new Error('useMovies must be used within a MoviesProvider');
  }
  return context;
};
