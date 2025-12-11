import axios from 'axios';

const API_BASE_URL = 'http://41.186.186.167:2000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 1000000, // 10 second timeout
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    // Use cookies instead of localStorage to match summary API
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };
    
    const token = getCookie('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        // Use cookies for refresh token as well
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };
        
        const refreshToken = getCookie('refreshToken');
        if (refreshToken) {
          try {
            const refreshEndpoint = process.env.NODE_ENV === 'development'
              ? '/api/auth/refresh'
              : 'http://41.186.186.167:2000/api/v1/auth/refresh';
              
            const response = await axios.post(refreshEndpoint, {
              refreshToken,
            });
            
            const { accessToken } = response.data.data;
            // Store new token in cookie
            document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Lax`;
            
            return api(originalRequest);
          } catch (refreshError) {
            // Clear cookies and redirect
            document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            localStorage.removeItem('user');
            localStorage.removeItem('permissions');
            localStorage.removeItem('roles');
            window.location.href = '/login';
          }
        } else {
          // No refresh token, clear and redirect
          document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          localStorage.removeItem('user');
          localStorage.removeItem('permissions');
          localStorage.removeItem('roles');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);