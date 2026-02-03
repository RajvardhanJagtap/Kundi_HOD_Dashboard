import { useState } from "react"
import { downloadRepeatersSummarySheet, fetchRepeatersSummarySheet, parseExcelForPreview, validateGradingSheetParams } from "@/lib/api-grading"
import { useToast } from "@/hooks/use-toast"

export const useDownloadRepeatersSummary = () => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewData, setPreviewData] = useState<any | null>(null)
  const { toast } = useToast()

  const downloadRepeatersSummary = async (academicYearId: string, groupId: string) => {
    setIsDownloading(true)
    setError(null)
    try {
      validateGradingSheetParams({ yearId: academicYearId, groupId })
      const filename = await downloadRepeatersSummarySheet({ yearId: academicYearId, groupId })
      toast({
        title: "Download Started",
        description: `Repeaters & Retakers Summary sheet \"${filename}\" is being downloaded.`,
      })
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to download summary sheet'
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

  const loadPreview = async (academicYearId: string, groupId: string) => {
    setIsPreviewLoading(true)
    setError(null)
    try {
      validateGradingSheetParams({ yearId: academicYearId, groupId })
      const { blob, filename } = await fetchRepeatersSummarySheet({ yearId: academicYearId, groupId })
      const preview = await parseExcelForPreview(blob, filename)
      setPreviewData(preview)
      toast({
        title: "Preview Loaded",
        description: "Repeaters & Retakers Summary sheet preview loaded successfully.",
      })
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to load summary preview'
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

  return {
    isDownloading,
    isPreviewLoading,
    error,
    previewData,
    downloadRepeatersSummary,
    loadPreview,
  }
}
