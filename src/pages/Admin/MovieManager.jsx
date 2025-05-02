import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import MovieForm from '../../components/admin/MovieForm';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function MovieManager() {
    const { user } = useAuth();
    const [movies, setMovies] = useState([]);
    const [editingMovie, setEditingMovie] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);

    const handleSave = async (movieData) => {
        try {
            const isEditing = !!movieData._id;
            const url = isEditing
                ? `/api/movies/${movieData._id}`
                : '/api/movies';

            const response = await fetch(url, {
                method: isEditing ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(movieData)
            });

            const result = await response.json();
            const updatedMovie = result.movie || result;

            if (!response.ok || !updatedMovie) {
                throw new Error(result.error || 'Error al guardar');
            }

            setMovies(prev => isEditing
                ? prev.map(m => m._id === updatedMovie._id ? updatedMovie : m)
                : [...prev, updatedMovie]
            );

            toast.success(isEditing ? '🎬 Película actualizada' : '🍿 Película creada');

        } catch (error) {
            console.error('Error al guardar:', error);
            toast.error(error.message);
            fetchMovies();
        } finally {
            setShowForm(false);
            setEditingMovie(null);
        }
    };

    const fetchMovies = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/movies', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) throw new Error('Error al cargar películas');

            const data = await response.json();

            if (!Array.isArray(data)) {
                throw new Error('Formato de datos inválido');
            }

            setMovies(data);
        } catch (error) {
            console.error("Error:", error);
            toast.error(error.message);
            setMovies([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Eliminar esta película permanentemente?')) return;

        try {
            const response = await fetch(`/api/movies/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!response.ok) throw new Error('Error al eliminar');

            toast.success('Película eliminada');
            fetchMovies();
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => { fetchMovies(); }, []);

    return (
        <div className="p-6 bg-gray-900 min-h-screen">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Administrar Películas</h1>
                <button
                    onClick={() => {
                        setEditingMovie(null);
                        setShowForm(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
                >
                    + Añadir Película
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : movies.length === 0 ? (
                <div className="text-center text-white py-8">
                    No hay películas disponibles
                </div>
            ) : (
                <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
                    <table className="min-w-full">
                        <thead className="bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-white">Portada</th>
                                <th className="px-6 py-3 text-left text-white">Título</th>
                                <th className="px-6 py-3 text-left text-white">Año</th>
                                <th className="px-6 py-3 text-left text-white">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-700">
                            {movies.map(movie => (
                                <tr key={movie._id} className="hover:bg-gray-750">
                                    <td className="px-6 py-4">
                                        <img
                                            src={movie.imageUrl}
                                            alt={movie.title}
                                            className="h-20 w-14 object-cover rounded"
                                            onError={(e) => {
                                                e.target.src = '/images/default-movie.png';
                                            }}
                                        />
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">
                                        {movie.title}
                                    </td>
                                    <td className="px-6 py-4 text-white">
                                        {movie.year}
                                    </td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button
                                            onClick={() => {
                                                setEditingMovie(movie);
                                                setShowForm(true);
                                            }}
                                            className="text-yellow-400 hover:text-yellow-300"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(movie._id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {showForm && (
                <MovieForm
                    movie={editingMovie || {}}
                    onClose={() => {
                        setShowForm(false);
                        setEditingMovie(null);
                        toast.info('Edición cancelada', {
                            position: "top-center",
                            autoClose: 2000
                        });
                    }}
                    onSave={async (formData) => {
                        try {
                            const isEditing = !!editingMovie;
                            const url = isEditing
                                ? `/api/movies/${editingMovie._id}`
                                : '/api/movies';

                            const response = await fetch(url, {
                                method: isEditing ? 'PUT' : 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${user.token}`
                                },
                                body: JSON.stringify(formData)
                            });

                            const result = await response.json();
                            const updatedMovie = result.movie || result;

                            if (!response.ok || !updatedMovie) {
                                throw new Error(result.error || 'Error al guardar');
                            }

                            setMovies(prev => isEditing
                                ? prev.map(m => m._id === updatedMovie._id ? updatedMovie : m)
                                : [...prev, updatedMovie]
                            );

                            toast.success(isEditing ? 'Película actualizada' : 'Película creada', {
                                position: "top-center",
                                autoClose: 3000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true
                            });

                        } catch (error) {
                            console.error('Error al guardar:', error);
                            toast.error(error.message || 'Error al guardar', {
                                position: "top-center",
                                autoClose: 5000
                            });
                        } finally {
                            setShowForm(false);
                            setEditingMovie(null);
                        }
                    }}
                    onBackToList={() => {
                        setShowForm(false);
                        toast.info('Volviendo al listado', {
                            position: "top-center",
                            autoClose: 2000
                        });
                    }}
                />
            )}
        </div>
    );
}
