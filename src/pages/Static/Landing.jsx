import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';  // Ruta relativa correcta desde pages/Static
import Footer from '../../components/ui/Footer';


export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header showLogin={true} />
      
      <div className="relative h-screen">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10 flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Disfruta de nuestro catálogo</h1>
            <p className="text-xl mb-8">Películas para toda la familia</p>
            <Link 
              to="/login" 
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-lg font-semibold inline-block"
            >
              Comenzar
            </Link>
          </div>
        </div>
        <img 
          src="/images/landing-bg.jpg" 
          alt="Background" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <Footer />
    </div>
  );
}