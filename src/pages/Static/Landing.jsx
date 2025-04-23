// pages/Static/Landing.jsx
export default function Landing() {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header showLogin={true} />
        
        <div className="relative h-screen">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10">
            <div className="container mx-auto px-4 h-full flex flex-col justify-center">
              <h1 className="text-5xl font-bold mb-4">Películas y series ilimitadas</h1>
              <p className="text-xl mb-8">Disfruta donde quieras. Cancela cuando quieras.</p>
              <Link to="/login" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-md text-lg font-semibold w-fit">
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