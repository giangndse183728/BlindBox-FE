import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Lấy API URL từ biến môi trường Expo
const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:5000";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// ✅ Interceptor để tự động thêm token vào request
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// ✅ Interceptor để xử lý token hết hạn (401)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("No refresh token found");
        }

        const response = await axios.post(`${API_URL}/accounts/refresh-token`, {}, { withCredentials: true });

        if (response.data.result.accessToken) {
          await AsyncStorage.setItem("token", response.data.result.accessToken);
          originalRequest.headers["Authorization"] = `Bearer ${response.data.result.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("refreshToken");
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
