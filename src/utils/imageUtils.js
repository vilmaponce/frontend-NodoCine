export const normalizeImageUrl = (url) => {
  if (!url) return 'http://localhost:3001/images/profiles/default-profile.png';
  
  // Si ya es una URL completa
  if (url.startsWith('http')) return url;
  
  // Si es una ruta local
  if (url.startsWith('/images/profiles/')) {
    return `http://localhost:3001${url}`;
  }
  
  // Si es una ruta de perfil sin el prefijo completo
  if (url.startsWith('/profiles/')) {
    return `http://localhost:3001/images${url}`;
  }
  
  // Para cualquier otro caso
  return `http://localhost:3001/images/profiles/${url}`;
};