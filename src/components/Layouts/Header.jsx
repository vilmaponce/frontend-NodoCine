// // frontend/src/components/layout/Header.jsx
// import { useContext } from 'react';
// import { Link } from 'react-router-dom';
// import { AuthContext } from '../../context/AuthContext';

// const Header = () => {
//   const { isAuthenticated, isAdmin, user, logout } = useContext(AuthContext);
  
//   return (
//     <header className="bg-black py-4 shadow-md">
//       <div className="container mx-auto px-4 flex justify-between items-center">
//         {/* Logo */}
//         <div className="logo">
//           <Link to="/" className="text-red-600 font-bold text-2xl">NodoCine</Link>
//         </div>
        
//         <nav className="flex items-center space-x-6">
//           <Link to="/movies" className="text-gray-300 hover:text-white">
//             Películas
//           </Link>
          
//           {isAuthenticated ? (
//             // Usuario autenticado
//             <div className="flex items-center space-x-4">
//               <Link to="/profile" className="text-gray-300 hover:text-white">
//                 Mi Perfil
//               </Link>
              
//               {isAdmin && (
//                 // Opción de administrador más visible
//                 <Link 
//                   to="/admin" 
//                   className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
//                 >
//                   Panel Admin
//                 </Link>
//               )}
              
//               <button 
//                 onClick={logout} 
//                 className="text-gray-300 hover:text-white"
//               >
//                 Cerrar Sesión
//               </button>
//             </div>
//           ) : (
//             // Usuario no autenticado
//             <div className="flex items-center space-x-4">
//               <Link to="/login" className="text-gray-300 hover:text-white">
//                 Iniciar Sesión
//               </Link>
//               <Link 
//                 to="/register" 
//                 className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition"
//               >
//                 Registrarse
//               </Link>
//             </div>
//           )}
//         </nav>
//       </div>
//     </header>
//   );
// };

// export default Header;