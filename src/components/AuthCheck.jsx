// // import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// // Añadir este log al principio del archivo
// console.log('🔍 AuthCheck.js está siendo importado');

// export default function AuthCheck() {
//   // Añadir este log dentro de la función del componente
//   console.log('🔍 Componente AuthCheck está siendo renderizado');
  
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     // El resto del código queda igual
//     const token = localStorage.getItem('token');
    
//     if (!token) {
//       navigate('/login');
//     } else {
//       if (user?.role === 'admin') {
//         navigate('/admin');
//       } else {
//         navigate('/profiles');
//       }
//     }
//   }, [user, navigate]);

//   return null; // No renderiza nada, solo maneja la navegación
// }