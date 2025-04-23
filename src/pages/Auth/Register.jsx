// src/pages/Auth/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // Importación CORRECTA

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useAuth(); // Uso correcto del hook
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password); // Usa la función register del contexto
      navigate('/profiles'); // Redirige a perfiles o a la ruta que prefieras
    } catch (err) {
      setError('Error al registrar el usuario');
      console.error('Register error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-white">Registrarse</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition"
          >
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

