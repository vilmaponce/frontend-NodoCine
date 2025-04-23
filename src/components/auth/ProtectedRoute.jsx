// src/components/auth/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';

const ProtectedRoute = ({ children, roles }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { currentProfile, isLoading: isProfileLoading } = useProfile();

  // Si hay carga en el contexto de autenticación o perfil, mostrar el spinner
  if (isAuthLoading || isProfileLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-white">
        <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-red-500 rounded-full mb-4" />
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no hay usuario, redirigir a login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si se especificaron roles y el usuario no tiene uno permitido
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, renderizar children
  return children;
};

export default ProtectedRoute;
