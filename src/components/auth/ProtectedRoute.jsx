import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function ProtectedRoute({ children, requireProfile, roles }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (requireProfile && !user.profile) {
      navigate('/select-profile');
    } else if (roles && !roles.includes(user.role)) {
      navigate('/home');
    }
  }, [user, requireProfile, roles, navigate]);

  if (
    !user ||
    (requireProfile && !user.profile) ||
    (roles && !roles.includes(user.role))
  ) {
    return null; // Evita renderizar los children mientras redirige
  }

  return children;
}

export default ProtectedRoute;
