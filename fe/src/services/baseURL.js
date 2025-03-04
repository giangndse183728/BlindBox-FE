import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:5000", 
  withCredentials: true,  // Important for sending/receiving cookies
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}/accounts/refresh-token`,
          {},  
          { 
            withCredentials: true,  // Important for sending cookies
          }
        );

        // Only handle access token, refresh token is handled by backend via cookie
        if (response.data.result.accessToken) {
          localStorage.setItem('token', response.data.result.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${response.data.result.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // If refresh fails, clear access token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
