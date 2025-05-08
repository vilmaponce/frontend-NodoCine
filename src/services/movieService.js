// // src/services/movieService.js
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// // Obtener todas las películas, opcionalmente filtradas por perfil infantil
// export const getMovies = async (isChild = false, token = '') => {
//   try {
//     const response = await axios.get(`${API_URL}/api/movies`, {
//       params: { isChild },
//       headers: token ? { Authorization: `Bearer ${token}` } : {}
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching movies:', error);
//     throw error;
//   }
// };

// // Obtener detalles de una sola película por ID
// export const getMovieDetails = async (id) => {
//   try {
//     const response = await axios.get(`${API_URL}/api/movies/${id}`);
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching movie details:', error);
//     throw error;
//   }
// };

// // Crear una nueva película (uso del admin)
// export const createMovie = async (movieData) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.post(`${API_URL}/api/movies`, movieData, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error creating movie:', error);
//     throw error;
//   }
// };

// // Editar una película existente (uso del admin)
// export const updateMovie = async (id, movieData) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.put(`${API_URL}/api/movies/${id}`, movieData, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error updating movie:', error);
//     throw error;
//   }
// };

// // Eliminar una película (uso del admin)
// export const deleteMovie = async (id) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await axios.delete(`${API_URL}/api/movies/${id}`, {
//       headers: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error deleting movie:', error);
//     throw error;
//   }
// };
