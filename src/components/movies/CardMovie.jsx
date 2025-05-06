import React, { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext'; // Añadir esta importación
import axios from 'axios';
import { toast } from 'react-toastify';

export default function CardMovie({ movie, inWatchlist = false, onRemove, onUpdate }) {
  const { user } = useAuth();
  const { currentProfile } = useProfile();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(inWatchlist);
  
  const [imageFailed, setImageFailed] = useState(false);
  const fallbackImage = "/images/default-movie.png";
  
  const imageUrl = imageFailed 
    ? fallbackImage 
    : (movie.imageUrl?.includes('http') 
      ? movie.imageUrl 
      : `http://localhost:3001${movie.imageUrl || ''}`);

  // Verificar si la película está en la watchlist
  useEffect(() => {
    setIsInWatchlist(inWatchlist);
  }, [inWatchlist]);

  const handleAddToWatchlist = async () => {
    if (!currentProfile) {
      toast.error('Selecciona un perfil primero');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:3001/api/profiles/${currentProfile._id}/watchlist`,
        { movieId: movie._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInWatchlist(true);
      toast.success('Película añadida a la lista');
    } catch (err) {
      console.error('Error al agregar a la lista', err);
      toast.error('Error al añadir película');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async () => {
    if (!currentProfile) {
      toast.error('Selecciona un perfil primero');
      return;
    }
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3001/api/profiles/${currentProfile._id}/watchlist/${movie._id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInWatchlist(false);
      onRemove && onRemove(movie._id);
      toast.success('Película eliminada de la lista');
    } catch (err) {
      console.error('Error al eliminar de la lista', err);
      toast.error('Error al eliminar película');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:z-10 hover:scale-105">
      <img
        src={imageUrl}
        alt={movie.title}
        className="w-full h-auto"
        onError={() => setImageFailed(true)}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg truncate">{movie.title}</h3>
        <p className="text-gray-300 text-sm">{movie.genre}</p>
        <div className="flex mt-2 space-x-2 flex-wrap">
          <button
            className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition"
            onClick={() => navigate(`/movies/${movie._id}`)}
          >
            Ver
          </button>

          {!isInWatchlist ? (
            <button
              onClick={handleAddToWatchlist}
              disabled={loading}
              className="bg-gray-600/70 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-500 transition"
            >
              {loading ? '...' : '+ Lista'}
            </button>
          ) : (
            <>
              <button
                onClick={handleRemoveFromWatchlist}
                disabled={loading}
                className="bg-red-600 text-white px-3 py-1 rounded-full text-xs hover:bg-red-500 transition"
              >
                {loading ? '...' : 'Eliminar'}
              </button>
              {onUpdate && (
                <button
                  onClick={() => onUpdate(movie)}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs hover:bg-blue-500 transition"
                >
                  Editar
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}