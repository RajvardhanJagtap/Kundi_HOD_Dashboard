"use client";

import { useState, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  pdfData: ArrayBuffer | null;
  pdfUrl: string | null;
  isLoading?: boolean;
  error?: string | null;
  className?: string;
}

export default function PDFViewer({ pdfData, pdfUrl, isLoading, error, className }: PDFViewerProps) {
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [rotation, setRotation] = useState<number>(0);
  const [isDocumentLoading, setIsDocumentLoading] = useState<boolean>(true);
  const [documentError, setDocumentError] = useState<string | null>(null);

  const onDocumentLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsDocumentLoading(false);
    setDocumentError(null);
  }, []);

  const onDocumentLoadError = useCallback((error: Error) => {
    console.error('PDF loading error:', error);
    setDocumentError('Failed to load PDF document');
    setIsDocumentLoading(false);
  }, []);

  const goToPrevPage = () => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
    }
  };

  const goToNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const rotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  // Show loading state
  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-32">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mb-4" />
          <span className="text-lg">Loading transcript...</span>
          <span className="text-sm text-gray-500 mt-2">This may take a few moments</span>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error || documentError) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error || documentError}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Show empty state
  if (!pdfData && !pdfUrl) {
    return (
      <Card className={className}>
        <CardContent className="flex flex-col items-center justify-center py-32 text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 mb-2">No transcript available</p>
          <p className="text-sm text-gray-500">
            The transcript could not be loaded. Please try refreshing or contact support.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-0">
        {/* PDF Viewer Controls */}
        <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPrevPage}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium px-3">
              Page {pageNumber} of {numPages}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={pageNumber >= numPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={zoomOut}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            
            <span className="text-sm font-medium px-2 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={zoomIn}
              disabled={scale >= 3.0}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={rotate}
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* PDF Document Display */}
        <div className="flex justify-center bg-gray-100 min-h-[600px] p-4 overflow-auto">
          <div className="shadow-lg">
            <Document
              file={pdfData || pdfUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={
                <div className="flex flex-col items-center justify-center py-32">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                  <span>Loading PDF document...</span>
                </div>
              }
              error={
                <div className="flex flex-col items-center justify-center py-32 text-center">
                  <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                  <p className="text-lg text-red-600 mb-2">Failed to load PDF</p>
                  <p className="text-sm text-gray-500">
                    The PDF document could not be displayed. Please try downloading instead.
                  </p>
                </div>
              }
            >
              <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                loading={
                  <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                  </div>
                }
                error={
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <AlertCircle className="w-8 h-8 text-red-500 mb-2" />
                    <p className="text-red-600">Failed to load page {pageNumber}</p>
                  </div>
                }
              />
            </Document>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}