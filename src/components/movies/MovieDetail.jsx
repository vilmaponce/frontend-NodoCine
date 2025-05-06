// frontend/src/components/movies/MovieDetail.jsx
import { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import api from '../../utils/api';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const response = await api.get(`/movies/${id}`);
        setMovie(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error al cargar la película');
        setLoading(false);
        console.error('Error fetching movie:', err);
      }
    };
    
    fetchMovie();
  }, [id]);
  
  if (loading) return <div>Cargando película...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!movie) return <div>Película no encontrada</div>;
  
  return (
    <div className="movie-detail">
      <div className="movie-header">
        <h1>{movie.title}</h1>
        {isAdmin && (
          <Link to={`/admin/movies/edit/${movie._id}`} className="btn btn-primary">
            Editar Película
          </Link>
        )}
      </div>
      
      <div className="movie-content">
        <div className="movie-poster">
          <img src={movie.poster} alt={movie.title} />
        </div>
        
        <div className="movie-info">
          <p><strong>Año:</strong> {movie.year}</p>
          <p><strong>Director:</strong> {movie.director}</p>
          <p><strong>Género:</strong> {movie.genre}</p>
          <p><strong>Duración:</strong> {movie.duration} min</p>
          
          <div className="movie-description">
            <h3>Sinopsis</h3>
            <p>{movie.description}</p>
          </div>
          
          {isAuthenticated && (
            <button className="btn btn-secondary">
              Añadir a Favoritos
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;