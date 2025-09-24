"use client"

import { useParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { ArrowLeft, Download, Loader2, AlertCircle, FileText, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranscript } from "@/hooks/transcripts/useTranscript"
import { useStudentEnrollments } from "@/hooks/transcripts/useAllGroups"
import { toast } from "sonner"
import PDFViewer from "@/components/PDFViewer"

export default function StudentTranscriptPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.studentId as string
  const classId = params.classId as string
  
  const [academicYearId, setAcademicYearId] = useState<string>("")
  const [studentInfo, setStudentInfo] = useState<any>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Get academic year from localStorage
  useEffect(() => {
    const storedAcademicYearId = typeof window !== "undefined" ? localStorage.getItem("selectedAcademicYearId") : ""
    if (storedAcademicYearId) {
      setAcademicYearId(storedAcademicYearId)
    }
    setIsInitialized(true)
  }, [])

  // Get student enrollments to find student info
  const { enrollments } = useStudentEnrollments({ groupId: classId })

  // Get specific student info
  useEffect(() => {
    if (enrollments.length > 0) {
      const student = enrollments.find(e => e.studentId === studentId)
      if (student) {
        setStudentInfo(student)
      }
    }
  }, [enrollments, studentId])

  // Use transcript hook
  const { 
    pdfData,
    pdfUrl, 
    isLoading, 
    error, 
    useIframe,
    downloadTranscript, 
    refetch 
  } = useTranscript({ 
    studentId: studentId || "", 
    academicYearId: academicYearId || ""
  })

  const handleDownload = async () => {
    if (!studentInfo) {
      toast.error("Student information not available");
      return;
    }
    
    try {
      setIsDownloading(true);
      await downloadTranscript(studentInfo.studentFullName || 'Student')
    } catch (error) {
      // Error handling is done in the hook
    } finally {
      setIsDownloading(false);
    }
  }

  const handleRefresh = async () => {
    try {
      await refetch();
    } catch (error) {
      toast.error("Failed to refresh transcript");
    }
  }

  const handleBack = () => {
    router.push(`/students/transcripts/${classId}`)
  }

  // Show loading state if not initialized
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-3 text-lg">Initializing...</span>
      </div>
    )
  }

  // Show error if academic year is not found after initialization
  if (isInitialized && !academicYearId) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Class
          </Button>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Academic Year ID is not set. Please select an academic year first.
          </AlertDescription>
        </Alert>
        
        <Button onClick={handleBack}>
          Go Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="space-y-2">
          <Button variant="outline" onClick={handleBack} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Class
          </Button>
          
          <div>
            {studentInfo ? (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {studentInfo.studentFullName || 'Student Transcript'}
                </h1>
                <p className="text-gray-600 text-sm">
                  {studentInfo.programName}
                </p>
              </div>
            ) : (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Student Transcript</h1>
                <p className="text-gray-600 text-sm">Loading student information...</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={handleRefresh}
            variant="outline"
            disabled={isLoading}
            className="flex items-center"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          
          <Button
            onClick={handleDownload}
            disabled={isLoading || isDownloading || (!pdfData && !pdfUrl)}
            className="bg-[#026892] hover:bg-[#026892]/90 flex items-center"
          >
            {isDownloading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isDownloading ? 'Downloading...' : 'Download PDF'}
          </Button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Student Info Card */}
      {studentInfo && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Student Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Full Name</p>
                <p className="text-sm text-gray-900">{studentInfo.studentFullName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Email</p>
                <p className="text-sm text-gray-900">{studentInfo.studentEmail || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Program</p>
                <p className="text-sm text-gray-900">{studentInfo.programName}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Current Year</p>
                <p className="text-sm text-gray-900">Year {studentInfo.currentYearLevel}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF Viewer */}
      <div>
        {useIframe ? (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Academic Transcript</h2>
            </div>
            <div className="border rounded-lg overflow-hidden">
              <iframe
                src={pdfUrl || ''}
                className="w-full min-h-[700px]"
                title="Student Transcript"
                style={{ border: 'none' }}
              />
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Academic Transcript</h2>
              <p className="text-sm text-gray-600 mt-1">
                Use the controls below to navigate through the transcript pages
              </p>
            </div>
            
            <PDFViewer
              pdfData={pdfData}
              pdfUrl={pdfUrl}
              isLoading={isLoading}
              error={error}
              className="min-h-[700px]"
            />
          </div>
        )}
      </div>
    </div>
  )
}
