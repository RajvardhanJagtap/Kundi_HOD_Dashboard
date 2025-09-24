import { api, buildApiUrl, buildDirectUrl } from "@/lib/ap-for-proxy";

export interface TranscriptResponse {
  success: boolean;
  message: string;
  data: Blob;
  timestamp: string;
}

export const transcriptApi = {
  /**
   * Get PDF blob for direct display - FIXED path construction
   */
  getStudentTranscriptPdf: async (studentId: string, academicYearId: string): Promise<Blob> => {
    try {
      // Build the correct endpoint path - FIXED: no double /api/proxy
      const endpoint = `grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`;
      const url = buildApiUrl(endpoint);
      
      console.log('Fetching PDF from:', url);
      
      const response = await api.get(url, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache',
        },
        timeout: 60000,
      });

      if (response.status !== 200) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data;
    } catch (error: any) {
      console.error('PDF fetch error:', error);
      throw error;
    }
  },

  /**
   * Get PDF URL for iframe fallback - FIXED: use direct URL
   */
  getStudentTranscriptUrl: (studentId: string, academicYearId: string): string => {
    // Always use direct URL for iframe to avoid proxy issues
    const endpoint = `grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`;
    return buildDirectUrl(endpoint);
  },

  /**
   * Download student transcript PDF - FIXED path construction
   */
  downloadStudentTranscriptPdf: async (
    studentId: string, 
    academicYearId: string, 
    studentName: string
  ): Promise<void> => {
    try {
      const endpoint = `grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`;
      const url = buildApiUrl(endpoint);
      
      const response = await api.get(url, {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache',
        },
        timeout: 120000,
      });

      if (!response.data) {
        throw new Error('No data received for download');
      }

      // Create download
      const downloadUrl = window.URL.createObjectURL(response.data);
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
      console.error('Download error:', error);
      throw new Error(`Failed to download transcript: ${error.message}`);
    }
  },

  /**
   * Validate PDF data
   */
  validatePdfData: (data: ArrayBuffer): boolean => {
    try {
      if (!data || data.byteLength < 4) {
        return false;
      }
      
      const uint8Array = new Uint8Array(data);
      const pdfSignature = [0x25, 0x50, 0x44, 0x46]; // %PDF
      
      for (let i = 0; i < 4; i++) {
        if (uint8Array[i] !== pdfSignature[i]) {
          return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error validating PDF data:', error);
      return false;
    }
  },
};