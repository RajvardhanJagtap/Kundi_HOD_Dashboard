import { api } from "@/lib/api";
export interface TranscriptResponse {
  success: boolean;
  message: string;
  data: Blob;
  timestamp: string;
}

export const transcriptApi = {
  getStudentTranscriptPdf: async (studentId: string, academicYearId: string): Promise<Blob> => {
    const response = await api.get<Blob>(
      `https://ursmartmonitoring.ur.ac.rw/api/v1/grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`,
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      }
    );
    return response.data;
  },

  getStudentTranscriptUrl: (studentId: string, academicYearId: string): string => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const authParam = token ? `?token=${encodeURIComponent(token)}` : '';
    return `https://ursmartmonitoring.ur.ac.rw/api/v1/grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf${authParam}`;
  },

  downloadStudentTranscriptPdf: async (
    studentId: string, 
    academicYearId: string, 
    studentName: string
  ): Promise<void> => {
    const response = await api.get<Blob>(
      `https://ursmartmonitoring.ur.ac.rw/api/v1/grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`,
      {
        responseType: 'blob',
        headers: {
          'Accept': 'application/pdf',
        },
      }
    );
    
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    
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
      window.URL.revokeObjectURL(url);
    }, 100);
  },

  validatePdfData: (data: ArrayBuffer): boolean => {
    try {
      const uint8Array = new Uint8Array(data);
      const pdfSignature = [0x25, 0x50, 0x44, 0x46];
      
      if (uint8Array.length < 4) return false;
      
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

  createValidatedBlobUrl: async (studentId: string, academicYearId: string): Promise<string | null> => {
    try {
      const response = await api.get<Blob>(
        `https://ursmartmonitoring.ur.ac.rw/api/v1/grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`,
        {
          responseType: 'blob',
          headers: {
            'Accept': 'application/pdf',
          },
        }
      );
      
      const arrayBuffer = await response.data.arrayBuffer();
      const isValidPdf = transcriptApi.validatePdfData(arrayBuffer);
      
      if (!isValidPdf) {
        throw new Error('Invalid PDF data received from server');
      }
      
      return window.URL.createObjectURL(response.data);
    } catch (error) {
      console.error('Error creating validated blob URL:', error);
      return null;
    }
  },
};
