"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileSpreadsheet, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
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
  const { toast } = useToast();

  const loadPreview = async () => {
    setIsPreviewLoading(true);
    setError(null);

    try {
      validateRetakersSheetParams(sheetInfo);
      const data = await fetchAndParseRetakersSheet(sheetInfo);
      setPreviewData(data);
      
      toast({
        title: "Preview Loaded",
        description: `Successfully loaded retakers sheet preview with ${data.sheets.length} sheet(s).`,
      });
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
      void loadPreview();
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
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
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
        <>
         
          
          {/* Manual table display since ExcelPreviewTable might not exist */}
          <div className="space-y-4">
            {previewData.sheets.map((sheet, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{sheet.sheetName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200">
                      <thead>
                        <tr className="bg-gray-50">
                          {sheet.headers.map((header, headerIndex) => (
                            <th key={headerIndex} className="border border-gray-200 px-4 py-2 text-left font-medium text-gray-900">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sheet.rows.slice(0, 10).map((row, rowIndex) => (
                          <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex} className="border border-gray-200 px-4 py-2 text-sm text-gray-700">
                                {typeof cell === 'object' && cell !== null ? String(cell) : String(cell || '')}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {sheet.totalRows > 10 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Showing first 10 rows of {sheet.totalRows} total rows
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
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