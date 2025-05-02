// src/pages/Errors/Unauthorized.jsx
import { useNavigate } from 'react-router-dom';

export default function Unauthorized() {
  const navigate = useNavigate();
  
  return (
    <div className="bg-gray-800 text-white min-h-screen flex items-center justify-center">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-3xl font-bold text-red-500 mb-4">403 - Acceso No Autorizado</h1>
        <p className="mb-6">No tienes permisos para acceder a esta página.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}