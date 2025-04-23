import { Link } from 'react-router-dom';


export default function Header({ showAuthButtons = false }) {
  return (
    <header className="bg-black py-4 px-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Logo - Ruta desde public */}
          <Link to="/" className="flex items-center">
            <img
              src="http://localhost:3001/images/nodoflix.png"
              alt="Logo"
              className="w-20 h-auto" // Ajusta el tamaño del logo aquí
            />
          </Link>
        </div>
        {showAuthButtons && (
          <div className="flex space-x-4">
            <Link
              to="/login"
              className="text-white hover:text-red-500 transition"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/register"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}