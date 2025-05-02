// src/components/movies/CardMovie.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function CardMovie({ movie, inWatchlist = false, onRemove, onUpdate }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleAddToWatchlist = async () => {
    try {
      setLoading(true);
      await axios.post(
        `/api/profiles/${user.profileId}/watchlist`,
        { movieId: movie._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
    } catch (err) {
      console.error('Error al agregar a la lista', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `/api/profiles/${user.profileId}/watchlist/${movie._id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      onRemove && onRemove();
    } catch (err) {
      console.error('Error al eliminar de la lista', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:z-10 hover:scale-105">
      <img
        src={movie.imageUrl.includes('http')
          ? movie.imageUrl
          : `http://localhost:3001${movie.imageUrl}`}
        alt={movie.title}
        className="w-full h-auto"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg truncate">{movie.title}</h3>
        <p className="text-gray-300 text-sm">{movie.genre}</p>
        <div className="flex mt-2 space-x-2 flex-wrap">
          <button
            className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate(`/movie/${movie._id}`)}
          >
            Ver
          </button>

          {!inWatchlist && (
            <button
              onClick={handleAddToWatchlist}
              disabled={loading}
              className="bg-gray-600/70 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-500 transition"
            >
              {loading ? '...' : '+ Lista'}
            </button>
          )}

          {inWatchlist && (
            <>
              <button
                onClick={handleRemoveFromWatchlist}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded-full text-xs hover:bg-red-500 transition"
              >
                {loading ? '...' : 'Eliminar'}
              </button>
              <button
                onClick={() => onUpdate?.(movie)}
                className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-500 transition"
              >
                Editar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}