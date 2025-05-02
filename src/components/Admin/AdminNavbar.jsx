import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

export default function AdminNavbar() {
  const { logout, user } = useAuth();
  const { setCurrentProfile } = useProfile();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const switchToUserView = async () => {
    try {
      // 1. Limpiar el perfil actual
      await setCurrentProfile(null);
      localStorage.removeItem('currentProfile');
      
      // 2. Forzar recarga de la página para limpiar el estado
      window.location.href = '/select-profile';
    } catch (error) {
      console.error('Error switching to user view:', error);
      toast.error('Error al cambiar a modo usuario');
    }
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-4 mb-4 md:mb-0">
          <NavLink 
            to="/admin/movies" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Películas
          </NavLink>
          <NavLink 
            to="/admin/profiles" 
            className={({ isActive }) => 
              `px-3 py-2 rounded-md text-sm font-medium ${
                isActive ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            Perfiles
          </NavLink>
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-300 hidden md:block">
            Admin: {user?.email}
          </span>
          <button
            onClick={switchToUserView}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Modo Usuario
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
}