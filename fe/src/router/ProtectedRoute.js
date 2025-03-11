import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import LoadingScreen from '../components/Loading/LoadingScreen';

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          return;
        }

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setHasRequiredRole(false);
          return;
        }

        const user = JSON.parse(userStr);
        const userRole = typeof user.role === 'string' ? parseInt(user.role, 10) : user.role;
        setHasRequiredRole(requiredRoles.includes(userRole));
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication verification error:", error);
        setIsAuthenticated(false);
        setHasRequiredRole(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, [requiredRoles, location.pathname]);

  if (isLoading) {
    return (
    
        <LoadingScreen/>
    
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRequiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;