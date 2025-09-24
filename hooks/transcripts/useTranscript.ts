import { useState, useEffect } from "react";
import { transcriptApi } from "@/lib/transcripts/transcript-api";
import { toast } from "sonner";

interface UseTranscriptReturn {
  pdfData: ArrayBuffer | null;
  pdfUrl: string | null;
  isLoading: boolean;
  error: string | null;
  useIframe: boolean;
  downloadTranscript: (studentName: string) => Promise<void>;
  refetch: () => Promise<void>;
}

interface UseTranscriptParams {
  studentId: string;
  academicYearId: string;
}

export const useTranscript = ({ studentId, academicYearId }: UseTranscriptParams): UseTranscriptReturn => {
  const [pdfData, setPdfData] = useState<ArrayBuffer | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useIframe, setUseIframe] = useState(false);

  const fetchTranscript = async () => {
    if (!studentId?.trim() || !academicYearId?.trim()) {
      setError("Student ID and Academic Year ID are required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      setPdfData(null);
      setPdfUrl(null);
      setUseIframe(false);

      // First, try the direct blob approach
      try {
        const result = await transcriptApi.getStudentTranscriptPdf(studentId, academicYearId);
        
        if (result instanceof Blob) {
          // Verify it's a valid PDF
          const arrayBuffer = await result.arrayBuffer();
          const isValidPdf = transcriptApi.validatePdfData(arrayBuffer);
          
          if (isValidPdf) {
            setPdfData(arrayBuffer);
            const blobUrl = window.URL.createObjectURL(result);
            setPdfUrl(blobUrl);
            setUseIframe(false);
            toast.success("Transcript loaded successfully");
            return;
          } else {
            console.warn("Invalid PDF data received, falling back to iframe");
          }
        }
      } catch (blobError: any) {
        console.warn("Blob fetch failed, trying iframe fallback:", blobError);
        
        // Check if it's a CORS or network error
        if (
          blobError.code === 'ERR_NETWORK' || 
          blobError.message?.includes('CORS') ||
          blobError.message?.includes('ERR_RESPONSE_HEADERS') ||
          blobError.response?.status === 0
        ) {
          console.log("Network/CORS issue detected, using iframe mode");
        }
      }

      // Fallback to iframe mode
      const iframeUrl = transcriptApi.getStudentTranscriptUrl(studentId, academicYearId);
      setPdfUrl(iframeUrl);
      setUseIframe(true);
      toast.success("Transcript loaded successfully (iframe mode)");
      
    } catch (err: any) {
      console.error("Error fetching transcript:", err);
      
      let errorMessage = err.message || "Failed to fetch transcript";
      
      // User-friendly error messages
      if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
        errorMessage = "Your session has expired. Please log in again.";
      } else if (errorMessage.includes('not found') || errorMessage.includes('404')) {
        errorMessage = "Transcript not found for this student and academic year.";
      } else if (errorMessage.includes('Access denied') || errorMessage.includes('403')) {
        errorMessage = "You don't have permission to view this transcript.";
      } else if (
        errorMessage.includes('Network') || 
        errorMessage.includes('CORS') ||
        errorMessage.includes('ERR_RESPONSE_HEADERS') ||
        err.code === 'ERR_NETWORK'
      ) {
        // For network/CORS errors, still try iframe as last resort
        console.log("Trying iframe as final fallback for network error");
        try {
          const iframeUrl = transcriptApi.getStudentTranscriptUrl(studentId, academicYearId);
          setPdfUrl(iframeUrl);
          setUseIframe(true);
          setError(null);
          toast.success("Transcript loaded (fallback mode)");
          return;
        } catch (iframeError) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        }
      }
      
      setError(errorMessage);
      setPdfData(null);
      setPdfUrl(null);
      setUseIframe(false);
      
      // Don't show toast for auth errors
      if (!errorMessage.includes('session') && !errorMessage.includes('Authentication')) {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const downloadTranscript = async (studentName: string) => {
    try {
      setError(null);
      
      if (!studentName?.trim()) {
        throw new Error("Student name is required for download");
      }
      
      if (!studentId?.trim() || !academicYearId?.trim()) {
        throw new Error("Student ID and Academic Year ID are required");
      }
      
      await transcriptApi.downloadStudentTranscriptPdf(studentId, academicYearId, studentName);
      toast.success("Transcript downloaded successfully");
    } catch (err: any) {
      console.error("Error downloading transcript:", err);
      
      let errorMessage = err.message || "Failed to download transcript";
      
      if (errorMessage.includes('Authentication') || errorMessage.includes('401')) {
        errorMessage = "Your session has expired. Please log in again to download.";
      } else if (
        errorMessage.includes('Network') || 
        errorMessage.includes('CORS') ||
        err.code === 'ERR_NETWORK'
      ) {
        errorMessage = "Network error. Please try downloading again or contact support.";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    }
  };

  const refetch = async () => {
    await fetchTranscript();
  };

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (pdfUrl && !useIframe && pdfUrl.startsWith('blob:')) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl, useIframe]);

  useEffect(() => {
    if (studentId?.trim() && academicYearId?.trim()) {
      fetchTranscript();
    } else {
      setIsLoading(false);
      if (!studentId?.trim()) {
        setError("Student ID is required");
      } else if (!academicYearId?.trim()) {
        setError("Academic Year ID is required");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, academicYearId]);

  return {
    pdfData,
    pdfUrl,
    isLoading,
    error,
    useIframe,
    downloadTranscript,
    refetch,
  };
};