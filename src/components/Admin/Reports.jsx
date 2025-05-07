// src/components/Admin/Reports.jsx
import React, { useState, useEffect } from 'react';
import api from '../../utils/api';

const Reports = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalProfiles: 0,
    moviesByGenre: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Obtener películas
        const moviesResponse = await api.get('/movies');
        const movies = moviesResponse.data;
        
        // Calcular estadísticas
        const genreCount = {};
        movies.forEach(movie => {
          if (movie.genre) {
            genreCount[movie.genre] = (genreCount[movie.genre] || 0) + 1;
          }
        });
        
        const moviesByGenre = Object.keys(genreCount).map(genre => ({
          genre,
          count: genreCount[genre]
        }));
        
        setStats({
          totalMovies: movies.length,
          totalUsers: 2, // Valor simulado
          totalProfiles: 3, // Valor simulado
          moviesByGenre
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar estadísticas:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Cargando estadísticas...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Reportes y Estadísticas</h1>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Películas</h2>
          <p className="text-3xl font-bold text-red-500">{stats.totalMovies}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Usuarios</h2>
          <p className="text-3xl font-bold text-red-500">{stats.totalUsers}</p>
        </div>
        
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h2 className="text-xl font-semibold text-white mb-2">Perfiles</h2>
          <p className="text-3xl font-bold text-red-500">{stats.totalProfiles}</p>
        </div>
      </div>
      
      {/* Películas por género */}
      <div className="bg-gray-800 p-6 rounded-lg mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Películas por Género</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-700 rounded-lg">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Género
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase">
                  Porcentaje
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {stats.moviesByGenre.map(item => (
                <tr key={item.genre} className="hover:bg-gray-600">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                    {item.genre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {item.count}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {Math.round((item.count / stats.totalMovies) * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;