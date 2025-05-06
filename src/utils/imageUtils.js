// src/utils/imageUtils.js

/**
 * Obtiene la URL completa para una imagen
 * @param {string} relativePath - Ruta relativa de la imagen
 * @param {string} type - Tipo de imagen (profiles, movies)
 * @returns {string} URL completa de la imagen
 */
export const getImageUrl = (relativePath, type = 'profiles') => {
  // URL base del backend
  const backendUrl = 'http://localhost:3001';
  
  // Si la ruta es vacía o undefined, devolver imagen por defecto
  if (!relativePath) {
    return `${backendUrl}/images/${type}/default-${type === 'profiles' ? 'profile' : 'movie'}.png`;
  }
  
  // Si ya es una URL completa, devolverla tal cual
  if (relativePath.startsWith('http')) {
    return relativePath;
  }
  
  // Normalizar la ruta
  let normalizedPath = relativePath;
  
  // Asegurarse de que comienza con /
  if (!normalizedPath.startsWith('/')) {
    normalizedPath = `/${normalizedPath}`;
  }
  
  // Asegurarse de que incluye /images/ en la ruta
  if (!normalizedPath.includes('/images/')) {
    normalizedPath = `/images/${type}${normalizedPath}`;
  }
  
  // Devolver URL completa
  return `${backendUrl}${normalizedPath}`;
};

/**
 * Obtiene la URL para una imagen de perfil
 */
export const getProfileImageUrl = (relativePath) => {
  return getImageUrl(relativePath, 'profiles');
};

/**
 * Obtiene la URL para una imagen de película
 */
export const getMovieImageUrl = (relativePath) => {
  return getImageUrl(relativePath, 'movies');
};