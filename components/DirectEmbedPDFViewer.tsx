// components/SimplePDFViewer.tsx - Fixed to use the working blob URL
'use client'

import { useState, useEffect } from 'react'
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

  // The key insight: if pdfUrl starts with "blob:", it's already the working URL!
  // If pdfData exists, we should create a blob URL from it
  const [displayUrl, setDisplayUrl] = useState<string | null>(null)

  useEffect(() => {
    if (pdfUrl && pdfUrl.startsWith('blob:')) {
      // This is already a working blob URL - use it directly!
      setDisplayUrl(pdfUrl)
      console.log('Using existing blob URL:', pdfUrl)
    } else if (pdfData) {
      // Create blob URL from data
      const blob = new Blob([pdfData], { type: 'application/pdf' })
      const blobUrl = URL.createObjectURL(blob)
      setDisplayUrl(blobUrl)
      console.log('Created new blob URL:', blobUrl)
      
      // Cleanup function
      return () => {
        URL.revokeObjectURL(blobUrl)
      }
    } else if (pdfUrl) {
      // Fallback to original URL
      setDisplayUrl(pdfUrl)
    }
  }, [pdfData, pdfUrl])

  const downloadPDF = async () => {
    try {
      let blob: Blob

      if (pdfData) {
        blob = new Blob([pdfData], { type: 'application/pdf' })
      } else if (displayUrl) {
        const response = await fetch(displayUrl)
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
    if (displayUrl) {
      window.open(displayUrl, '_blank')
      console.log('Opening in new tab:', displayUrl)
    }
  }

  const handleIframeLoad = () => {
    console.log('Iframe loaded successfully')
    setIsIframeLoading(false)
    setIframeError(false)
  }

  const handleIframeError = () => {
    console.error('Iframe failed to load')
    setIsIframeLoading(false)
    setIframeError(true)
  }

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] border rounded-lg bg-gray-50 ${className}`}>
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#026892]" />
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

  if (!displayUrl) {
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
      {/* Controls */}
      <div className="border-b bg-gray-50 px-4 py-2 flex items-center justify-end">
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
              <Loader2 className="w-6 h-6 animate-spin text-[#026892]" />
              <span className="text-sm text-gray-600">Loading PDF...</span>
            </div>
          </div>
        )}

        {iframeError ? (
          <div className="flex flex-col items-center justify-center min-h-[600px] bg-gray-50">
            <AlertCircle className="w-12 h-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Unable to display PDF in browser</p>
            <div className="space-y-2 text-center">
              <div className="flex space-x-2 justify-center">
                <Button size="sm" onClick={openInNewTab} className="bg-[#026892] hover:bg-[#026892]/90">
                  <ExternalLink className="w-4 h-4 mr-1" />
                  Open in New Tab
                </Button>
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={downloadPDF}
                    className="bg-[#026892] hover:bg-[#026892]/90 flex items-center"
                    >
                  <Download className="w-4 h-4 mr-1" />
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`${displayUrl}#toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&scrollbar=0&view=FitH&zoom=page-fit`}
            className="w-full min-h-[700px] border-0"
            title="Student Transcript PDF"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            style={{
              background: '#ffffff',
              display: 'block',
            }}
          />
        )}
      </div>
    </div>
  )
}