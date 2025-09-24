// components/FallbackPDFViewer.tsx
'use client'

import { useState, useEffect } from 'react'
import { Loader2, AlertCircle, Download, ZoomIn, ZoomOut, RotateCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface FallbackPDFViewerProps {
  pdfUrl: string | null
  pdfData: ArrayBuffer | null
  isLoading?: boolean
  error?: string | null
  className?: string
  studentName?: string
}

export default function FallbackPDFViewer({
  pdfUrl,
  pdfData,
  isLoading = false,
  error = null,
  className = '',
  studentName = 'Student'
}: FallbackPDFViewerProps) {
  const [iframeError, setIframeError] = useState(false)
  const [isIframeLoading, setIsIframeLoading] = useState(true)

  // Reset iframe error when URL changes
  useEffect(() => {
    setIframeError(false)
    setIsIframeLoading(true)
  }, [pdfUrl])

  const handleIframeLoad = () => {
    setIsIframeLoading(false)
    setIframeError(false)
  }

  const handleIframeError = () => {
    setIsIframeLoading(false)
    setIframeError(true)
  }

  const downloadPDF = async () => {
    if (!pdfUrl && !pdfData) return

    try {
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
    } catch (error) {
      console.error('Download failed:', error)
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
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!pdfUrl && !pdfData) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50 ${className}`}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No PDF data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* PDF Viewer Controls */}
      <div className="border-b bg-gray-50 px-4 py-2 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          PDF Transcript
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={downloadPDF}
            className="flex items-center"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
      </div>

      {/* PDF Content */}
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
                Try downloading the PDF or opening it in a new tab
              </p>
              <div className="flex space-x-2 justify-center">
                <Button size="sm" onClick={downloadPDF}>
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
                </Button>
                {pdfUrl && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => window.open(pdfUrl, '_blank')}
                  >
                    Open in New Tab
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : (
          pdfUrl && (
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&zoom=page-fit`}
              className="w-full min-h-[600px] border-0"
              title="Student Transcript PDF"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            />
          )
        )}
      </div>
    </div>
  )
}