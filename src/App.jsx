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
import ProfileForm from './components/profiles/ProfileForm';
import Unauthorized from './pages/Unauthorized';
import ProfileSelect from './pages/Profiles/ProfileSelect';
import ProfileCreate from './pages/Profiles/ProfileCreate';
import ManageProfiles from './pages/Profiles/ManageProfiles';
import MovieCatalog from './components/movies/MovieCatalog';
import Watchlist from './components/user/Watchlist';
import MovieFormSimple from './components/MovieFormSimple'; // Para agregar y editar películas

// Páginas de administración
import AdminDashboard from './components/Admin/AdminDashboard';// Usar solo este
import UserList from './components/Admin/UserList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ProfileProvider>

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
                  <Route path="/edit-profile/:id" element={<ProfileForm />} />
                  <Route path="/manage-profiles" element={<ManageProfiles />} />
                  <Route path="/movies" element={<MovieCatalog />} />
                  <Route path="/movies/:id" element={<MovieDetail />} />
                  <Route path="/watchlist" element={<Watchlist />} />
                </Route>

                {/* Rutas solo para administradores */}
                <Route element={<AdminRoute />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/movies" element={<MovieList />} />
                  <Route path="/admin/users" element={<UserList />} />
                  <Route path="/admin/profiles" element={< UserList/>} />
                  <Route path="/admin/movies/add" element={<MovieFormSimple />} />
                  <Route path="/admin/movies/edit/:id" element={<MovieFormSimple />} />
                </Route>
              </Routes>
            </main>
          </div>
        </ProfileProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;