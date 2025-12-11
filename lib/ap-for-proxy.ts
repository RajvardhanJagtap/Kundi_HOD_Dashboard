// lib/ap-for-proxy.ts
import axios, { AxiosInstance, AxiosResponse } from 'axios'

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://41.186.186.167:2000/api/v1'
const USE_PROXY = process.env.NEXT_PUBLIC_USE_PROXY === 'true'
const API_TIMEOUT = parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '30000')
const DEBUG_API = process.env.NEXT_PUBLIC_DEBUG_API === 'true'

// Create axios instance - FIXED: Don't add /api/proxy if USE_PROXY is true
const api: AxiosInstance = axios.create({
  baseURL: USE_PROXY ? '' : API_BASE_URL, // Empty baseURL for proxy mode
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (DEBUG_API) {
      console.log('API Request:', {
        method: config.method,
        url: config.url,
        baseURL: config.baseURL,
        headers: config.headers,
      })
    }

    // Add auth token if available
    if (typeof window !== 'undefined') {
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };
      
      const token = getCookie('accessToken') || localStorage.getItem('accessToken');
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
api.interceptors.response.use(
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
  (error) => {
    if (DEBUG_API) {
      console.error('API Response Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        data: error.response?.data,
      })
    }

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined') {
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        localStorage.removeItem('accessToken');
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
    const getCookie = (name: string) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop()?.split(";").shift();
      return null;
    };
    token = getCookie('accessToken') || localStorage.getItem('accessToken');
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

export { api }