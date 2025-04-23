import { useState, useEffect } from 'react';

export default function CardMovie({ movie }) {
  return (
    <div className="group relative aspect-[2/3] rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
      <img
        src={`http://localhost:3001${movie.imageUrl}`}
        alt={movie.title}
        className="w-full h-full object-cover group-hover:opacity-80 transition-opacity"
        onError={(e) => e.target.src = '/default-movie.jpg'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
        <h3 className="text-white font-bold text-lg truncate">{movie.title}</h3>
        <p className="text-gray-300 text-sm">{movie.genre}</p>
        <div className="flex mt-2 space-x-2">
          <button className="bg-white text-black px-3 py-1 rounded-full text-xs font-semibold hover:bg-gray-200 transition">
            Ver
          </button>
          <button className="bg-gray-600/70 text-white px-3 py-1 rounded-full text-xs hover:bg-gray-500 transition">
            + Lista
          </button>
        </div>
      </div>
    </div>
  );
}