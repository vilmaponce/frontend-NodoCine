// components/Layouts/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { toast } from 'react-toastify';
import { useTheme } from '../../context/ThemeContext';


export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout, makeAdmin } = useAuth();
  const { currentProfile, setCurrentProfile, updateCurrentProfile } = useProfile();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { darkMode, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const switchToUserView = async () => {
    try {
      // Verifica que la función exista
      if (!updateCurrentProfile) {
        throw new Error('Función updateCurrentProfile no disponible');
      }

      const userData = localStorage.getItem('user');
      if (!userData) throw new Error('No hay usuario logueado');

      const user = JSON.parse(userData);
      if (!user?.id) throw new Error('Usuario no válido');

      // Actualiza el perfil
      await updateCurrentProfile({
        id: user.id,
        name: user.name || 'Usuario Normal',
        isChild: false
      });

      // Redirige y muestra feedback
      navigate('/');
      toast.success('Cambiado a modo usuario normal');

    } catch (error) {
      console.error('Error al cambiar a modo usuario:', error);
      toast.error(error.message);

      if (error.message.includes('No hay usuario')) {
        navigate('/login');
      }
    }
  };

  const isAdminPage = location.pathname.startsWith('/admin');


  return (
    <nav className={`${isAdminPage ? 'bg-gray-900' : 'bg-black'} py-4 shadow-md`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <Link to={isAdmin ? '/admin' : '/'} className="text-red-600 font-bold text-2xl">
            NodoCine
          </Link>
        </div>

        {/* Navegación central */}
        {isAuthenticated && (
          <div className="flex items-center space-x-6">
            {isAdmin && isAdminPage ? (
              // Enlaces para administradores en páginas de admin
              <>
                <Link to="/admin" className="text-gray-300 hover:text-white">
                  Dashboard
                </Link>
                <Link to="/admin/movies/add" className="text-gray-300 hover:text-white">
                  Agregar Película
                </Link>
              </>
            ) : isAdmin ? (
              // Enlaces para administradores en páginas normales
              <>
                <Link to="/home" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
                <Link to="/admin" className="text-gray-300 hover:text-white font-medium">
                  Panel Admin
                </Link>
              </>
            ) : (
              // Enlaces para usuarios comunes
              <>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
                  aria-label="Cambiar tema"
                >
                  {darkMode ? '☀️' : '🌙'}
                </button>
                <Link to="/home" className="text-gray-300 hover:text-white">
                  Inicio
                </Link>
                <Link to="/movies" className="text-gray-300 hover:text-white">
                  Películas
                </Link>
                {user?.email === 'admin@admin.com' && !isAdmin && (

                  <button
                    onClick={() => {
                      if (user && user.email) {
                        makeAdmin(user.email)
                          .then(() => {
                            alert('¡Ahora eres administrador!');
                            window.location.reload(); // Recargar para actualizar permisos
                          })
                          .catch(err => {
                            alert('Error: ' + err.message);
                          });
                      } else {
                        alert('Debes iniciar sesión primero');
                      }
                    }}
                    className="..."
                  >
                    Activar modo administrador
                  </button>

                )}
              </>
            )}
          </div>
        )}

        {/* Opciones de usuario */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="text-gray-300 hover:text-white flex items-center"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {isAdmin && (
                  <span className="bg-red-600 text-white px-2 py-1 rounded text-xs mr-2">
                    ADMIN
                  </span>
                )}
                <span className="max-w-[150px] truncate">
                  {isAdmin ? user?.email : (currentProfile?.name || user?.email)}
                </span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 ml-1 transform transition-transform ${menuOpen ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {menuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  {isAdmin && isAdminPage ? (
                    // Opciones para admin en página de admin
                    <button
                      onClick={() => {
                        switchToUserView();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                    >
                      Modo Usuario
                    </button>
                  ) : isAdmin ? (
                    // Opciones para admin en página normal
                    <Link
                      to="/admin"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      Panel Admin
                    </Link>
                  ) : (
                    // Opciones para usuario común
                    <Link
                      to="/select-profile"
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      onClick={() => setMenuOpen(false)}
                    >
                      Cambiar Perfil
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Enlaces para visitantes
            <div className="flex space-x-4">
              <Link to="/login" className="text-gray-300 hover:text-white">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}