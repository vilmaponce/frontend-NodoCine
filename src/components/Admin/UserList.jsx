// src/components/admin/UserList.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UserList = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Datos de usuario "hard-coded" para una demostración
  const mockUsers = [
    {
      _id: '6819dcd830ea098625b14d84',
      email: 'admin@admin.com',
      isAdmin: true,
      createdAt: new Date()
    },
    {
      _id: '6806195e7eaf378b252a3f00',
      email: 'familia@ejemplo.com',
      isAdmin: false,
      createdAt: new Date()
    }
  ];

  const handleCreateFamilyAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Aquí conectaríamos con el backend cuando esté listo
      // const response = await axios.post('/api/users/create-family', { email, password });
      
      // Por ahora simulamos el éxito
      setTimeout(() => {
        toast.success('Cuenta familiar creada con éxito');
        setLoading(false);
        setEmail('');
        setPassword('');
      }, 1000);
    } catch (error) {
      toast.error('Error al crear la cuenta familiar');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-white mb-6">Administrar Usuarios</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Fecha de registro
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {mockUsers.map((user) => (
              <tr key={user._id} className="hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {user.isAdmin ? 'Administrador' : 'Usuario'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-6 p-4 bg-gray-800 rounded-lg">
        <h2 className="text-xl font-bold text-white mb-4">Crear cuenta familiar</h2>
        <p className="text-gray-300 mb-4">
          Puedes crear una cuenta familiar para acceder a todos los perfiles con una sola contraseña.
        </p>

        <form onSubmit={handleCreateFamilyAccount}>
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">Email</label>
            <input 
              type="email"
              id="email"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="password">Contraseña</label>
            <input 
              type="password"
              id="password"
              className="w-full bg-gray-700 text-white px-4 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-800"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear cuenta familiar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserList;