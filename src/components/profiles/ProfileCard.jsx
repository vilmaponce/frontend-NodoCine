import React, { useState, useEffect } from 'react';

const ProfileCard = ({ profile, onSelect }) => {
  // Imagen de respaldo codificada directamente como base64
  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgY2xhc3M9ImZlYXRoZXIgZmVhdGhlci11c2VyIj48cGF0aCBkPSJNMjAgMjF2LTJhNCA0IDAgMCAwLTQtNEg4YTQgNCAwIDAgMC00IDR2MiI+PC9wYXRoPjxjaXJjbGUgY3g9IjEyIiBjeT0iNyIgcj0iNCI+PC9jaXJjbGU+PC9zdmc+";
  
  // Estado para la URL de la imagen
  const [imageSource, setImageSource] = useState(fallbackImage);
  // Para evitar bucles, usamos un estado para rastrear si ya fallamos
  const [hasErrored, setHasErrored] = useState(false);
  
  // Actualizar la fuente de la imagen cuando cambie el perfil
  useEffect(() => {
    if (profile?.imageUrl && !hasErrored) {
      try {
        // Intentar parsear como URL absoluta
        new URL(profile.imageUrl);
        // Si no lanza excepción, es una URL válida
        setImageSource(profile.imageUrl);
      } catch {
        // No es una URL absoluta, tratar como ruta relativa
        // Verificar si ya incluye http://localhost:3001
        if (!profile.imageUrl.includes('http://localhost:3001')) {
          const baseUrl = import.meta.env.VITE_API_URL?.split('/api')[0] || 'http://localhost:3001';
          setImageSource(`${baseUrl}${profile.imageUrl.startsWith('/') ? profile.imageUrl : '/' + profile.imageUrl}`);
        } else {
          setImageSource(profile.imageUrl);
        }
      }
    } else if (!hasErrored) {
      // Si no hay URL o ya hubo error, usar fallback
      setImageSource(fallbackImage);
    }
  }, [profile, hasErrored]);
  
  // Manejar errores de carga de imagen
  const handleImageError = () => {
    // Solo cambiar si no hemos manejado un error antes
    if (!hasErrored) {
      setHasErrored(true);
      setImageSource(fallbackImage);
    }
  };
  
  return (
    <div 
      className="group flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-105"
      onClick={() => onSelect(profile)}
    >
      <div className="relative w-32 h-32 rounded-lg overflow-hidden border-4 border-transparent group-hover:border-red-600 mb-4 transition-all duration-300 bg-gray-700">
        <img
          src={imageSource}
          alt={profile?.name || 'Perfil'}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
        {profile?.isChild && (
          <span className="absolute bottom-2 right-2 bg-blue-500 text-xs font-bold px-2 py-1 rounded-full">
            Kids
          </span>
        )}
      </div>
      <span className="text-xl text-gray-300 group-hover:text-white transition-colors duration-200">
        {profile?.name || 'Perfil'}
      </span>
    </div>
  );
};

export default ProfileCard;