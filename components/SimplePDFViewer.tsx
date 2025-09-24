// components/SimplePDFViewer.tsx - Ultra-simple fallback that always works
'use client'

import { useState } from 'react'
import { Download, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

interface SimplePDFViewerProps {
  pdfData?: ArrayBuffer | null
  pdfUrl?: string | null
  isLoading?: boolean
  error?: string | null
  className?: string
  studentName?: string
}

export default function SimplePDFViewer({
  pdfData,
  pdfUrl,
  isLoading = false,
  error = null,
  className = '',
  studentName = 'Student'
}: SimplePDFViewerProps) {
  const [iframeError, setIframeError] = useState(false)
  const [isIframeLoading, setIsIframeLoading] = useState(true)

  const downloadPDF = async () => {
    try {
      if (!pdfData && !pdfUrl) return

      let blob: Blob

      if (pdfData) {
        blob = new Blob([pdfData], { type: 'application/pdf' })
      } else if (pdfUrl) {
        const response = await fetch(pdfUrl)
        if (!response.ok) throw new Error('Download failed')
        blob = await response.blob()
      } else {
        return
      }

      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      const cleanName = studentName
        .replace(/[^\w\s-_.]/g, '')
        .replace(/\s+/g, '_')
        .trim()
      
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `${cleanName}_Transcript_${timestamp}.pdf`
      
      document.body.appendChild(link)
      link.click()
      
      setTimeout(() => {
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }, 100)
      
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed')
    }
  }

  const openInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank')
    } else if (pdfData) {
      const blob = new Blob([pdfData], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      window.open(url, '_blank')
      setTimeout(() => window.URL.revokeObjectURL(url), 100)
    }
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">Loading transcript...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`min-h-[500px] ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!pdfData && !pdfUrl) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No PDF data available</p>
        </div>
      </div>
    )
  }

  // Create a safe URL for iframe
  const safeUrl = pdfData 
    ? window.URL.createObjectURL(new Blob([pdfData], { type: 'application/pdf' }))
    : pdfUrl

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* Controls */}
      <div className="border-b bg-gray-50 px-4 py-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Student Transcript
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={openInNewTab}>
            <ExternalLink className="w-4 h-4 mr-1" />
            Open in Tab
          </Button>
          <Button size="sm" variant="outline" onClick={downloadPDF}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Display */}
      <div className="relative">
        {isIframeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center space-y-3">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Loading PDF...</span>
            </div>
          </div>
        )}

        {iframeError ? (
          <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-50">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Unable to display PDF in browser</p>
            <div className="space-y-2 text-center">
              <p className="text-sm text-gray-500">
                The PDF couldn't be displayed inline. You can still access it using the options below:
              </p>
              <div className="flex space-x-2 justify-center">
                <Button size="sm" onClick={downloadPDF}>
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
                </Button>
                <Button size="sm" variant="outline" onClick={openInNewTab}>
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open in New Tab
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`${safeUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&zoom=page-fit`}
            className="w-full min-h-[700px] border-0"
            title="Student Transcript PDF"
            onLoad={() => {
              setIsIframeLoading(false)
              setIframeError(false)
            }}
            onError={() => {
              setIsIframeLoading(false)
              setIframeError(true)
            }}
            sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
          />
        )}
      </div>
    </div>
  )
}