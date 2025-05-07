export const normalizeImageUrl = (url) => {
  // URL base para imágenes
  const imagesBaseUrl = import.meta.env.VITE_IMAGES_URL || 'http://localhost:3001/images/profiles';
  
  if (!url) return `${imagesBaseUrl}/default-profile.png`;
  if (url.startsWith('http')) return url;
  
  // Normalizar la ruta
  let normalizedPath = url;
  
  // Si es una ruta relativa sin /
  if (!normalizedPath.startsWith('/')) {
    return `${imagesBaseUrl}/${normalizedPath}`;
  }
  
  // Si ya tiene la estructura completa con /images/profiles
  if (normalizedPath.includes('/images/profiles')) {
    return `${import.meta.env.VITE_API_URL.split('/api')[0]}${normalizedPath}`;
  }
  
  return `${imagesBaseUrl}${normalizedPath}`;
};