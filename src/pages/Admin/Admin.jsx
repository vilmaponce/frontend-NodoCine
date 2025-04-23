import { useContext } from 'react';
import { useAuth } from '../../context/AuthContext'; // Asegúrate de que la ruta sea correcta
import MovieForm from '../../components/admin/MovieForm';
import MovieList from '../../components/admin/MovieList';

export default function AdminPage() {
  // Usa el hook useAuth en lugar de useContext directamente
  const { user } = useAuth();

  // Verifica si el usuario es admin
  if (user?.role !== 'admin') {
    return (
      <div className="bg-gray-800 text-white min-h-screen p-4">
        <h1 className="text-2xl text-red-500">Acceso no autorizado</h1>
        <p>No tienes permisos para acceder a esta página</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 text-white min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <section className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Agregar Película</h2>
          <MovieForm />
        </section>
        
        <section className="bg-gray-700 p-4 rounded-lg">
          <h2 className="text-xl mb-4">Lista de Películas</h2>
          <MovieList />
        </section>
      </div>
    </div>
  );
}