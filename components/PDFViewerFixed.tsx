// components/PDFViewerFixed.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { Loader2, AlertCircle, Download, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from 'sonner'

// Fix PDF.js version mismatch by using specific versions
const PDFJS_VERSION = '3.11.174'

interface PDFViewerFixedProps {
  pdfData?: ArrayBuffer | null
  pdfUrl?: string | null
  isLoading?: boolean
  error?: string | null
  className?: string
  studentName?: string
}

export default function PDFViewerFixed({
  pdfData,
  pdfUrl,
  isLoading = false,
  error = null,
  className = '',
  studentName = 'Student'
}: PDFViewerFixedProps) {
  const [pdfjsLib, setPdfjsLib] = useState<any>(null)
  const [pdfDocument, setPdfDocument] = useState<any>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [pdfError, setPdfError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Load PDF.js library with fixed version
  useEffect(() => {
    const loadPdfJs = async () => {
      try {
        if (typeof window === 'undefined') return

        // Load PDF.js from CDN with matching versions
        const script = document.createElement('script')
        script.src = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.min.js`
        script.onload = () => {
          const pdfjs = (window as any).pdfjsLib
          if (pdfjs) {
            // Set the worker path to match the main library version
            pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.js`
            setPdfjsLib(pdfjs)
          }
        }
        document.head.appendChild(script)
      } catch (error) {
        console.error('Failed to load PDF.js:', error)
        setPdfError('Failed to load PDF viewer')
      }
    }

    loadPdfJs()
  }, [])

  // Load PDF document
  useEffect(() => {
    const loadPdf = async () => {
      if (!pdfjsLib || (!pdfData && !pdfUrl)) return

      try {
        setLoadingPdf(true)
        setPdfError(null)

        let loadingTask
        if (pdfData) {
          loadingTask = pdfjsLib.getDocument({ data: pdfData })
        } else if (pdfUrl) {
          loadingTask = pdfjsLib.getDocument(pdfUrl)
        } else {
          return
        }

        const pdf = await loadingTask.promise
        setPdfDocument(pdf)
        setNumPages(pdf.numPages)
        setPageNumber(1)
        
        toast.success('PDF loaded successfully')
      } catch (error: any) {
        console.error('Error loading PDF:', error)
        setPdfError('Failed to load PDF document')
        toast.error('Failed to load PDF')
      } finally {
        setLoadingPdf(false)
      }
    }

    loadPdf()
  }, [pdfjsLib, pdfData, pdfUrl])

  // Render PDF page
  useEffect(() => {
    const renderPage = async () => {
      if (!pdfDocument || !canvasRef.current) return

      try {
        const page = await pdfDocument.getPage(pageNumber)
        const viewport = page.getViewport({ scale })
        
        const canvas = canvasRef.current
        const context = canvas.getContext('2d')
        
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: context,
          viewport: viewport
        }

        await page.render(renderContext).promise
      } catch (error) {
        console.error('Error rendering page:', error)
        setPdfError('Failed to render PDF page')
      }
    }

    renderPage()
  }, [pdfDocument, pageNumber, scale])

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
      
      toast.success('PDF downloaded successfully')
    } catch (error) {
      console.error('Download failed:', error)
      toast.error('Download failed')
    }
  }

  if (isLoading || loadingPdf) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <span className="text-sm text-gray-600">
            {isLoading ? 'Loading transcript...' : 'Loading PDF viewer...'}
          </span>
        </div>
      </div>
    )
  }

  if (error || pdfError) {
    return (
      <div className={`min-h-[500px] ${className}`}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || pdfError}
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

  if (!pdfjsLib) {
    // Fallback to iframe if PDF.js fails to load
    return (
      <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
        <div className="border-b bg-gray-50 px-4 py-2 flex items-center justify-between">
          <div className="text-sm text-gray-600">PDF Transcript (Fallback View)</div>
          <Button size="sm" variant="outline" onClick={downloadPDF}>
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
        </div>
        
        {pdfUrl ? (
          <iframe
            src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&page=1&zoom=page-fit`}
            className="w-full min-h-[600px] border-0"
            title="Student Transcript PDF"
            sandbox="allow-scripts allow-same-origin allow-popups"
          />
        ) : (
          <div className="flex items-center justify-center min-h-[600px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">PDF viewer unavailable</p>
              <Button onClick={downloadPDF}>
                <Download className="w-4 h-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={`border rounded-lg overflow-hidden bg-white ${className}`}>
      {/* PDF Viewer Controls */}
      <div className="border-b bg-gray-50 px-4 py-2 flex items-center justify-between flex-wrap gap-2">
        <div className="text-sm text-gray-600">
          PDF Transcript
          {numPages > 0 && (
            <span className="ml-2">
              Page {pageNumber} of {numPages}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Navigation Controls */}
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPageNumber(Math.max(1, pageNumber - 1))}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPageNumber(Math.min(numPages, pageNumber + 1))}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Zoom Controls */}
          <div className="flex items-center space-x-1">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setScale(Math.max(0.5, scale - 0.25))}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-xs px-2">
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

      {/* PDF Canvas */}
      <div className="overflow-auto max-h-[800px] p-4 bg-gray-100">
        <div className="flex justify-center">
          <canvas 
            ref={canvasRef}
            className="shadow-lg bg-white"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </div>
      </div>
    </div>
  )
}