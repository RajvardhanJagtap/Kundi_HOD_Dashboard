"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { ExcelPreviewTable } from "@/components/ui/excel-preview-table";
import { FileSpreadsheet, AlertCircle, RefreshCw } from "lucide-react";
import { useDownloadRepeatersSummary } from "@/hooks/repeaters-summary/useDownloadRepeatersSummary";

interface RepeatersSummarySheetProps {
  groupId?: string;
  academicYearId?: string;
}

export default function RepeatersSummarySheet({
  groupId,
  academicYearId,
}: RepeatersSummarySheetProps) {
  const {
    isDownloading,
    isPreviewLoading,
    error,
    previewData,
    downloadRepeatersSummary,
    loadPreview,
  } = useDownloadRepeatersSummary();

  useEffect(() => {
    if (groupId && academicYearId) {
      loadPreview(academicYearId, groupId);
    }
  }, [groupId, academicYearId]);

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
    <div className="space-y-6 w-full min-w-0 overflow-hidden">
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
                <span className="text-sm font-medium">
                  Loading repeaters summary sheet preview...
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
        <div className="w-full min-w-0 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg font-semibold">
              Repeaters & Retakers Summary Sheet Preview
            </h2>
          </div>
          <ExcelPreviewTable
            data={previewData.sheets}
            onDownload={() => downloadRepeatersSummary(academicYearId, groupId)}
            isDownloadLoading={isDownloading}
            hideTopMeta={true}
          />
        </div>
      ) : null}
    </div>
  );
}
