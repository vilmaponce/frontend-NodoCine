import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCheck() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
    } else {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/profiles');
      }
    }
  }, [user, navigate]);

  return null; // No renderiza nada, solo maneja la navegación
}