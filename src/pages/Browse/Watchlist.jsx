import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import api from '../../utils/api';
import CardMovie from '../../components/movies/CardMovie';

export default function Watchlist({ profileId }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user } = useAuth();
  const { currentProfile } = useProfile();

  // Usar el profileId pasado como prop, o usar el del contexto
  const activeProfileId = profileId || currentProfile?._id;

  // En el useEffect de Watchlist
  useEffect(() => {
    const fetchWatchlist = async () => {
      // Verificar que hay un perfil seleccionado
      if (!activeProfileId) {
        setLoading(false);
        setError('No hay un perfil seleccionado');
        setMovies([]); // Inicializar como array vacío
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No hay token disponible');
        }

        try {
          const response = await fetch(`http://localhost:3001/api/profiles/${activeProfileId}/watchlist`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            console.error(`Error ${response.status}: ${response.statusText}`);
            setMovies([]); // Inicializar como array vacío en caso de error
            setLoading(false);
            return; // Salir temprano en caso de error
          }

          const data = await response.json();
          setMovies(data || []);
        } catch (fetchError) {
          console.error('Error al obtener watchlist:', fetchError);
          setMovies([]); // Inicializar como array vacío en caso de error
        }
      } catch (error) {
        console.error('Error general:', error);
        setError('No se pudo cargar la lista de películas');
        setMovies([]); // Inicializar como array vacío en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [activeProfileId]);

  return (
    <div className="watchlist-container">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {movies.map(movie => (
          <CardMovie
            key={movie._id}
            movie={movie}
            inWatchlist={true}
            onRemove={() => handleRemoveMovie(movie._id)}
          />
        ))}
      </div>
    </div>
  );
}