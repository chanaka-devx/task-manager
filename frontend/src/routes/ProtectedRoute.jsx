import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../context/useAuth';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  const hasToken = typeof window !== 'undefined' && localStorage.getItem('token');

  if (!user && !hasToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;
