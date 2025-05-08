// src/components/admin/MovieList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await api.get('/movies');
      setMovies(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar películas:', err);
      setError('No se pudieron cargar las películas');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/movies/${id}`);
      // Actualizar la lista después de eliminar
      setMovies(movies.filter(movie => movie._id !== id));
      setConfirmDelete(null);
    } catch (err) {
      console.error('Error al eliminar película:', err);
      setError('No se pudo eliminar la película');
    }
  };

  if (loading) {
    return <div className="text-center py-10">Cargando películas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Administrar Películas</h1>
        <Link
          to="/admin/movies/add"
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Añadir Película
        </Link>
      </div>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded-md mb-4">
          {error}
        </div>
      )}

      {movies.length === 0 ? (
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <p className="text-gray-400">No hay películas disponibles. ¡Añade una!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Película
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Año
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Destacada
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {movies.map((movie) => (
                <tr key={movie._id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <img
                          className="h-10 w-10 rounded object-cover"
                          src={movie.imageUrl || '/images/default-movie.jpg'}
                          alt={movie.title}
                        />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white">{movie.title}</div>
                        <div className="text-sm text-gray-400">{movie.director}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.rating}/10
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {movie.isFeatured ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-800 text-green-100">
                        Sí
                      </span>
                    ) : (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-700 text-gray-400">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/movies/${movie._id}`}
                        className="text-blue-400 hover:text-blue-300"
                      >
                        Ver
                      </Link>
                      <Link
                        to={`/admin/movies/edit/${movie._id}`}
                        className="text-indigo-400 hover:text-indigo-300"
                      >
                        Editar
                      </Link>
                      {confirmDelete === movie._id ? (
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleDelete(movie._id)}
                            className="text-red-500 hover:text-red-400"
                          >
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-gray-400 hover:text-gray-300"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(movie._id)}
                          className="text-red-500 hover:text-red-400"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MovieList;