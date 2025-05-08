// // src/services/authService.js
// // Este archivo proporciona una capa adicional para manejar peticiones de autenticación
// import api from '../utils/api';

// const authService = {
//   /**
//    * Inicia sesión de usuario
//    * @param {Object} credentials - Correo y contraseña
//    * @returns {Promise} - Datos del usuario y token
//    */
//   login: async (credentials) => {
//     try {
//       console.log('🔑 Iniciando sesión...', credentials.email);
//       const response = await api.post('/auth/login', credentials);
      
//       // Guardar token
//       localStorage.setItem('token', response.data.token);
      
//       // Procesar y normalizar los datos del usuario
//       const userData = {
//         id: response.data.user.id || response.data.user._id,
//         email: response.data.user.email,
//         username: response.data.user.username || response.data.user.email,
//         // Normalizar isAdmin (podría venir como role o como isAdmin)
//         isAdmin: response.data.user.isAdmin || response.data.user.role === 'admin'
//       };
      
//       console.log('✅ Sesión iniciada:', userData);
//       return { user: userData, token: response.data.token };
//     } catch (error) {
//       console.error('❌ Error de autenticación:', error);
      
//       // Mejorar mensajes de error
//       let errorMessage = 'Error al iniciar sesión';
      
//       if (error.response) {
//         // El servidor respondió con un código de error
//         if (error.response.status === 400) {
//           errorMessage = 'Credenciales inválidas';
//         } else if (error.response.status === 401) {
//           errorMessage = 'No autorizado. Verifique sus credenciales';
//         } else if (error.response.status === 500) {
//           errorMessage = 'Error en el servidor. Intente más tarde';
//         }
        
//         // Usar mensaje personalizado si existe
//         if (error.response.data && error.response.data.message) {
//           errorMessage = error.response.data.message;
//         }
//       } else if (error.request) {
//         // La petición fue hecha pero no se recibió respuesta
//         errorMessage = 'No se pudo conectar con el servidor';
//       }
      
//       throw new Error(errorMessage);
//     }
//   },
  
//   /**
//    * Registra un nuevo usuario
//    * @param {string} email - Correo electrónico
//    * @param {string} password - Contraseña
//    * @returns {Promise} - Datos del registro
//    */
//   register: async (email, password) => {
//     try {
//       console.log('📝 Registrando usuario...', email);
//       const response = await api.post('/auth/register', { email, password });
      
//       // Si el endpoint devuelve un token, guardarlo
//       if (response.data.token) {
//         localStorage.setItem('token', response.data.token);
//       }
      
//       console.log('✅ Registro exitoso');
//       return response.data;
//     } catch (error) {
//       console.error('❌ Error de registro:', error);
      
//       let errorMessage = 'Error al registrar usuario';
      
//       if (error.response) {
//         if (error.response.status === 400) {
//           errorMessage = 'Datos inválidos o usuario ya existe';
//         }
        
//         if (error.response.data && error.response.data.message) {
//           errorMessage = error.response.data.message;
//         }
//       } else if (error.request) {
//         errorMessage = 'No se pudo conectar con el servidor';
//       }
      
//       throw new Error(errorMessage);
//     }
//   },
  
//   /**
//    * Verifica si el token actual es válido
//    * @returns {Promise} - Datos del usuario si el token es válido
//    */
//   verifyToken: async () => {
//     try {
//       console.log('🔍 Verificando token...');
//       const response = await api.get('/auth/verify');
      
//       // Normalizar datos del usuario
//       const userData = {
//         id: response.data.user.id || response.data.user._id,
//         email: response.data.user.email,
//         // Normalizar isAdmin
//         isAdmin: response.data.user.isAdmin || response.data.user.role === 'admin'
//       };
      
//       console.log('✅ Token válido:', userData);
//       return userData;
//     } catch (error) {
//       console.error('❌ Token inválido o expirado:', error);
//       // Limpiar token
//       localStorage.removeItem('token');
//       throw new Error('Sesión expirada o inválida');
//     }
//   },
  
//   /**
//    * Cierra la sesión del usuario
//    */
//   logout: () => {
//     console.log('👋 Cerrando sesión...');
//     localStorage.removeItem('token');
//     localStorage.removeItem('currentProfileId');
//   },
  
//   /**
//    * Obtiene el token actual
//    * @returns {string|null} - Token JWT o null
//    */
//   getToken: () => {
//     return localStorage.getItem('token');
//   }
// };

// export default authService;