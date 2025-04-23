import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import { MoviesProvider } from './context/MoviesContext'; // Asegúrate de importar MoviesProvider
import ProtectedRoute from './components/auth/ProtectedRoute';
import HomePage from './pages/Browse/Home';
import LoginPage from './pages/auth/Login';
import ProfileSelect from './pages/Profiles/ProfileSelect';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <AuthProvider>
      <ProfileProvider>
        <MoviesProvider>  {/* Agrega MoviesProvider aquí */}
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              } />
              <Route path="/profiles" element={
                <ProtectedRoute>
                  <ProfileSelect />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute roles={['admin']}>
                  <Admin />
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </MoviesProvider>
      </ProfileProvider>
    </AuthProvider>
  );
}

export default App;
