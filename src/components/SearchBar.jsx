// // import React, { useState } from 'react'; // Corregir importación
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'; // Asegúrate de que tienes esta librería

// // Añadir este log al principio del archivo
// console.log('🔍 SearchBar.jsx está siendo importado');

// export default function SearchBar() {
//   // Añadir este log dentro de la función del componente
//   console.log('🔍 Componente SearchBar está siendo renderizado');
  
//   const [query, setQuery] = useState('');

//   return (
//     <div className="relative max-w-md mx-auto mb-8">
//       <input
//         type="text"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//         placeholder="Buscar películas..."
//         className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg pl-10 focus:ring-2 focus:ring-red-500"
//       />
//       <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" />
//     </div>
//   );
// }