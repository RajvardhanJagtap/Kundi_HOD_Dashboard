// src/app/students/transcripts/[classId]/[studentId]/page.tsx
"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import {
  ArrowLeft,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranscript } from "@/hooks/transcripts/useTranscript";
import { useStudentEnrollments } from "@/hooks/transcripts/useAllGroups";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// Use SimplePDFViewer - matches your actual component file name
const SimplePDFViewer = dynamic(
  () => import("@/components/DirectEmbedPDFViewer"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[400px] border rounded-lg bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#026892]" />
          <span className="text-sm text-gray-600">Loading PDF Viewer...</span>
        </div>
      </div>
    ),
  }
);

export default function StudentTranscriptPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const classId = params.classId as string;

  // read search params at top-level (hooks must be called unconditionally)
  const searchParams = useSearchParams();

  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [semesterId, setSemesterId] = useState<string>("");
  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Get academic year and semester from localStorage
  useEffect(() => {
    const paramYear =
      searchParams?.get?.("yearId") || searchParams?.get?.("academicYearId");
    const paramSemester = searchParams?.get?.("semesterId");

    // Helper to safely read storage with fallbacks
    const readStorage = (key: string) => {
      try {
        if (typeof window === "undefined") return "";
        const v = localStorage.getItem(key);
        if (v) return v;
        const s = sessionStorage.getItem(key);
        if (s) return s;
        return "";
      } catch (e) {
        return "";
      }
    };

    // Preference order: query param -> selectedAcademicYearId -> selectedAcademicYear -> sessionStorage
    const storedAcademicYearId =
      paramYear ||
      readStorage("selectedAcademicYearId") ||
      readStorage("selectedAcademicYear");
    if (storedAcademicYearId && storedAcademicYearId.trim().length > 0) {
      setAcademicYearId(storedAcademicYearId.trim());
    }

    // Get semester ID
    const storedSemesterId =
      paramSemester ||
      readStorage("selectedSemesterId") ||
      readStorage("selectedSemester");
    if (storedSemesterId && storedSemesterId.trim().length > 0) {
      setSemesterId(storedSemesterId.trim());
    }

    // Student page initialized

    setIsInitialized(true);
  }, [searchParams, classId, studentId]);

  // Get student enrollments to find student info
  const { enrollments, isLoading: enrollmentsLoading, error: enrollmentsError } = useStudentEnrollments({ 
    groupId: classId, 
    semesterId: semesterId 
  });

  // Get specific student info
  useEffect(() => {
    if (enrollments.length > 0) {
      const student = enrollments.find((e) => e.studentId === studentId);
      if (student) {
        setStudentInfo(student);
      }
    }
  }, [enrollments, studentId]);

  // Use transcript hook
  const {
    pdfData,
    pdfUrl,
    isLoading,
    error,
    useIframe,
    downloadTranscript,
    refetch,
  } = useTranscript({
    studentId: studentId || "",
    academicYearId: academicYearId || "",
  });

  const handleDownload = async () => {
    if (!studentInfo) {
      toast.error("Student information not available");
      return;
    }

    if (!academicYearId) {
      toast.error("Academic Year ID not available");
      return;
    }

    try {
      setIsDownloading(true);
      // Starting download
      
      await downloadTranscript(studentInfo.studentFullName || "Student");
      // Download completed successfully
    } catch (error: any) {
      
      // Try fallback method - open in new tab
      try {
        // Attempting fallback download method
        const fallbackUrl = `/api/proxy/grading/progressive-reports/student/${studentId}/academic-year/${academicYearId}/pdf`;
        
        // Create a temporary link with fallback
        const fallbackLink = document.createElement('a');
        fallbackLink.href = fallbackUrl;
        fallbackLink.target = '_blank';
        fallbackLink.download = `${studentInfo.studentFullName || 'Student'}_Transcript_${new Date().toISOString().split('T')[0]}.pdf`;
        
        document.body.appendChild(fallbackLink);
        fallbackLink.click();
        document.body.removeChild(fallbackLink);
        
        toast.success("Transcript opened in new tab. You can save it from there.");
      } catch (fallbackError) {
        console.error('Fallback method also failed:', fallbackError);
        toast.error("Download failed. Please try refreshing the page and downloading again.");
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      toast.error("Failed to refresh transcript");
    }
  };

  const handleBack = () => {
    router.push(`/students/transcripts/${classId}`);
  };

  // Show loading state if not initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#026892]" />
        <span className="ml-3 text-lg">Initializing...</span>
      </div>
    );
  }

  // Show error if academic year or semester is not found after initialization
  if (isInitialized && (!academicYearId || !semesterId)) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Class
          </Button>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {!academicYearId && !semesterId 
              ? "Academic Year ID and Semester ID are not set. Please select an academic year and semester first."
              : !academicYearId 
              ? "Academic Year ID is not set. Please select an academic year first."
              : "Semester ID is not set. Please select a semester first."
            }
          </AlertDescription>
        </Alert>

        <Button onClick={handleBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-3">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex items-center border-none hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Class
          </Button>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>

          <Button
            onClick={handleDownload}
            disabled={isLoading || isDownloading || !studentInfo || !academicYearId || (!pdfData && !pdfUrl)}
            className="bg-[#026892] hover:bg-[#026892]/90 flex items-center"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? "Downloading..." : "Download PDF"}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Enrollment Error Display */}
      {enrollmentsError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load student enrollments: {enrollmentsError}
          </AlertDescription>
        </Alert>
      )}

      {/* PDF Viewer Section */}
      <div>
        <div className="mb-4">
          <h2 className="text-3xl font-bold text-gray-900">
            Academic Transcript
          </h2>
          <p className="text-lg text-gray-600 mt-1">
            {isLoading
              ? "Loading transcript..."
              : "View and download your transcript"}
          </p>
        </div>

        {/* Use SimplePDFViewer with the working blob URL approach */}
        <SimplePDFViewer
          pdfData={pdfData}
          pdfUrl={pdfUrl}
          isLoading={isLoading}
          error={error}
          className="min-h-[700px]"
          studentName={studentInfo?.studentFullName}
        />
      </div>
    </div>
  );
}
