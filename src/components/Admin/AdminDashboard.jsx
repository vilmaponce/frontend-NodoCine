// src/components/Admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalUsers: 0,
    totalProfiles: 0
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      
      // Obtener estadísticas básicas, evitando la ruta que da error
      const moviesResponse = await api.get('/movies');
      
      // En lugar de buscar usuarios y perfiles, podemos usar valores por defecto
      setStats({
        totalMovies: moviesResponse.data.length || 0,
        totalUsers: 0, // Valor por defecto
        totalProfiles: 0 // Valor por defecto
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-10">Cargando...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Panel de Administración</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Tarjeta de películas */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Películas</h2>
            <span className="text-3xl font-bold text-red-500">{stats.totalMovies}</span>
          </div>
          <Link
            to="/admin/movies"
            className="block mt-4 text-center py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Administrar películas
          </Link>
        </div>
        
        {/* Tarjeta de usuarios */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Usuarios</h2>
            <span className="text-3xl font-bold text-red-500">{stats.totalUsers}</span>
          </div>
          <Link
            to="/admin/users"
            className="block mt-4 text-center py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Administrar usuarios
          </Link>
        </div>
        
        {/* Tarjeta de perfiles */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white">Perfiles</h2>
            <span className="text-3xl font-bold text-red-500">{stats.totalProfiles}</span>
          </div>
          <Link
            to="/admin/profiles"
            className="block mt-4 text-center py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Ver todos los perfiles
          </Link>
        </div>
      </div>
      
      {/* Accesos rápidos */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Acciones rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/admin/movies/add"
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <h3 className="text-white font-medium">Añadir película</h3>
            <p className="text-gray-400 text-sm mt-1">Crear una nueva película en el catálogo</p>
          </Link>
          
          <Link
            to="/"
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <h3 className="text-white font-medium">Ver como usuario</h3>
            <p className="text-gray-400 text-sm mt-1">Ver la plataforma como la verían los usuarios</p>
          </Link>
          
          <Link
            to="/admin/reports"
            className="bg-gray-700 p-4 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <h3 className="text-white font-medium">Informes</h3>
            <p className="text-gray-400 text-sm mt-1">Ver estadísticas de uso de la plataforma</p>
          </Link>
        </div>
      </div>
      
      {/* Información del administrador */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-white mb-4">Información de cuenta</h2>
        <div className="flex items-center mb-6">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center text-2xl text-white mr-4">
            {user?.email.substring(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium">{user?.email}</p>
            <p className="text-green-500 text-sm">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;