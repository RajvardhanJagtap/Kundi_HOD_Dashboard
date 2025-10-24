// src/lib/api-retakers.ts
// Dedicated API utility for managing retakers and repeaters data and Excel file operations

import { api } from './api';

/**
 * Parameters for retakers/repeaters sheet generation
 */
export interface RetakersSheetParams {
  yearId: string;
  groupId: string;
}

/**
 * Retakers sheet response interface
 */
interface RetakersSheetResponse {
  blob: Blob;
  filename: string;
}

/**
 * Excel sheet data structure for retakers
 */
export interface RetakersExcelSheetData {
  sheetName: string;
  headers: string[];
  rows: (string | number | boolean | null)[][];
  totalRows: number;
  mergedCells?: Array<{
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
    value: any;
  }>;
}

/**
 * Preview data structure for retakers Excel
 */
export interface RetakersExcelPreviewData {
  sheets: RetakersExcelSheetData[];
  filename: string;
  fileSize: number;
}

/**
 * Student retaker information
 */
export interface RetakerStudent {
  id: string;
  name: string;
  regNumber: string;
  previousGrade: string;
  currentStatus: 'Retaking' | 'Repeating';
  reason: string;
  year: number;
  semester: string;
  courses: string[];
}

/**
 * Retakers summary statistics
 */
export interface RetakersSummary {
  totalStudents: number;
  byYear: Record<string, number>;
  byStatus: Record<string, number>;
  byGrade: Record<string, number>;
  passRate: number;
}

/**
 * Fetches the retakers/repeaters Excel sheet from the API
 * @param params - The year ID and group ID
 * @returns Promise with blob data and suggested filename
 */
export async function fetchRetakersExcelSheet(params: RetakersSheetParams): Promise<RetakersSheetResponse> {
  // Validate parameters
  validateRetakersSheetParams(params);
  
  console.log('Fetching retakers sheet with params:', params);
  
  try {
    // Use the correct API endpoint for retakers (same as regular grading sheet)
    const response = await api.get(
      `/grading/overall-sheets/generate-year-regular-sheet/${params.yearId}/group/${params.groupId}/excel`,
      {
        responseType: 'blob', // Important for file downloads
      }
    );

    const blob = response.data;
    
    // Generate filename based on parameters
    const shortYearId = params.yearId.slice(0, 8);
    const shortGroupId = params.groupId.slice(0, 8);
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `retakers-sheet-${shortYearId}-${shortGroupId}-${timestamp}.xlsx`;

    return {
      blob,
      filename
    };
  } catch (error: any) {
    console.error('Error fetching retakers sheet:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch retakers sheet';
    throw new Error(`Failed to fetch retakers sheet: ${errorMessage}`);
  }
}

/**
 * Downloads the retakers/repeaters Excel sheet directly
 * @param params - The year ID and group ID
 * @returns Promise that resolves when download starts
 */
export async function downloadRetakersExcelSheet(params: RetakersSheetParams): Promise<string> {
  try {
    console.log('Starting retakers sheet download with params:', params);
    
    const { blob, filename } = await fetchRetakersExcelSheet(params);
    
    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    console.log('Retakers sheet download initiated:', filename);
    return filename;
    
  } catch (error) {
    console.error('Error downloading retakers sheet:', error);
    throw error;
  }
}

/**
 * Parse Excel blob for preview (simplified version)
 * @param blob - Excel file blob
 * @param filename - Original filename
 * @returns Promise with parsed preview data
 */
async function parseRetakersExcelForPreview(blob: Blob, filename: string): Promise<RetakersExcelPreviewData> {
  // Import XLSX dynamically to avoid bundling issues
  const XLSX = await import('xlsx');
  
  const arrayBuffer = await blob.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: 'array' });
  
  const sheets: RetakersExcelSheetData[] = [];
  
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null }) as any[][];
    
    if (jsonData.length === 0) continue;
    
    const headers = jsonData[0]?.map(header => String(header || '')) || [];
    const rows = jsonData.slice(1);
    
    sheets.push({
      sheetName,
      headers,
      rows,
      totalRows: rows.length,
    });
  }
  
  return {
    sheets,
    filename,
    fileSize: blob.size,
  };
}

/**
 * Fetches and parses the retakers/repeaters Excel sheet for preview
 * @param params - The year ID and group ID
 * @returns Promise with parsed Excel preview data
 */
export async function fetchAndParseRetakersSheet(params: RetakersSheetParams): Promise<RetakersExcelPreviewData> {
  try {
    console.log('Fetching and parsing retakers sheet with params:', params);
    
    const { blob, filename } = await fetchRetakersExcelSheet(params);
    const previewData = await parseRetakersExcelForPreview(blob, filename);
    
    console.log('Retakers sheet parsed successfully:', previewData);
    return previewData;
    
  } catch (error) {
    console.error('Error fetching and parsing retakers sheet:', error);
    throw error;
  }
}

/**
 * Validates retakers sheet parameters
 * @param params - Parameters to validate
 * @throws Error if parameters are invalid
 */
export function validateRetakersSheetParams(params: RetakersSheetParams): void {
  if (!params.yearId || typeof params.yearId !== 'string') {
    throw new Error('Year ID is required and must be a string');
  }
  
  if (!params.groupId || typeof params.groupId !== 'string') {
    throw new Error('Group ID is required and must be a string');
  }
  
  // Basic UUID format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  
  if (!uuidRegex.test(params.yearId)) {
    throw new Error('Year ID must be a valid UUID format');
  }
  
  if (!uuidRegex.test(params.groupId)) {
    throw new Error('Group ID must be a valid UUID format');
  }
}

/**
 * Fetch retakers list from API
 * @param params - Parameters for fetching retakers
 * @returns Promise with list of retaker students
 */
export async function fetchRetakersList(params: RetakersSheetParams): Promise<RetakerStudent[]> {
  console.log('Fetching retakers list with params:', params);
  
  try {
    const response = await api.get(`/retakers/${params.yearId}/group/${params.groupId}`);
    return response.data.retakers || [];
  } catch (error: any) {
    console.error('Error fetching retakers list:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch retakers list';
    throw new Error(`Failed to fetch retakers list: ${errorMessage}`);
  }
}

/**
 * Fetch retakers summary statistics
 * @param params - Parameters for fetching summary
 * @returns Promise with summary statistics
 */
export async function fetchRetakersSummary(params: RetakersSheetParams): Promise<RetakersSummary> {
  console.log('Fetching retakers summary with params:', params);
  
  try {
    const response = await api.get(`/retakers/${params.yearId}/group/${params.groupId}/summary`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching retakers summary:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch retakers summary';
    throw new Error(`Failed to fetch retakers summary: ${errorMessage}`);
  }
}

/**
 * Update retaker status
 * @param studentId - Student ID
 * @param status - New status
 * @param params - Sheet parameters for context
 * @returns Promise that resolves when update is complete
 */
export async function updateRetakerStatus(
  studentId: string, 
  status: 'Retaking' | 'Repeating', 
  params: RetakersSheetParams
): Promise<void> {
  console.log('Updating retaker status:', { studentId, status, params });
  
  try {
    await api.put(
      `/retakers/${params.yearId}/group/${params.groupId}/student/${studentId}/status`,
      { status }
    );
  } catch (error: any) {
    console.error('Error updating retaker status:', error);
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update retaker status';
    throw new Error(`Failed to update retaker status: ${errorMessage}`);
  }
}

/**
 * Utility function to format file size
 * @param bytes - File size in bytes
 * @returns Formatted file size string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Default retaker parameters (from the URL provided)
// Remove DEFAULT_RETAKERS_PARAMS - components should use real data from backend
// export const DEFAULT_RETAKERS_PARAMS: RetakersSheetParams = {
//   yearId: '2dc84bd0-ba87-4f04-92c4-a2aee2ee786d',
//   groupId: 'e29ea9f8-b815-4a1b-8a66-478df24cda7d',
// };