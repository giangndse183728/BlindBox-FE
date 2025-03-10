import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import api from '../services/baseURL'; 

const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(false);
  const location = useLocation();


  const isTokenExpired = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
  
      return payload.exp && (payload.exp * 1000) < (Date.now() + 60000);
    } catch (e) {
      console.error("Error parsing token:", e);
      return true; 
    }
  };


  const refreshToken = async () => {
    try {
      
      const response = await api.post('/accounts/refresh-token', {});
      
  
      if (response.data.result && response.data.result.accessToken) {
        localStorage.setItem('token', response.data.result.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
     
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return false;
    }
  };

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        
     
        if (!token) {
          setIsAuthenticated(false);
          setHasRequiredRole(false);
          return;
        }
        
       
        if (token.split('.').length === 3) {
          if (isTokenExpired(token)) {
        
            const refreshed = await refreshToken();
            if (!refreshed) {
              setIsAuthenticated(false);
              setHasRequiredRole(false);
              return;
            }
 
            const newToken = localStorage.getItem('token');
            if (!newToken || isTokenExpired(newToken)) {
              setIsAuthenticated(false);
              setHasRequiredRole(false);
              return;
            }
          }
        }
        
    
        if (requiredRoles.length > 0) {
          const userStr = localStorage.getItem('user');
          if (!userStr) {
            setHasRequiredRole(false);
            return;
          }
          
          try {
            const user = JSON.parse(userStr);
   
            const userRole = typeof user.role === 'string' ? parseInt(user.role, 10) : user.role;
            setHasRequiredRole(requiredRoles.includes(userRole));
          } catch (e) {
            console.error("Error parsing user data:", e);
            setHasRequiredRole(false);
          }
        } else {
          setHasRequiredRole(true);
        }
        
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
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
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
