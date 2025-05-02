// src/pages/Admin/Admin.jsx
import { useAuth } from '../../context/AuthContext';
import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const AdminPage = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div className="text-white">Cargando...</div>;
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b border-gray-700 pb-4">
          <h1 className="text-2xl font-bold">Panel de Administración</h1>
          <button 
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
          >
            Cerrar sesión
          </button>
        </div>
        
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          {/* 🔽 MENÚ DE NAVEGACIÓN 🔽 */}
          <nav className="flex gap-4 mb-6">
            <button
              onClick={() => navigate('/admin/movies')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
            >
              Administrar Películas
            </button>
            <button
              onClick={() => navigate('/admin/profiles')}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
            >
              Administrar Perfiles
            </button>
          </nav>

          {/* CONTENIDO DE LAS SUBRUTAS */}
          <Outlet />

          {window.location.pathname === '/admin' && (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-2">Bienvenido al Panel de Administración</h2>
              <p className="text-gray-400">Selecciona una opción del menú</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
