// En App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Importar componentes
import Navbar from './components/Layouts/Navbar'; // Solo usar este Navbar
import Home from './pages/Browse/Home';

// Páginas de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Páginas de contenido
import MovieList from './components/movies/movieList';
import MovieDetail from './components/movies/MovieDetail';
import Profile from './components/user/Profile';
import Unauthorized from './pages/Unauthorized';
import ProfileSelect from './pages/Profiles/ProfileSelect';
import ProfileCreate from './pages/Profiles/ProfileCreate';
import MovieManager from './pages/Admin/MovieManager';// Usar solo este

// Páginas de administración
import AdminDashboard from './components/Admin/AdminDashboard';// Usar solo este
import MovieFormSimple from './components/MovieFormSimple';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <Router>
          <div className="min-h-screen bg-gray-800">
            <Navbar /> {/* Solo este Navbar para toda la aplicación */}
            <main className="container mx-auto py-4">
              <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                
                {/* Rutas para usuarios autenticados */}
                <Route element={<PrivateRoute />}>
                  <Route path="/" element={<ProfileSelect />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/select-profile" element={<ProfileSelect />} />
                  <Route path="/create-profile" element={<ProfileCreate />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/movies" element={<MovieList />} />
                  <Route path="/movies/:id" element={<MovieDetail />} />
                  <Route path="/favorites" element={<Profile />} />
                </Route>
                
                {/* Rutas solo para administradores */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/movies/add" element={<MovieManager />} />
                  <Route path="/admin/movies/edit/:id" element={<MovieManager />} />
                </Route>
              </Routes>
            </main>
          </div>
        </Router>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;