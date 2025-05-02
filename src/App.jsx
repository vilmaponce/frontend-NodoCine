import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import Landing from './pages/Static/Landing';
import Home from './pages/Browse/Home';
import MovieDetail from './pages/Browse/MovieDetail';
import Login from './pages/Auth/Login';
import ProfileSelect from './pages/Profiles/ProfileSelect';
import AdminLayout from './pages/Admin/AdminLayout';
import MovieManager from './pages/Admin/MovieManager';
import ProfileManager from './pages/Admin/ProfileManager';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProtectedRoute from './components/auth/ProtectedRoute';
import InitialRedirect from './components/InitialRedirect';
import CreateProfile from './components/profiles/CreateProfile';


function App() {
  return (
    <Router>
      <AuthProvider>
        <ProfileProvider>
          <ToastContainer />
          <Routes>
            {/* Ruta raíz - Landing page pública */}
            <Route path="/" element={<Landing />} />

            {/* Ruta de redirección después de login */}
            <Route path="/redirect" element={<InitialRedirect />} />

            {/* Rutas públicas */}
            <Route path="/login" element={<Login />} />

            {/* Rutas de usuario común */}
            <Route path="/select-profile" element={
              <ProtectedRoute>
                <ProfileSelect />
              </ProtectedRoute>
            } />
            <Route
              path="/create-profile"
              element={
                <ProtectedRoute>
                  <CreateProfile />
                </ProtectedRoute>
              }
            />

            <Route path="/home" element={
              <ProtectedRoute requireProfile>
                <Home />
              </ProtectedRoute>
            } />

            <Route path="/movie/:id" element={
              <ProtectedRoute requireProfile>
                <MovieDetail />
              </ProtectedRoute>
            } />

            {/* Rutas de administración */}
            <Route path="/admin" element={
              <ProtectedRoute roles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Navigate to="movies" replace />} />
              <Route path="movies" element={<MovieManager />} />
              <Route path="profiles" element={<ProfileManager />} />
            </Route>
          </Routes>
        </ProfileProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;