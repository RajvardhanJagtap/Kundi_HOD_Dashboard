"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ExcelPreviewTable } from "@/components/ui/excel-preview-table";
import {
  Download,
  FileSpreadsheet,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  fetchGradingExcelSheet,
  downloadGradingExcelSheet,
  fetchAndParseGradingSheet,
  validateGradingSheetParams,
  formatFileSize,
  type ExcelPreviewData,
} from "@/lib/api-grading";

interface GradingSheetInfo {
  yearId: string;
  groupId: string;
  filename?: string;
  lastModified?: Date;
  size?: number;
}

interface ExcelMarksPageProps {
  groupId?: string;
  academicYearId?: string;
}

export default function ExcelMarksPage({
  groupId,
  academicYearId,
}: ExcelMarksPageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [sheetInfo] = useState<GradingSheetInfo>({
    yearId: academicYearId || "",
    groupId: groupId || "",
  });
  const [error, setError] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<ExcelPreviewData | null>(null);
  const { toast } = useToast();

  const loadPreview = async () => {
    setIsPreviewLoading(true);
    setError(null);

    try {
      // Validate parameters first
      validateGradingSheetParams(sheetInfo);

      const previewData = await fetchAndParseGradingSheet(sheetInfo);
      setPreviewData(previewData);

      toast({
        title: "Preview Loaded",
        description: `Successfully loaded Excel preview with ${previewData.sheets.length} sheet(s).`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
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

  // Auto-load preview when component mounts (client-side only)
  const hasAutoLoaded = useRef(false);
  useEffect(() => {
    // Guard to prevent double-calls in React Strict Mode during development
    if (hasAutoLoaded.current) return;
    hasAutoLoaded.current = true;

    // Try to load preview automatically; errors are handled inside loadPreview
    if (sheetInfo.yearId && sheetInfo.groupId) {
      void loadPreview();
    }
  }, [sheetInfo.yearId, sheetInfo.groupId]);

  // Function to download the Excel sheet
  const downloadSheet = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      // Validate parameters first
      validateGradingSheetParams(sheetInfo);

      const filename = await downloadGradingExcelSheet(sheetInfo);

      toast({
        title: "Download Started",
        description: `Excel sheet "${filename}" is being downloaded.`,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
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
                    Please navigate from the main classes page to load real
                    group and academic year information.
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
                <span className="text-sm font-medium">
                  Loading grading sheet preview...
                </span>
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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Grading Sheet Preview</h2>
              
            </div>
     
          </div>
          <ExcelPreviewTable
            data={previewData.sheets}
            onDownload={downloadSheet}
            isDownloadLoading={isDownloading}
          />
        </>
      ) : (
        !isPreviewLoading &&
        !error && (
          <Card>
            <CardContent className="p-8 text-center">
              <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Preview Available
              </h3>
              <p className="text-gray-500 mb-4">
                The grading sheet preview will load automatically when data is
                available.
              </p>
              <Button
                onClick={loadPreview}
                disabled={isPreviewLoading}
                className="bg-[#026892] hover:bg-[#026899]"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry Loading Preview
              </Button>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
