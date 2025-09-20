"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ExcelPreviewTable } from '@/components/ui/excel-preview-table'
import { Download, FileSpreadsheet, AlertCircle, RefreshCw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { 
  generateYearSummarySheet, 
  generateSummarySheetForPreview,
  fetchAndParseSummarySheet
} from '@/lib/api-summary'

interface SummaryPageProps {
  groupId?: string
  academicYearId?: string
}

export default function SummaryPage({ groupId, academicYearId }: SummaryPageProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any | null>(null)
  const [filename, setFilename] = useState<string>('')
  const [fileSize, setFileSize] = useState<number>(0)
  const { toast } = useToast()

  const loadPreview = async () => {
    setIsPreviewLoading(true)
    setError(null)

    try {
      if (!academicYearId || !groupId) {
        throw new Error('Academic Year ID and Group ID are required for summary sheet generation.')
      }
      
      const previewData = await fetchAndParseSummarySheet(academicYearId, groupId)
      setPreviewData(previewData)
      setFilename(previewData.filename || 'summary_sheet.xlsx')
      setFileSize(previewData.fileSize || 0)
      
      toast({
        title: "Preview Loaded",
        description: "Summary sheet preview loaded successfully.",
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast({
        title: "Preview Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsPreviewLoading(false)
    }
  }

  // Load preview automatically when component mounts (client-side only)
  const hasAutoLoaded = useRef(false)
  useEffect(() => {
    if (hasAutoLoaded.current) return
    hasAutoLoaded.current = true

    if (academicYearId && groupId) {
      void loadPreview()
    }
  }, []) // Remove dependencies to ensure it runs on mount

  // Also trigger loading when props change
  useEffect(() => {
    if (academicYearId && groupId && !isPreviewLoading && !previewData) {
      void loadPreview()
    }
  }, [academicYearId, groupId])

  // Function to download the Excel sheet
  const downloadSheet = async () => {
    setIsDownloading(true)
    setError(null)

    try {
      if (!academicYearId || !groupId) {
        throw new Error('Academic Year ID and Group ID are required for summary sheet generation.')
      }
      
      await generateYearSummarySheet(academicYearId, groupId)
      
      toast({
        title: "Download Started",
        description: "Excel summary sheet is being downloaded.",
      })

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

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
                <span className="text-sm font-medium">Loading summary sheet preview...</span>
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
              <h2 className="text-lg font-semibold">Summary Sheet Preview</h2>
            </div>
          </div>
          <ExcelPreviewTable
            data={previewData.sheets}
            onDownload={downloadSheet}
            isDownloadLoading={isDownloading}
          />
        </>
      ) : !isPreviewLoading && !error && (
        <Card>
          <CardContent className="p-8 text-center">
            <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Preview Available</h3>
            <p className="text-gray-500 mb-4">
              The summary sheet preview will load automatically when data is available.
            </p>
            <Button onClick={loadPreview} disabled={isPreviewLoading} className="bg-[#026892] hover:bg-[#026899]">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry Loading Preview
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}