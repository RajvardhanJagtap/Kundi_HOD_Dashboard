// hooks/useMarkSheet.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchModuleMarkSheetExcel } from '@/lib/module-marks/grading-api';
import * as XLSX from 'xlsx';

interface UseMarkSheetReturn {
  marksheetData: any[][];
  isLoading: boolean;
  error: string | null;
  excelBlob: Blob | null;
  refetch: () => void;
}

export const useMarkSheet = (moduleId: string | null): UseMarkSheetReturn => {
  const [marksheetData, setMarksheetData] = useState<any[][]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [excelBlob, setExcelBlob] = useState<Blob | null>(null);

  const processExcelBlob = async (blob: Blob) => {
    try {
      const arrayBuffer = await blob.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      
      if (!sheetName) {
        throw new Error('No sheets found in the Excel file');
      }
      
      const worksheet = workbook.Sheets[sheetName];
      
      // Get all rows as arrays - this preserves the exact Excel structure
      const allRows: any[][] = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: '',
        raw: false
      });

      console.log('Excel data loaded:', allRows.length, 'rows');
      
      // Set the raw data exactly as it is in Excel
      setMarksheetData(allRows);
      setExcelBlob(blob);
      
    } catch (err: any) {
      console.error('Error processing Excel file:', err);
      throw new Error(`Failed to process Excel file: ${err.message}`);
    }
  };

  const fetchData = useCallback(async () => {
    if (!moduleId) {
      setMarksheetData([]);
      setExcelBlob(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await fetchModuleMarkSheetExcel(moduleId);
      await processExcelBlob(blob);
    } catch (err: any) {
      setError(err.message || 'Failed to load marksheet');
      setMarksheetData([]);
      setExcelBlob(null);
    } finally {
      setIsLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    marksheetData,
    isLoading,
    error,
    excelBlob,
    refetch: fetchData
  };
};