import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../context/ProfileContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Profile() {
  const { user, isAdmin } = useAuth();
  const { currentProfile } = useProfile();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3001/api/users/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        toast.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, navigate]);

  if (loading) {
    return <div className="text-white text-center p-8">Cargando perfil...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-white mb-6">Perfil de Usuario</h1>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Información general */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-4">Información General</h2>
            <div className="space-y-3 text-gray-300">
              <p><span className="font-semibold">Email:</span> {userData?.email}</p>
              <p><span className="font-semibold">Rol:</span> {isAdmin ? 'Administrador' : 'Usuario'}</p>
              <p><span className="font-semibold">Cuenta creada:</span> {new Date(userData?.createdAt).toLocaleDateString()}</p>
            </div>

            {/* Botones de acción */}
            <div className="mt-6 flex flex-wrap gap-3">
              <button 
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={() => navigate('/edit-password')}
              >
                Cambiar Contraseña
              </button>
              
              {isAdmin && (
                <button 
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                  onClick={() => navigate('/admin')}
                >
                  Panel de Administración
                </button>
              )}
            </div>
          </div>

          {/* Perfiles */}
          <div className="flex-1 mt-6 md:mt-0">
            <h2 className="text-2xl font-bold text-white mb-4">Mis Perfiles</h2>
            {userData?.profiles && userData.profiles.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {userData.profiles.map(profile => (
                  <div key={profile._id} className="bg-gray-700 p-4 rounded-lg">
                    <img 
                      src={profile.imageUrl.includes('http') 
                        ? profile.imageUrl 
                        : `http://localhost:3001${profile.imageUrl}`} 
                      alt={profile.name}
                      className="w-16 h-16 rounded-full object-cover mx-auto mb-2"
                    />
                    <p className="text-white text-center font-semibold">{profile.name}</p>
                    <p className="text-gray-400 text-center text-sm">
                      {profile.isChild ? 'Perfil Infantil' : 'Perfil Estándar'}
                    </p>
                    <button
                      className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-sm"
                      onClick={() => navigate(`/edit-profile/${profile._id}`)}
                    >
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No has creado ningún perfil todavía.</p>
            )}
            <button
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              onClick={() => navigate('/create-profile')}
            >
              Crear Nuevo Perfil
            </button>
          </div>
        </div>
      </div>

      {/* Sección específica para administradores */}
      {isAdmin && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">Opciones de Administrador</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded flex flex-col items-center"
              onClick={() => navigate('/admin/movies/add')}
            >
              <span className="text-lg font-semibold">Agregar Película</span>
              <span className="text-sm">Añadir nuevas películas al catálogo</span>
            </button>
            
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded flex flex-col items-center"
              onClick={() => navigate('/admin')}
            >
              <span className="text-lg font-semibold">Administrar Películas</span>
              <span className="text-sm">Ver, editar y eliminar películas</span>
            </button>
            
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded flex flex-col items-center"
              onClick={() => navigate('/admin/users')}
            >
              <span className="text-lg font-semibold">Administrar Usuarios</span>
              <span className="text-sm">Ver y gestionar usuarios del sistema</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}