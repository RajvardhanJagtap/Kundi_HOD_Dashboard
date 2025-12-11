// lib/transcripts/transcript-api.ts - Enhanced with multiple fetch strategies
import { api, buildApiUrl, buildDirectUrl } from "@/lib/ap-for-proxy";

export interface TranscriptResponse {
  success: boolean;
  message: string;
  data: Blob;
  timestamp: string;
}

export interface FetchStrategy {
  name: string;
  fetch: () => Promise<Blob>;
  shouldRetry?: boolean;
}

export const transcriptApi = {
  /**
   * Enhanced PDF fetching with multiple strategies
   */
  getStudentTranscriptPdf: async (studentId: string, academicYearId: string): Promise<Blob> => {
    const endpoint = `grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`;
    
    // Strategy 1: Proxy with credentials
    const proxyStrategy: FetchStrategy = {
      name: 'proxy-with-auth',
      fetch: async () => {
        const url = buildApiUrl(endpoint);
        console.log('Strategy 1: Proxy with auth -', url);
        
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };
        
        const token = getCookie('accessToken') || sessionStorage.getItem('accessToken');
        const headers: HeadersInit = {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
          headers['X-Access-Token'] = token;
        }

        const response = await fetch(url, {
          method: 'GET',
          headers,
          credentials: 'include',
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.blob();
      }
    };

    // Strategy 2: Direct API call with CORS mode
    const directStrategy: FetchStrategy = {
      name: 'direct-cors',
      fetch: async () => {
        const directUrl = buildDirectUrl(endpoint);
        console.log('Strategy 2: Direct CORS -', directUrl);
        
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };
        
        const token = getCookie('accessToken') || sessionStorage.getItem('accessToken');
        const headers: HeadersInit = {
          'Accept': 'application/pdf',
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        };
        
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(directUrl, {
          method: 'GET',
          headers,
          mode: 'cors',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.blob();
      }
    };

    // Strategy 3: Proxy with token as query parameter
    const proxyQueryTokenStrategy: FetchStrategy = {
      name: 'proxy-query-token',
      fetch: async () => {
        const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };
        
        const token = getCookie('accessToken') || sessionStorage.getItem('accessToken');
        if (!token) throw new Error('No token available for query param strategy');
        
        const url = `${buildApiUrl(endpoint)}?token=${encodeURIComponent(token)}`;
        console.log('Strategy 3: Proxy with query token -', url);

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache',
          },
          cache: 'no-store',
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return response.blob();
      }
    };

    // Strategy 4: XMLHttpRequest fallback (sometimes handles CORS differently)
    const xhrStrategy: FetchStrategy = {
      name: 'xhr-fallback',
      fetch: async () => {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          const url = buildApiUrl(endpoint);
          console.log('Strategy 4: XHR fallback -', url);
          
          xhr.open('GET', url, true);
          xhr.responseType = 'blob';
          xhr.withCredentials = true;
          
          const getCookie = (name: string) => {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop()?.split(";").shift();
            return null;
          };
          
          const token = getCookie('accessToken') || sessionStorage.getItem('accessToken');
          if (token) {
            xhr.setRequestHeader('Authorization', `Bearer ${token}`);
          }
          xhr.setRequestHeader('Accept', 'application/pdf');
          
          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(xhr.response);
            } else {
              reject(new Error(`XHR failed: ${xhr.status} ${xhr.statusText}`));
            }
          };
          
          xhr.onerror = () => reject(new Error('XHR network error'));
          xhr.ontimeout = () => reject(new Error('XHR timeout'));
          xhr.timeout = 60000;
          
          xhr.send();
        });
      }
    };

    const strategies = [proxyStrategy, directStrategy, proxyQueryTokenStrategy, xhrStrategy];
    
    let lastError: Error | null = null;
    
    for (const strategy of strategies) {
      try {
        console.log(`Attempting strategy: ${strategy.name}`);
        const blob = await strategy.fetch();
        
        // Validate the PDF
        const arrayBuffer = await blob.arrayBuffer();
        const isValidPdf = transcriptApi.validatePdfData(arrayBuffer);
        
        if (isValidPdf && blob.size > 0) {
          console.log(`Success with strategy: ${strategy.name}, size: ${blob.size} bytes`);
          return blob;
        } else {
          console.warn(`Strategy ${strategy.name} returned invalid or empty PDF`);
          continue;
        }
      } catch (error: any) {
        console.warn(`Strategy ${strategy.name} failed:`, error.message);
        lastError = error;
        
        // For certain errors, skip remaining strategies
        if (error.message?.includes('401') || error.message?.includes('Authentication')) {
          console.log('Authentication error - stopping strategy attempts');
          break;
        }
        
        // Continue to next strategy
        continue;
      }
    }
    
    // All strategies failed
    throw lastError || new Error('All PDF fetch strategies failed');
  },

  /**
   * Enhanced URL generation for iframe fallback
   */
  getStudentTranscriptUrl: (studentId: string, academicYearId: string): string => {
    const endpoint = `grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`;
    const getCookie = (name: string) => {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; ${name}=`);
          if (parts.length === 2) return parts.pop()?.split(";").shift();
          return null;
        };
        
        const token = getCookie('accessToken') || sessionStorage.getItem('accessToken');

    // Important: Use our same-origin proxy for iframe/tab viewing to avoid
    // X-Frame-Options and cross-origin auth header issues on the backend domain.
    // We append the token as a query parameter so the proxy can forward it.
    // Force using same-origin proxy path for iframe/new-tab to avoid Next routing
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint
    const proxyBase = `/api/proxy/${cleanEndpoint}`; // e.g. /api/proxy/grading/...

    // Always return an absolute URL to avoid Next routing this as a page
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const base = origin ? `${origin}${proxyBase}` : proxyBase

    if (!token) {
      return base;
    }

    const separator = base.includes('?') ? '&' : '?';
    return `${base}${separator}token=${encodeURIComponent(token)}`;
  },

  /**
   * Enhanced download with retry logic
   */
  downloadStudentTranscriptPdf: async (
    studentId: string, 
    academicYearId: string, 
    studentName: string
  ): Promise<void> => {
    try {
      // First try to get the blob using our enhanced method
      const blob = await transcriptApi.getStudentTranscriptPdf(studentId, academicYearId);
      
      // Create download
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      
      const cleanName = studentName
        .replace(/[^\w\s-_.]/g, '')
        .replace(/\s+/g, '_')
        .trim();
        
      const timestamp = new Date().toISOString().split('T')[0];
      link.download = `${cleanName}_Transcript_${timestamp}.pdf`;
      
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        window.URL.revokeObjectURL(downloadUrl);
      }, 100);
      
    } catch (error: any) {
      console.error('Enhanced download error:', error);
      throw new Error(`Failed to download transcript: ${error.message}`);
    }
  },

  /**
   * Validate PDF data with enhanced checks
   */
  validatePdfData: (data: ArrayBuffer): boolean => {
    try {
      if (!data || data.byteLength < 4) {
        return false;
      }
      
      const uint8Array = new Uint8Array(data);
      const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
      
      // Check PDF signature
      for (let i = 0; i < 4; i++) {
        if (uint8Array[i] !== pdfSignature[i]) {
          return false;
        }
      }
      
      // Additional validation: check for EOF marker
      const dataStr = new TextDecoder().decode(uint8Array.slice(0, Math.min(1024, uint8Array.length)));
      if (dataStr.includes('%PDF-') && data.byteLength > 100) {
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error validating PDF data:', error);
      return false;
    }
  },

  /**
   * Test connection to API
   */
  testConnection: async (): Promise<{ success: boolean; method: string; error?: string }> => {
    const testEndpoint = 'health-check'; // Adjust this to a valid test endpoint
    
    try {
      const response = await fetch(buildApiUrl(testEndpoint), {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      });
      
      return {
        success: response.ok,
        method: 'proxy',
        error: response.ok ? undefined : `${response.status} ${response.statusText}`
      };
    } catch (error: any) {
      return {
        success: false,
        method: 'proxy',
        error: error.message
      };
    }
  },
};