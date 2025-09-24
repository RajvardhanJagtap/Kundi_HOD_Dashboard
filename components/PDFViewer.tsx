// components/PDFViewer.tsx - FIXED VERSION
'use client'

import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

// CRITICAL FIX: Set the correct worker version to match react-pdf's PDF.js version
// This fixes the version mismatch error
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

// Alternative CDN if unpkg fails:
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'

interface PDFViewerProps {
  pdfData?: ArrayBuffer | null
  pdfUrl?: string | null
  isLoading?: boolean
  error?: string | null
  className?: string
}

export default function PDFViewer({
  pdfData,
  pdfUrl,
  isLoading = false,
  error = null,
  className = ''
}: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const [scale, setScale] = useState<number>(1.0)
  const [loadError, setLoadError] = useState<string | null>(null)

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages)
    setPageNumber(1)
    setLoadError(null)
    toast.success('PDF loaded successfully')
  }, [])

  const onDocumentLoadError = useCallback((error: any) => {
    console.error('PDF loading error:', error)
    
    // Handle specific PDF.js errors
    if (error.message?.includes('version') || error.message?.includes('worker')) {
      setLoadError('PDF viewer initialization failed. This may be due to browser compatibility issues.')
    } else if (error.name === 'InvalidPDFException') {
      setLoadError('The file is not a valid PDF document.')
    } else if (error.name === 'MissingPDFException') {
      setLoadError('PDF file not found or corrupted.')
    } else {
      setLoadError('Failed to load PDF. Please try downloading instead.')
    }
    
    toast.error('Failed to load PDF')
  }, [])

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
      
      const timestamp = new Date().toISOString().split('T')[0]
      link.download = `transcript_${timestamp}.pdf`
      
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

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">Loading PDF...</span>
        </div>
      </div>
    )
  }

  if (error || loadError) {
    return (
      <div className={`${className}`}>
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || loadError}
          </AlertDescription>
        </Alert>
        
        {(pdfData || pdfUrl) && (
          <div className="flex justify-center">
            <Button onClick={downloadPDF} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Download PDF Instead
            </Button>
          </div>
        )}
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

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* PDF Controls */}
      <div className="border-b bg-gray-50 px-4 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-gray-600">
            {numPages > 0 && (
              <>Page {pageNumber} of {numPages}</>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Navigation */}
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
                disabled={pageNumber <= 1 || numPages === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
                disabled={pageNumber >= numPages || numPages === 0}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Zoom */}
            <div className="flex items-center space-x-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setScale(Math.max(0.5, scale - 0.25))}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-xs px-2 min-w-[50px] text-center">
                {Math.round(scale * 100)}%
              </span>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => setScale(Math.min(3.0, scale + 0.25))}
                disabled={scale >= 3.0}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
            
            <Button size="sm" variant="outline" onClick={downloadPDF}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Document */}
      <div className="overflow-auto max-h-[800px] p-4 bg-gray-100">
        <div className="flex justify-center">
          <Document
            file={pdfData || pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                <span className="text-gray-600">Loading document...</span>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                <p className="text-red-600 mb-4">Failed to load PDF</p>
                <Button onClick={downloadPDF} variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-1" />
                  Download instead
                </Button>
              </div>
            }
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              loading={
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600 mr-2" />
                  <span className="text-gray-600">Loading page...</span>
                </div>
              }
              error={
                <div className="flex items-center justify-center py-8">
                  <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                  <span className="text-red-600">Failed to load page</span>
                </div>
              }
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  )
}