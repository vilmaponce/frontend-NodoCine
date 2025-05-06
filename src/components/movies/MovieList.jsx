import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import CardMovie from './CardMovie';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await api.get('/movies');
        setMovies(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar películas');
        setLoading(false);
        console.error('Error fetching movies:', err);
      }
    };
    
    fetchMovies();
  }, []);
  
  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Cargando películas...</div>;
  if (error) return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-red-500">{error}</div>;
  
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-3xl font-bold mb-8 text-center">Películas</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {movies.length > 0 ? (
          movies.map(movie => (
            <CardMovie key={movie._id} movie={movie} />
          ))
        ) : (
          <p className="col-span-full text-center text-xl text-gray-500">No hay películas disponibles</p>
        )}
      </div>
    </div>
  );
};

export default MovieList;