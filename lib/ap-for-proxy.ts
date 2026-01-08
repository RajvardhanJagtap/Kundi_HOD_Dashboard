// lib/ap-for-proxy.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios'
import { api } from './api'

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || api.defaults.baseURL
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === 'true'
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000')
const DEBUG_API = process.env.NEXT_PUBLIC_DEBUG_API === 'true'

// Create axios instance - FIXED: Don't add /api/proxy if USE_PROXY is true
const apiForProxy: AxiosInstance = axios.create({
  baseURL: USE_PROXY ? '' : API_BASE_URL, // Empty baseURL for proxy mode
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
apiForProxy.interceptors.request.use(
  async (config) => {
    if (DEBUG_API) {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
      })
    }

    // Add auth token if available (use centralized utility)
    if (typeof window !== 'undefined') {
      const { getCookie } = await import('./token-utils');
      const token = getCookie('accessToken');
      
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      
      // For proxy requests, ensure we pass the token correctly
      if (USE_PROXY && token && config.headers) {
        config.headers['X-Access-Token'] = token;
      }
    }

    return config
  },
  (error) => {
    if (DEBUG_API) {
      console.error('API Request Error:', error)
    }
    return Promise.reject(error)
  }
)

// Response interceptor
apiForProxy.interceptors.response.use(
  (response: AxiosResponse) => {
    if (DEBUG_API) {
      console.log('API Response:', {
        status: response.status,
        url: response.config.url,
        data: response.data instanceof Blob ? '[Blob Data]' : response.data,
      })
    }
    return response
  },
  async (error) => {
    if (DEBUG_API) {
      console.error('API Response Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      })
    }

    const originalRequest = error.config

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (typeof window !== 'undefined') {
        try {
          // Import token refresh utility
          const { refreshAccessToken, clearAuthData } = await import('./token-utils')
          
          const newAccessToken = await refreshAccessToken()
          
          if (newAccessToken) {
            // Update the authorization header and retry the request
            originalRequest.headers = originalRequest.headers || {}
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
            
            // If using proxy, also update X-Access-Token header
            if (USE_PROXY) {
              originalRequest.headers['X-Access-Token'] = newAccessToken
            }
            
            console.log('Token refreshed, retrying original request')
            return apiForProxy(originalRequest)
          } else {
            // Refresh failed - clear auth and redirect to login
            console.error('Token refresh failed, clearing auth data and redirecting to login')
            clearAuthData()
            
            // Dispatch logout event to notify AuthContext
            window.dispatchEvent(new CustomEvent('auth:logout'))
            
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
          }
        } catch (refreshError) {
          console.error('Error during token refresh:', refreshError)
          const { clearAuthData } = await import('./token-utils')
          clearAuthData()
          
          // Dispatch logout event to notify AuthContext
          window.dispatchEvent(new CustomEvent('auth:logout'))
          
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login'
          }
        }
      }
    } else if (error.code === 'ERR_NETWORK') {
      error.message = 'Network error. Please check your internet connection.'
    } else if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please try again.'
    }

    return Promise.reject(error)
  }
)

// Helper function to build the correct URL
export const buildApiUrl = (endpoint: string): string => {
  if (USE_PROXY) {
    // For proxy mode, prepend /api/proxy to the endpoint
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    return `/api/proxy/${cleanEndpoint}`
  } else {
    // For direct mode, use the full API URL
    return endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  }
}

// Helper function to build URL for direct access (for iframes)
export const buildDirectUrl = (endpoint: string): string => {
  let token = null;
  if (typeof window !== 'undefined') {
    // Use centralized utility (synchronously, but we'll import it lazily if needed)
    const getCookie = (name: string): string | null => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
      return null;
    };
    token = getCookie('accessToken');
  }
  
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
  const fullUrl = `${API_BASE_URL}/${cleanEndpoint}`
  
  if (token) {
    const separator = fullUrl.includes('?') ? '&' : '?'
    return `${fullUrl}${separator}token=${encodeURIComponent(token)}`
  }
  
  return fullUrl
}

// Export configuration for use in other files
export const apiConfig = {
  baseURL: API_BASE_URL,
  useProxy: USE_PROXY,
  timeout: API_TIMEOUT,
  debug: DEBUG_API,
}

export { apiForProxy }