import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Watchlist({ profileId }) {
  const { user } = useAuth();
  const [movies, setMovies] = useState([]);

  const fetchWatchlist = async () => {
    const res = await axios.get(`/api/profiles/${profileId}/watchlist`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setMovies(res.data);
  };

  const removeMovie = async (movieId) => {
    await axios.delete(`/api/profiles/${profileId}/watchlist/${movieId}`, {
      headers: { Authorization: `Bearer ${user.token}` }
    });
    fetchWatchlist(); // Refrescar lista
  };

  useEffect(() => { fetchWatchlist(); }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {movies.map(movie => (
        <div key={movie._id} className="relative group">
          <img 
            src={movie.imageUrl} 
            alt={movie.title}
            className="rounded-lg w-full h-48 object-cover"
          />
          <button
            onClick={() => removeMovie(movie._id)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}