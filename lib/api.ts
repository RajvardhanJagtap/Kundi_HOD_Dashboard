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
    const token = localStorage.getItem('accessToken');
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
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          try {
            const refreshEndpoint = process.env.NODE_ENV === 'development'
              ? '/api/auth/refresh'
              : 'http://41.186.186.167:2000/api/v1/auth/refresh';
              
            const response = await axios.post(refreshEndpoint, {
              refreshToken,
            });
            
            const { accessToken } = response.data.data;
            localStorage.setItem('accessToken', accessToken);
            
            return api(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            localStorage.removeItem('permissions');
            localStorage.removeItem('roles');
            window.location.href = '/login';
            }
        }
        }
    }
    
    return Promise.reject(error);
    }
);