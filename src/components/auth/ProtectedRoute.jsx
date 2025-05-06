import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export const ProtectedRoute = ({ adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useContext(AuthContext);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/unauthorized" />;
  }
  
  return <Outlet />;
};