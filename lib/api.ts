import axios from 'axios';

const API_BASE_URL = 'http://41.186.186.167:2000/api/v1';

// Helper functions for cookie management
const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const result = parts.pop()?.split(";").shift();
    return result || null;
  }
  return null;
};

const setCookie = (name: string, value: string, maxAge: number): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

const clearCookie = (name: string): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout (was 1000000 which is too long)
});

// Token refresh state
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

// Add subscriber to queue
const addRefreshSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

// Notify all subscribers
const notifyRefreshSubscribers = (token: string) => {
  refreshSubscribers.forEach(callback => callback(token));
  refreshSubscribers = [];
};

// Check if token is about to expire (within 5 minutes)
const isTokenExpiringSoon = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    return expirationTime - currentTime < fiveMinutes;
  } catch {
    return true; // If we can't parse the token, assume it's expiring
  }
};

// Proactive token refresh
const refreshTokenIfNeeded = async (): Promise<string | null> => {
  const token = getCookie('accessToken');
  const refreshToken = getCookie('refreshToken');
  
  if (!token || !refreshToken) return null;
  
  // Check if token is expiring soon
  if (!isTokenExpiringSoon(token)) return token;
  
  // If already refreshing, wait for it to complete
  if (isRefreshing) {
    return new Promise((resolve) => {
      addRefreshSubscriber((newToken) => {
        resolve(newToken);
      });
    });
  }
  
  isRefreshing = true;
  
  try {
    const refreshEndpoint = process.env.NODE_ENV === 'development'
      ? '/api/auth/refresh'
      : 'http://41.186.186.167:2000/api/v1/auth/refresh';
      
    const response = await axios.post(refreshEndpoint, {
      refreshToken,
    });
    
    const { accessToken } = response.data.data;
    
    // Update access token cookie (1 day = 86400 seconds)
    setCookie('accessToken', accessToken, 86400);
    
    // Notify all waiting requests
    notifyRefreshSubscribers(accessToken);
    
    return accessToken;
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Clear all auth data and redirect
    clearCookie('accessToken');
    clearCookie('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
    localStorage.removeItem('roles');
    window.location.href = '/login';
    return null;
  } finally {
    isRefreshing = false;
  }
};

// Request interceptor to add auth token and refresh if needed
api.interceptors.request.use(async (config) => {
  if (typeof window !== 'undefined') {
    const token = await refreshTokenIfNeeded();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for token refresh (fallback)
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        const refreshToken = getCookie('refreshToken');
        if (refreshToken && !isRefreshing) {
          try {
            const newToken = await refreshTokenIfNeeded();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return api(originalRequest);
            }
          } catch (refreshError) {
            // Error already handled in refreshTokenIfNeeded
          }
        }
      }
    }
    
    return Promise.reject(error);
  }
);