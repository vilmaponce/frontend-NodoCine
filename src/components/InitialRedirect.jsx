import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useProfile } from '../context/ProfileContext';

export default function InitialRedirect() {
  const { user } = useAuth();
  const { currentProfile } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Admin puede acceder a ambas vistas
    if (user.role === 'admin') {
      // Verificar si viene de intentar acceder a ruta de usuario
      const fromUserRoute = window.location.search.includes('from=user');
      if (fromUserRoute) {
        navigate('/home');
      } else {
        navigate('/admin');
      }
    } else {
      // Usuario normal
      if (currentProfile) {
        navigate('/home');
      } else {
        navigate('/select-profile');
      }
    }
  }, [user, currentProfile, navigate]);

  return <div className="flex items-center justify-center min-h-screen">Cargando...</div>;
}