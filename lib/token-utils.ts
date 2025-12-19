/**
 * Token management utilities
 * Centralized functions for handling token refresh and cookie management
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://41.186.186.167:2000/api/v1';

/**
 * Get a cookie value by name
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

/**
 * Set a cookie with proper attributes
 */
export const setCookie = (name: string, value: string, maxAge: number = 86400): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

/**
 * Delete a cookie
 */
export const deleteCookie = (name: string): void => {
  if (typeof window === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

/**
 * Clear all authentication cookies and storage
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Clear cookies
  deleteCookie('accessToken');
  deleteCookie('refreshToken');
  
  // Clear localStorage
  localStorage.removeItem('user');
  localStorage.removeItem('permissions');
  localStorage.removeItem('roles');
};

/**
 * Refresh the access token using the refresh token
 * @returns The new access token or null if refresh failed
 */
export const refreshAccessToken = async (): Promise<string | null> => {
  if (typeof window === 'undefined') return null;
  
  const refreshToken = getCookie('refreshToken');
  
  if (!refreshToken) {
    console.warn('No refresh token available for token refresh');
    return null;
  }
  
  try {
    const axios = (await import('axios')).default;
    
    // Use the refresh endpoint (check for proxy or direct)
    const refreshEndpoint = process.env.NEXT_PUBLIC_USE_PROXY === 'true'
      ? '/api/auth/refresh'
      : `${API_BASE_URL}/auth/refresh`;
    
    const response = await axios.post(refreshEndpoint, {
      refreshToken,
    });
    
    const { accessToken, refreshToken: newRefreshToken } = response.data.data || response.data;
    
    if (!accessToken) {
      console.error('No access token received from refresh endpoint');
      return null;
    }
    
    // Update access token cookie (24 hours)
    setCookie('accessToken', accessToken, 86400);
    
    // Update refresh token if provided (7 days)
    if (newRefreshToken) {
      setCookie('refreshToken', newRefreshToken, 604800);
    }
    
    console.log('Token refreshed successfully');
    return accessToken;
  } catch (error: any) {
    console.error('Token refresh failed:', error);
    return null;
  }
};

/**
 * Check if user has valid authentication (token exists)
 */
export const hasValidToken = (): boolean => {
  const token = getCookie('accessToken');
  return !!token;
};

/**
 * Check if refresh token exists
 */
export const hasRefreshToken = (): boolean => {
  const token = getCookie('refreshToken');
  return !!token;
};

