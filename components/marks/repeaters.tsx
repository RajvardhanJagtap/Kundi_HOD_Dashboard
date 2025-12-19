"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileSpreadsheet, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ExcelPreviewTable } from "@/components/ui/excel-preview-table";
import { useAcademicYears } from "@/hooks/academic-year-and-semesters/useAcademicYears";
import { 
  fetchRetakersExcelSheet, 
  downloadRetakersExcelSheet, 
  fetchAndParseRetakersSheet,
  validateRetakersSheetParams,
  type RetakersExcelPreviewData,
  type RetakersSheetParams
} from '@/lib/api-retakers';

interface RepeatersComponentProps {
  className?: string;
  year?: string;
  groupId?: string;
  academicYearId?: string;
}

const RepeatersComponent: React.FC<RepeatersComponentProps> = ({ className, year, groupId, academicYearId }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  
  // Use provided IDs from backend - no fallback defaults
  const [sheetInfo] = useState<RetakersSheetParams>({
    yearId: academicYearId || '',
    groupId: groupId || ''
  });
  
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<RetakersExcelPreviewData | null>(null);
  const [hasNoRetakers, setHasNoRetakers] = useState(false);
  const { toast } = useToast();
  const { years } = useAcademicYears();

  // Get academic year name from years array using the academicYearId
  const getAcademicYearName = (): string => {
    if (!academicYearId) return 'selected';
    
    // First try to find by ID
    const yearById = years.find(y => y.id === academicYearId || y.name === academicYearId);
    if (yearById) return yearById.name;
    
    // Fallback to localStorage (might have the name stored)
    if (typeof window !== 'undefined') {
      const storedYear = localStorage.getItem('selectedAcademicYear');
      // Check if storedYear is actually a name (not a UUID)
      if (storedYear && !storedYear.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return storedYear;
      }
    }
    
    // Last resort: use the year prop if it's not a UUID
    if (year && !year.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return year;
    }
    
    return academicYearId; // Fallback to ID if name not found
  };

  // Check if sheet has actual student data (not just headers)
  const checkIfEmpty = (data: RetakersExcelPreviewData): boolean => {
    if (!data.sheets || data.sheets.length === 0) return true;
    
    for (const sheet of data.sheets) {
      // Check if there are any rows with actual student data
      // Student data typically has registration numbers (6+ digits) or numeric marks
      const hasStudentData = sheet.rows?.some(row => {
        return row.some((cell: any) => {
          // Fix: Check if cell is null/undefined first before using 'in' operator
          if (cell === null || cell === undefined) return false;
          
          const value = typeof cell === 'object' && cell !== null && 'value' in cell ? cell.value : cell;
          const strValue = String(value || '').trim();
          // Check for registration number pattern or valid marks
          return /^\d{6,}$/.test(strValue) || 
                 (/^\d+\.?\d*$/.test(strValue) && parseFloat(strValue) > 0 && parseFloat(strValue) <= 100);
        });
      });
      
      if (hasStudentData) {
        return false; // Found student data, not empty
      }
    }
    
    return true; // No student data found in any sheet
  };

  const loadPreview = async () => {
    setIsPreviewLoading(true);
    setError(null);
    setHasNoRetakers(false);

    try {
      validateRetakersSheetParams(sheetInfo);
      const data = await fetchAndParseRetakersSheet(sheetInfo);
      
      // Check if the sheet is empty (no retakers/repeaters)
      const isEmpty = checkIfEmpty(data);
      setHasNoRetakers(isEmpty);
      
      setPreviewData(data);
      
      if (isEmpty) {
        toast({
          title: "No Retakers Found",
          description: "No retake/repeat students found for this academic year.",
        });
      } else {
        toast({
          title: "Preview Loaded",
          description: `Successfully loaded retakers sheet preview with ${data.sheets.length} sheet(s).`,
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Preview Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Auto-load preview on mount (client-side only). Use a ref guard to avoid double-calls in Strict Mode
  const hasAutoLoaded = useRef(false);
  useEffect(() => {
    if (hasAutoLoaded.current) return;
    hasAutoLoaded.current = true;
    
    if (sheetInfo.yearId && sheetInfo.groupId) {
      console.log('Repeaters component - Loading preview with:', { yearId: sheetInfo.yearId, groupId: sheetInfo.groupId });
      void loadPreview();
    } else {
      console.warn('Repeaters component - Missing required IDs:', { yearId: sheetInfo.yearId, groupId: sheetInfo.groupId });
    }
  }, [sheetInfo.yearId, sheetInfo.groupId]);

  const downloadSheet = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      validateRetakersSheetParams(sheetInfo);
      const filename = await downloadRetakersExcelSheet(sheetInfo);
      
      toast({
        title: "Download Started",
        description: `Retakers sheet "${filename}" is being downloaded.`,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // Show validation message if no real data is provided
  if (!groupId || !academicYearId) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Real Group Data Required</h3>
                  <p className="text-sm mt-1">
                    Please navigate from the main classes page to load real group and academic year information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sheet Information Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#026892]" />
            Retakers & Repeaters Sheet Information
          </CardTitle>
          <CardDescription>
            Excel sheet for students who need to retake or repeat courses
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Error:</strong> {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isPreviewLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4 animate-spin text-[#026892]" />
                <span className="text-sm font-medium">Loading retakers sheet preview...</span>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Excel Preview */}
      {previewData ? (
        <div className="w-full min-w-0 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Retakers & Repeaters Sheet Preview</h2>
            </div>
          </div>
          
          <ExcelPreviewTable
            data={previewData.sheets}
            onDownload={downloadSheet}
            isDownloadLoading={isDownloading}
            hideTopMeta={true}
            emptyMessage={hasNoRetakers ? `No retake/repeat students found for academic year ${getAcademicYearName()}` : undefined}
          />
        </div>
      ) : !isPreviewLoading && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
            <p className="text-gray-600 mb-4">
              The retakers sheet preview will load automatically when data is available.
            </p>
            <Button onClick={loadPreview} disabled={isPreviewLoading} className="bg-[#026892] hover:bg-[#025f7f]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading Preview
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RepeatersComponent;