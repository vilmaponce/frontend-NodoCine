// src/components/ui/Footer.jsx
import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function Footer() {
  const { darkMode } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${darkMode ? 'bg-gray-900' : 'bg-black'} text-gray-400 py-10 px-4`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          {/* LOGO Y NOMBRE */}
          <div className="flex items-center space-x-3">
            <img
              src={`${import.meta.env.VITE_API_URL}/images/nodoflix.png`}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/nodoflix.png';
              }}
              alt="Logo Nodo Flix"
              className="h-10 w-auto object-contain"
            />
            <div>
              <Link to="/" className="text-red-600 font-bold text-2xl">NodoCine</Link>
              <p className="text-sm text-gray-400 mt-1">Tu plataforma de streaming favorita</p>
            </div>
          </div>

          {/* SECCIONES DE ENLACES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h3 className="text-white font-semibold mb-3">Enlaces</h3>
              <ul className="space-y-2">
                <li><Link to="/movies" className="hover:text-white transition">Catálogo</Link></li>
                <li><Link to="/login" className="hover:text-white transition">Iniciar Sesión</Link></li>
                <li><Link to="/register" className="hover:text-white transition">Registrarse</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Géneros</h3>
              <ul className="space-y-2">
                <li><Link to="/movies?genre=action" className="hover:text-white transition">Acción</Link></li>
                <li><Link to="/movies?genre=comedy" className="hover:text-white transition">Comedia</Link></li>
                <li><Link to="/movies?genre=animation" className="hover:text-white transition">Animación</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Contacto</h3>
              <ul className="space-y-2">
                <li><span className="text-gray-500">Email:</span> info@nodoflix.com</li>
                <li><span className="text-gray-500">Soporte:</span> soporte@nodoflix.com</li>
              </ul>
            </div>
          </div>
        </div>

        {/* PIE DE PÁGINA */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm mb-4">
            © {currentYear} NodoCine - Vilma Ponce 
          </p>
          <div className="flex justify-center space-x-6 text-sm">
            <Link to="/terms" className="hover:text-white transition">Términos</Link>
            <Link to="/privacy" className="hover:text-white transition">Privacidad</Link>
            <Link to="/faq" className="hover:text-white transition">Preguntas Frecuentes</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
