// import axios from 'axios';
// import Profile from '../../../backend/models/Profile.mjs';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// // Obtener todos los perfiles
// export const getProfiles = async () => {
//   try {
//     const response = await axios.get(`${API_URL}/profiles/all`, {
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem('token')}` // Asegúrate de que el token está guardado correctamente
//       }
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching profiles:', error);
//     throw error;
//   }
// };


// // Obtener perfil por ID de usuario
// export const getProfileByUserId = async (req, res) => {
//   const { userId } = req.params;  // Obtén el userId desde la URL

//   try {
//     const profile = await Profile.findOne({ userId });  // Suponiendo que tienes un campo userId en el modelo

//     if (!profile) {
//       return res.status(404).json({ error: 'Perfil no encontrado' });
//     }

//     res.json(profile);
//   } catch (error) {
//     console.error('Error al obtener el perfil:', error);
//     res.status(500).json({ error: 'Error al obtener el perfil' });
//   }
// };