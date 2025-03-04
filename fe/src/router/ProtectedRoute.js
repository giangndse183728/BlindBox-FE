import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const userRole = JSON.parse(localStorage.getItem('user')).role;


  if (!token) {
    return <Navigate to="/Login" />;
  }

  if ( userRole !== requiredRole) {
    return <Navigate to="/" />;  
  }

  return children;  
};

export default ProtectedRoute;
