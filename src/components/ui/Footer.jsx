export default function Footer() {
  return (
    <footer className="bg-black py-6 px-4 border-t border-gray-800">
      <div className="container mx-auto text-center text-gray-400">
        <p>© 2023 NodoFlix - Todos los derechos reservados</p>
        <div className="flex justify-center space-x-6 mt-4">
          <a href="#" className="hover:text-white transition">Términos</a>
          <a href="#" className="hover:text-white transition">Privacidad</a>
          <a href="#" className="hover:text-white transition">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
