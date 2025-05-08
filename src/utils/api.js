// frontend/src/utils/api.js
import axios from 'axios';

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
});
// interceptor para agregar el token automáticamente en cada petición

// Interceptor de solicitud para añadir el token
api.interceptors.request.use(
  config => {
    console.log('Enviando solicitud a URL completa:', config.baseURL + config.url);
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Enviando solicitud con token:', token.substring(0, 15) + '...');
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn('No hay token disponible para la solicitud:', config.url);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor de respuesta para manejar errores
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.log('Error de respuesta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      });
      
      // Solo para depuración - NO redirigir automáticamente
      if (error.response.status === 401) {
        console.warn('Error de autenticación, token posiblemente inválido');
      }
    }
    return Promise.reject(error);
  }
);


export default api;