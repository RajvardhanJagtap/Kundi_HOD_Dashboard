import axios from "axios";

// Type definition for group submission
interface GroupSubmission {
  groupId: string;
  submissionDate?: string;
  status?: string;
  [key: string]: any;
}

// Use the same API configuration as other files
const API_BASE_URL = "https://ursmartmonitoring.ur.ac.rw/api/v1";

// Create axios instance with proper configuration
const apiInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 seconds timeout for large Excel files
  withCredentials: false,
  responseType: 'json', // Default to JSON, will override for Excel downloads
});

// Add request interceptor to include auth token
apiInstance.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("API Summary: Sending token with request");
    } else {
      console.log("API Summary: No token found in localStorage");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interface for the API response when generating summary sheets
interface SummarySheetResponse {
  success: boolean;
  message: string;
  data?: {
    downloadUrl?: string;
    fileName?: string;
    fileSize?: number;
  };
  timestamp: string;
}

// Generate year summary sheet in Excel format
export const generateYearSummarySheet = async (
  academicYearId: string, 
  groupId: string // Remove default test group ID - require real data
): Promise<SummarySheetResponse> => {
  if (!groupId || !academicYearId) {
    throw new Error('Academic Year ID and Group ID are required. Please select a class from the main page.');
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }
  
  try {
    console.log('API Summary: Generating year summary sheet', {
      academicYearId,
      groupId
    });
    
    // Try the same endpoint pattern as the working grading sheets
    const endpoint = `${API_BASE_URL}/grading/overall-sheets/generate-year-summary-sheet/${academicYearId}/group/${groupId}/excel`;
    console.log('API Summary: Full URL:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      // Try to get more detailed error from response
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, use the status text
      }
      
      throw new Error(`Failed to fetch summary sheet: ${errorMessage}`);
    }
    
    const blob = await response.blob();
    
    console.log('API Summary: Response status:', response.status);
    
    // If the response is a blob (Excel file), handle the download
    if (blob instanceof Blob) {
      console.log('API Summary: Received Excel file blob');
      
      // Create a download link for the Excel file
      const downloadBlob = new Blob([blob], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      
      const downloadUrl = window.URL.createObjectURL(downloadBlob);
      const fileName = `year-summary-${academicYearId}-group-${groupId}.xlsx`;
      
      // Trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL
      window.URL.revokeObjectURL(downloadUrl);
      
      return {
        success: true,
        message: 'Year summary sheet generated and downloaded successfully',
        data: {
          fileName,
          fileSize: blob.size
        },
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error('Response is not a valid Excel blob');
    }
    
  } catch (error) {
    console.error('API Summary: Error generating year summary sheet:', error);
    
    // Return a structured error response
    return {
      success: false,
      message: `Failed to generate year summary sheet: ${error instanceof Error ? error.message : 'Unknown error'}`,
      data: undefined,
      timestamp: new Date().toISOString()
    };
  }
};

// Get available groups for summary sheet generation
export const getAvailableGroups = async (academicYearId: string) => {
  try {
    console.log('API Summary: Fetching available groups for academic year:', academicYearId);
    
    // This is a placeholder - you might need a different endpoint to get groups
    const url = `/grading/groups?academicYearId=${academicYearId}`;
    console.log('API Summary: Full URL:', `${API_BASE_URL}${url}`);
    
    const response = await apiInstance.get(url);
    console.log('API Summary: Groups response:', response.data);
    
    return response.data;
  } catch (error) {
    console.error('API Summary: Error fetching groups:', error);
    throw error;
  }
};

// Get submitted group IDs from lesson submissions
export const getSubmittedGroupIds = async (): Promise<string[]> => {
  try {
    console.log('API Summary: Fetching submitted group IDs from lesson submissions');
    
    // TODO: Implement proper API call when submission endpoint is available
    console.log('API Summary: Submission endpoint not yet implemented');
    return [];
  } catch (error) {
    console.error('API Summary: Error fetching submitted group IDs:', error);
    throw error;
  }
};

// Get submitted groups with their details
export const getSubmittedGroups = async (): Promise<GroupSubmission[]> => {
  try {
    console.log('API Summary: Fetching submitted groups with details');
    
    // TODO: Implement proper API call when submission endpoint is available
    console.log('API Summary: Submission endpoint not yet implemented');
    return [];
  } catch (error) {
    console.error('API Summary: Error fetching submitted groups:', error);
    throw error;
  }
};

// Interface for using in components
export interface SummarySheetParams {
  academicYearId: string;
  groupId: string;
}

// Remove test constants - components should use real backend data
// export const TEST_GROUP_ID = "e29ea9f8-b815-4a1b-8a66-478df24cda7d";

// Generate summary sheet - requires real group ID from backend
export const generateSummarySheet = async (academicYearId: string, groupId: string): Promise<SummarySheetResponse> => {
  return generateYearSummarySheet(academicYearId, groupId);
};


// Generate summary sheet blob for preview (without downloading)
export const generateSummarySheetForPreview = async (
  academicYearId: string, 
  groupId: string
): Promise<{ blob: Blob; filename: string }> => {
  if (!groupId || !academicYearId) {
    throw new Error('Academic Year ID and Group ID are required for summary sheet generation.');
  }

  const token = localStorage.getItem('accessToken');
  if (!token) {
    throw new Error('Authentication token not found. Please log in again.');
  }

  try {
    console.log('API Summary: Generating summary sheet for preview', {
      academicYearId,
      groupId
    });
    
    // Use the summary sheet endpoint for preview
    const endpoint = `${API_BASE_URL}/grading/overall-sheets/generate-year-summary-sheet/${academicYearId}/group/${groupId}/excel`;
    console.log('API Summary: Full URL:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      // Try to get more detailed error from response
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
        // If response is not JSON, use the status text
      }
      
      throw new Error(`Failed to fetch summary sheet: ${errorMessage}`);
    }
    
    const blob = await response.blob();
    
    console.log('API Summary: Response status:', response.status);
    
    const filename = `year-summary-${academicYearId}-group-${groupId}.xlsx`;
    
    return { blob, filename };
  } catch (error) {
    console.error('API Summary: Error generating summary sheet for preview:', error);
    throw error;
  }
};

// Export types for use in components
export type { SummarySheetResponse };

/**
 * Parses Excel blob data into structured format for preview
 * @param blob - The Excel file blob
 * @param filename - The filename for the Excel file
 * @returns Promise with parsed Excel data
 */
export async function parseExcelForPreview(blob: Blob, filename: string): Promise<any> {
  return new Promise(async (resolve, reject) => {
    try {
      // Dynamically import XLSX (client-side only)
      if (typeof window === 'undefined') {
        throw new Error('Excel parsing is only available in the browser');
      }

      const XLSX = await import('xlsx');
      
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { 
            type: 'array',
            cellStyles: true,
            cellFormula: false,
            cellHTML: false
          });
        
          console.log('Summary Workbook info:', {
            sheetNames: workbook.SheetNames,
            hasWorkbookProps: !!workbook.Workbook,
            firstSheet: workbook.SheetNames[0]
          });
        
          const sheets: any[] = [];
        
          workbook.SheetNames.forEach(sheetName => {
            const worksheet = workbook.Sheets[sheetName];
            
            console.log(`Processing summary sheet: ${sheetName}`);
            
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
            
            // Extract merged cell ranges
            const mergedCells: Array<{
              startRow: number;
              startCol: number;
              endRow: number;
              endCol: number;
              value: any;
            }> = [];
            
            if (worksheet['!merges']) {
              worksheet['!merges'].forEach(merge => {
                const startRow = merge.s.r;
                const startCol = merge.s.c;
                const endRow = merge.e.r;
                const endCol = merge.e.c;
                
                // Get the value from the top-left cell of the merge
                const cellRef = XLSX.utils.encode_cell({ r: startRow, c: startCol });
                const cell = worksheet[cellRef];
                
                mergedCells.push({
                  startRow,
                  startCol,
                  endRow,
                  endCol,
                  value: cell ? cell.v : null
                });
              });
            }
            
            const headers = jsonData.length > 0 ? (jsonData[0] as any[]).map(h => h?.toString() || '') : [];
            const rows = jsonData.slice(1).map((row: unknown) => {
              const rowArray = Array.isArray(row) ? row : [];
              return rowArray.map(cell => ({
                value: cell,
                styling: {} // Basic styling, can be enhanced
              }));
            });
            
            sheets.push({
              sheetName,
              headers,
              rows,
              totalRows: jsonData.length - 1,
              mergedCells
            });
          });
          
          resolve({
            sheets,
            filename,
            fileSize: blob.size
          });
        } catch (error) {
          console.error('Error parsing Excel data:', error);
          reject(new Error(`Failed to parse Excel data: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(blob);
    } catch (error) {
      console.error('Error setting up Excel parser:', error);
      reject(new Error(`Failed to initialize Excel parser: ${error instanceof Error ? error.message : 'Unknown error'}`));
    }
  });
}

/**
 * Fetches and parses summary sheet for preview
 * @param academicYearId - The academic year ID
 * @param groupId - The group ID
 * @returns Promise with parsed Excel data
 */
export async function fetchAndParseSummarySheet(academicYearId: string, groupId: string): Promise<any> {
  try {
    console.log('Fetching and parsing summary sheet for preview:', { academicYearId, groupId });
    
    const { blob, filename } = await generateSummarySheetForPreview(academicYearId, groupId);
    const previewData = await parseExcelForPreview(blob, filename);
    
    console.log('Summary sheet parsed successfully:', previewData);
    return previewData;
  } catch (error) {
    console.error('Error fetching and parsing summary sheet:', error);
    throw error;
  }
}