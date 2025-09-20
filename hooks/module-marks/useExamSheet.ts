// hooks/useExamSheet.ts
import { useState, useEffect, useCallback } from 'react';
import { fetchModuleExamSheetExcel } from '@/lib/module-marks/grading-api';
import * as XLSX from 'xlsx';

interface UseExamSheetReturn {
  examSheetData: any[][];
  isLoading: boolean;
  error: string | null;
  excelBlob: Blob | null;
  refetch: () => void;
}

export const useExamSheet = (moduleId: string | null): UseExamSheetReturn => {
  const [examSheetData, setExamSheetData] = useState<any[][]>([]);
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

      console.log('Exam sheet data loaded:', allRows.length, 'rows');
      
      // Set the raw data exactly as it is in Excel
      setExamSheetData(allRows);
      setExcelBlob(blob);
      
    } catch (err: any) {
      console.error('Error processing exam sheet Excel file:', err);
      throw new Error(`Failed to process exam sheet Excel file: ${err.message}`);
    }
  };

  const fetchData = useCallback(async () => {
    if (!moduleId) {
      setExamSheetData([]);
      setExcelBlob(null);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const blob = await fetchModuleExamSheetExcel(moduleId);
      await processExcelBlob(blob);
    } catch (err: any) {
      setError(err.message || 'Failed to load exam sheet');
      setExamSheetData([]);
      setExcelBlob(null);
    } finally {
      setIsLoading(false);
    }
  }, [moduleId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    examSheetData,
    isLoading,
    error,
    excelBlob,
    refetch: fetchData
  };
};