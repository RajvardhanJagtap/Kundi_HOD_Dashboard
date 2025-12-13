"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useMarkSheet, type CellData } from "@/hooks/module-marks/useMarkSheet"
import { useExamSheet } from "@/hooks/module-marks/useExamSheet"
import { useSubmission } from "@/hooks/useSubmission"
import { saveAs } from "file-saver"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  ChevronRight,
  Search,
  Download,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  X,
  MessageSquare,
} from "lucide-react"
import { useModuleSubmissionDetails } from "@/hooks/modules/useModuleAssignments"

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const moduleId = searchParams.get("moduleId")
  const [activeTab, setActiveTab] = useState<"assessments" | "exams">("assessments")
  const [search, setSearch] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false)

  // Approval dialog state
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [approvalComments, setApprovalComments] = useState("")
  const [approvalNotes, setApprovalNotes] = useState("")

  // Track approval status based on API response action field
  const [catApproved, setCatApproved] = useState(false)
  const [examApproved, setExamApproved] = useState(false)
  const [overallApproved, setOverallApproved] = useState(false)
  const [marksApprovalStatus, setMarksApprovalStatus] = useState({
    cat: false,
    exam: false,
  })

  // Function to check if submission is approved based on nested submission status fields
  const isSubmissionApproved = (submissionData: any, submissionType: 'cat' | 'exam' | 'overall'): boolean => {
    if (!submissionData?.data) return false;
    
    const data = submissionData.data;
    
    // Check the appropriate nested submission status based on submission type
    if (submissionType === 'cat' && data.catSubmission) {
      return data.catSubmission.status === 'APPROVED';
    }
    
    if (submissionType === 'exam' && data.examSubmission) {
      return data.examSubmission.status === 'APPROVED';
    }
    
    if (submissionType === 'overall' && data.overallSubmission) {
      return data.overallSubmission.status === 'APPROVED';
    }
    
    return false;
  }

  // Submission hook
  const { isSubmitting, submissionData, error: submissionError, submit, clearSubmission } = useSubmission()

  // Module submission details hook
  const { fetchSubmissionDetails } = useModuleSubmissionDetails()

  const [downloading, setDownloading] = useState(false)

  // Toast hook
  const { toast } = useToast()

  // Handle overall marks approval
  const handleOverallApproval = async () => {
    if (!moduleId || !catApproved || !examApproved || overallApproved || isSubmitting) {
      return
    }

    try {
      await submit(moduleId, "overall", {
        comments: "Overall marks approved and ready for Dean review",
        forwardToNext: true,
        additionalNotes: "Module assessment completed successfully",
      })

      toast({
        title: "Success",
        description: "Overall marks approved successfully",
        duration: 3000,
      })

      setOverallApproved(true)
      setCatApproved(true)
      setExamApproved(true)
      setMarksApprovalStatus({ cat: true, exam: true })
      setSubmitted(true)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve overall marks",
        variant: "destructive",
        duration: 5000,
      })
    }
  }

  // Function to fetch current submission status
  const fetchCurrentSubmissionStatus = async () => {
    if (!moduleId) return;
    
    try {
      const submissionDetails = await fetchSubmissionDetails(moduleId);
      if (submissionDetails?.data) {
        // Check approval status based on action field from API response
        const isCatApproved = isSubmissionApproved(submissionDetails, 'cat');
        const isExamApproved = isSubmissionApproved(submissionDetails, 'exam');
        const isOverallApproved = isSubmissionApproved(submissionDetails, 'overall');

        setCatApproved(isCatApproved);
        setExamApproved(isExamApproved);
        setOverallApproved(isOverallApproved);
        setMarksApprovalStatus({ cat: isCatApproved, exam: isExamApproved });
        setSubmitted(isOverallApproved);
      }
    } catch (error) {
      console.error('Error fetching submission status:', error);
      // Keep current state if fetch fails
    }
  };

  // Fetch current submission status when component mounts
  useEffect(() => {
    fetchCurrentSubmissionStatus();
  }, [moduleId]);

  // Hooks for both tabs - Now using styledData with merge information
  const {
    marksheetData,
    styledData: marksheetStyledData,
    columnWidths: marksheetColumnWidths,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    excelBlob: assessmentsBlob,
    refetch: refetchAssessments,
  } = useMarkSheet(moduleId)

  const {
    examSheetData,
    styledData: examStyledData,
    columnWidths: examColumnWidths,
    isLoading: examsLoading,
    error: examsError,
    excelBlob: examsBlob,
    refetch: refetchExams,
  } = useExamSheet(moduleId)

  // Current tab data
  const currentData = activeTab === "assessments" ? marksheetData : examSheetData
  const currentStyledData = activeTab === "assessments" ? marksheetStyledData : examStyledData
  const currentColumnWidths = activeTab === "assessments" ? marksheetColumnWidths : examColumnWidths
  const currentLoading = activeTab === "assessments" ? assessmentsLoading : examsLoading
  const currentError = activeTab === "assessments" ? assessmentsError : examsError
  const currentBlob = activeTab === "assessments" ? assessmentsBlob : examsBlob
  const currentRefetch = activeTab === "assessments" ? refetchAssessments : refetchExams

  // Update approval status when new submission data is received
  useEffect(() => {
    if (!moduleId || !submissionData?.data) return

    // Check approval status based on action field from API response
    const isCatApproved = isSubmissionApproved(submissionData, 'cat')
    const isExamApproved = isSubmissionApproved(submissionData, 'exam')
    const isOverallApproved = isSubmissionApproved(submissionData, 'overall')

    setCatApproved(isCatApproved)
    setExamApproved(isExamApproved)
    setOverallApproved(isOverallApproved)
    setMarksApprovalStatus({ cat: isCatApproved, exam: isExamApproved })
    setSubmitted(isOverallApproved)
  }, [moduleId, submissionData])

  // Auto-hide submission message after 5 seconds
  useEffect(() => {
    if (showSubmissionMessage && (submissionData || submissionError)) {
      const timer = setTimeout(() => {
        setShowSubmissionMessage(false)
        if (!submissionData) {
          setSubmitted(false)
        }
        clearSubmission()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [showSubmissionMessage, submissionData, submissionError, clearSubmission])

  // Find the header row index that contains "Sl.No" or similar
  const findHeaderRowIndex = (data: CellData[][]) => {
    for (let i = 0; i < data.length; i++) {
      const firstCell = data[i][0]
      if (firstCell && firstCell.value) {
        const cellValue = String(firstCell.value).trim().toUpperCase()
        // Look for various header formats
        if (cellValue === "SL.NO" || cellValue.startsWith("SL.NO") || 
            cellValue === "SL NO" || cellValue.startsWith("SL NO") ||
            cellValue === "S.NO" || cellValue.startsWith("S.NO") ||
            cellValue === "S NO" || cellValue.startsWith("S NO") ||
            cellValue === "SERIAL" || cellValue.startsWith("SERIAL") ||
            cellValue === "SN" || cellValue.startsWith("SN")) {
          console.log(`Found header row at index ${i} in ${activeTab} sheet:`, cellValue)
          return i
        }
      }
    }
    console.log(`No header row found in ${activeTab} sheet`)
    return -1
  }

  // Find header row and starting column for both sheets
  const getHeaderInfo = (data: CellData[][]) => {
    const headerRowIndex = findHeaderRowIndex(data)
    let startCol = 0
    
    if (headerRowIndex >= 0 && data.length > headerRowIndex) {
      const headerRow = data[headerRowIndex]
      // Find the first non-empty cell in header row (should be "Sl.No")
      for (let i = 0; i < headerRow.length; i++) {
        if (headerRow[i] && headerRow[i].value !== null && headerRow[i].value !== undefined && String(headerRow[i].value).trim() !== "") {
          startCol = i
          break
        }
      }
    }
    
    return { headerRowIndex, startCol }
  }

  // Filter styled data based on search and hide rows above header
  const filteredStyledData = (() => {
    const { headerRowIndex, startCol } = getHeaderInfo(currentStyledData)
    let dataToShow = currentStyledData
    
    console.log(`${activeTab} sheet - Original data length: ${currentStyledData.length}, header row index: ${headerRowIndex}, start column: ${startCol}`)
    
    // Hide rows above header row if found
    if (headerRowIndex >= 0) {
      dataToShow = currentStyledData.slice(headerRowIndex)
      console.log(`${activeTab} sheet - After row filtering, data length: ${dataToShow.length}`)
    }
    
    // Filter columns to start from header column
    dataToShow = dataToShow.map(row => row.slice(startCol))
    console.log(`${activeTab} sheet - After column filtering, row length: ${dataToShow.length > 0 ? dataToShow[0].length : 0}`)
    
    // Apply search filter
    if (search.trim()) {
      dataToShow = dataToShow.filter((row) => {
        return row.some((cell) => {
          if (cell.value === null || cell.value === undefined) return false
          return String(cell.value).toLowerCase().includes(search.toLowerCase())
        })
      })
    }
    
    return dataToShow
  })()

  // Also filter column widths to match the filtered data
  const filteredColumnWidths = (() => {
    const { startCol } = getHeaderInfo(currentStyledData)
    return currentColumnWidths.slice(startCol)
  })()

  const handleDownloadMarksheet = async () => {
    if (!currentBlob || !moduleId) {
      alert("No marksheet available to download")
      return
    }
    setDownloading(true)
    try {
      const filePrefix = activeTab === "assessments" ? "marksheet" : "examsheet"
      const fileName = `${filePrefix}_module_${moduleId}_${new Date().toISOString().split("T")[0]}.xlsx`
      saveAs(currentBlob, fileName)
    } catch (err) {
      console.error("Download error:", err)
      alert("Error downloading file. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  const handleBackToModules = () => {
    window.location.href = "/academic/marks-submitted"
  }

  const handleApproveClick = () => {
    if (!moduleId || currentStyledData.length === 0) {
      alert("No data to approve")
      return
    }
    if (activeTab === "assessments") {
      setApprovalComments("CAT marks have been reviewed and approved")
      setApprovalNotes("Good performance overall")
    } else {
      setApprovalComments("EXAM marks verified and approved for processing")
      setApprovalNotes("Examination was conducted fairly")
    }
    setShowApprovalDialog(true)
  }

  const handleApprovalSubmit = async () => {
    if (!moduleId) return
    setShowApprovalDialog(false)
    setSubmitted(false)
    setShowSubmissionMessage(false)
    clearSubmission()
    const options = {
      comments: approvalComments.trim() || undefined,
      additionalNotes: approvalNotes.trim() || undefined,
    }
    await submit(moduleId, activeTab === "assessments" ? "cat" : "exam", options)
    setSubmitted(true)
    setShowSubmissionMessage(true)
  }

  const handleRefresh = () => {
    setSubmitted(false)
    setShowSubmissionMessage(false)
    clearSubmission()
    currentRefetch()
    fetchCurrentSubmissionStatus() // Also fetch current approval status
  }

  const handleTabSwitch = (tab: "assessments" | "exams") => {
    setActiveTab(tab)
    setSearch("")
    setSubmitted(false)
    setShowSubmissionMessage(false)
    clearSubmission()
  }

  const dismissSubmissionMessage = () => {
    setShowSubmissionMessage(false)
    if (!submissionData) {
      setSubmitted(false)
    }
    clearSubmission()
  }

  const formatCellValue = (cell: CellData): string => {
    if (cell.value === null || cell.value === undefined || cell.value === "") {
      return ""
    }
    if (typeof cell.value === "object") {
      if ((cell.value as any).richText) {
        return (cell.value as any).richText.map((rt: any) => rt.text || "").join("")
      }
      if ((cell.value as any).text) {
        return (cell.value as any).text
      }
      if ((cell.value as any).result !== undefined) {
        return String((cell.value as any).result)
      }
    }
    return String(cell.value)
  }

  const TabButton = ({
    tabKey,
    label,
    isActive,
    onClick,
  }: {
    tabKey: string
    label: string
    isActive: boolean
    onClick: () => void
  }) => (
    <button
      onClick={onClick}
      className={`px-6 py-3 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
        isActive
          ? "text-[#026892] border-[#026892] bg-blue-50"
          : "text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Module Marksheet</h1>
          <p className="text-gray-600 mt-2">View and manage student marks for this module.</p>
        </div>

        <div className="space-y-6">
          {/* Header Navigation */}
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToModules}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Back to Modules
              </Button>
            </div>
            <Button
              onClick={handleOverallApproval}
              disabled={!moduleId || !catApproved || !examApproved || overallApproved || isSubmitting}
              className="bg-[#026892] hover:bg-[#026892]/90 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Confirming...
                </>
              ) : overallApproved ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Confirmed
                </>
              ) : (
                "Confirm Overall Approval"
              )}
            </Button>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              <TabButton
                tabKey="assessments"
                label="CATs"
                isActive={activeTab === "assessments"}
                onClick={() => handleTabSwitch("assessments")}
              />
              <TabButton
                tabKey="exams"
                label="Exams"
                isActive={activeTab === "exams"}
                onClick={() => handleTabSwitch("exams")}
              />
            </nav>
          </div>

          {/* Controls Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={`Search in ${activeTab}...`}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    disabled={currentLoading}
                    className="min-w-[100px] bg-transparent"
                  >
                    <RefreshCw className={`h-4 w-4 mr-2 ${currentLoading ? "animate-spin" : ""}`} />
                    {currentLoading ? "Loading..." : "Refresh"}
                  </Button>
                  <Button
                    className="bg-[#026892] hover:bg-[#026892]/90 text-white min-w-[140px]"
                    onClick={handleDownloadMarksheet}
                    disabled={downloading || !currentBlob}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {downloading ? "Downloading..." : "Download Excel"}
                  </Button>
                  <Button
                    className={`text-white min-w-[140px] ${
                      (activeTab === "assessments" && (marksApprovalStatus.cat || overallApproved)) ||
                      (activeTab === "exams" && (marksApprovalStatus.exam || overallApproved))
                        ? "bg-[#026892]"
                        : "bg-[#026892] hover:bg-[#026892]/90"
                    }`}
                    onClick={handleApproveClick}
                    disabled={
                      isSubmitting ||
                      currentLoading ||
                      currentStyledData.length === 0 ||
                      overallApproved ||
                      (activeTab === "assessments" && marksApprovalStatus.cat) ||
                      (activeTab === "exams" && marksApprovalStatus.exam)
                    }
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (activeTab === "assessments" && (marksApprovalStatus.cat || overallApproved)) ||
                      (activeTab === "exams" && (marksApprovalStatus.exam || overallApproved)) ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting
                      ? "Approving..."
                      : (activeTab === "assessments" && marksApprovalStatus.cat) ||
                          (activeTab === "exams" && marksApprovalStatus.exam)
                        ? "Approved"
                        : "Approve Submission"}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              {currentStyledData.length > 0 && (
                <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600 border-t pt-4">
                  {search && filteredStyledData.length !== currentStyledData.length && (
                    <div>
                      <span>
                        <strong>{filteredStyledData.length}</strong> filtered results
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval Dialog */}
          <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Approve {activeTab === "assessments" ? "CAT" : "Exam"} Marks</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="comments">Approval Comments</Label>
                  <Textarea
                    id="comments"
                    placeholder="Enter your approval comments..."
                    value={approvalComments}
                    onChange={(e) => setApprovalComments(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes or observations..."
                    value={approvalNotes}
                    onChange={(e) => setApprovalNotes(e.target.value)}
                    className="min-h-[80px]"
                  />
                </div>
                <div className="text-sm text-gray-600">
                  <p>
                    This will approve the {activeTab === "assessments" ? "CAT" : "exam"} marks for forwarding to the
                    next approval level.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowApprovalDialog(false)} disabled={isSubmitting}>
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalSubmit}
                  disabled={isSubmitting || !approvalComments.trim()}
                  className="bg-[#026892] hover:bg-[#026892]/90"
                >
                  {isSubmitting ? <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> : null}
                  {isSubmitting ? "Approving..." : "Submit Approval"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Submission Success/Error Message */}
          {showSubmissionMessage && (submissionData || submissionError) && (
            <div className="relative">
              {submissionData ? (
                <div className="flex items-center justify-between gap-3 text-green-800 bg-green-50 border border-green-200 rounded-lg px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">
                      {submissionData.message || "Approval successful! The marks have been approved."}
                    </span>
                  </div>
                  <button onClick={dismissSubmissionMessage} className="text-green-600 hover:text-green-800 p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : submissionError ? (
                <div className="flex items-center justify-between gap-3 text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium">{submissionError}</span>
                  </div>
                  <button onClick={dismissSubmissionMessage} className="text-red-600 hover:text-red-800 p-1">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Main Content - Excel Display with Proper Merge Support */}
          <Card>
            <CardContent className="p-0">
              {currentLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#026892] mb-4"></div>
                  <div className="text-gray-600 text-lg">Loading {activeTab}...</div>
                  <div className="text-gray-400 text-sm mt-2">Fetching Excel file from database</div>
                </div>
              ) : currentError ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <div className="text-red-600 text-lg mb-2">
                    Failed to Load {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </div>
                  <div className="text-gray-600 text-center mb-6 max-w-md">{currentError}</div>
                  <Button onClick={handleRefresh} variant="outline" className="min-w-[120px] bg-transparent">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : currentStyledData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-gray-600 text-lg mb-2">
                    No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Data
                  </div>
                  <div className="text-gray-400 text-center">
                    No {activeTab} data found for this module or the Excel file is empty.
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white">
                  <div className="w-full overflow-x-auto">
                    <table 
                      className="w-full text-xs border-collapse" 
                      style={{ 
                        tableLayout: "fixed",
                        minWidth: filteredColumnWidths.reduce((sum, w) => sum + w, 0) + "px"
                      }}
                    >
                      <colgroup>
                        {filteredColumnWidths.map((width, index) => (
                          <col key={index} style={{ width: `${width}px` }} />
                        ))}
                      </colgroup>
                      <tbody>
                        {filteredStyledData.map((row, rowIndex) => {
                          // Debug for first few rows
                          if (rowIndex < 2) {
                            console.log(`${activeTab} sheet - Row ${rowIndex}, cells: ${row.length}`)
                          }
                          
                          return (
                            <tr key={`row-${rowIndex}`}>
                              {row.map((cell, cellIndex) => {
                              if (cell.isMergedChild) {
                                return null
                              }

                              const cellValue = formatCellValue(cell)
                              const isEmpty = cellValue === ""
                              const cellLower = cellValue.toLowerCase()

                              // Check for FAIL/PASS cells
                              const isFailCell =
                                cellLower === "fail" || cellLower === "repeat" || cellLower === "retake"
                              const isPassCell = cellLower === "pass"

                              // Build inline styles from cell styling
                              const cellStyle: React.CSSProperties = {
                                fontSize: "11px",
                                padding: "2px 4px",
                                textAlign: (cell.styling.textAlign as any) || "center",
                                fontWeight: cell.styling.fontWeight || "normal",
                                fontStyle: cell.styling.fontStyle || "normal",
                                backgroundColor: cell.styling.backgroundColor || (isEmpty ? "#fff" : undefined),
                                color: cell.styling.color || undefined,
                                border: "1px solid #d1d5db",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                height: "20px",
                                lineHeight: "20px",
                              }

                              // Apply special styling for PASS/FAIL
                              if (isFailCell) {
                                cellStyle.backgroundColor = "#fee2e2"
                                cellStyle.color = "#b91c1c"
                                cellStyle.fontWeight = "bold"
                              } else if (isPassCell) {
                                cellStyle.backgroundColor = "#dcfce7"
                                cellStyle.color = "#166534"
                                cellStyle.fontWeight = "600"
                              }

                              return (
                                <td
                                  key={`cell-${rowIndex}-${cellIndex}`}
                                  rowSpan={cell.rowSpan && cell.rowSpan > 1 ? cell.rowSpan : undefined}
                                  colSpan={cell.colSpan && cell.colSpan > 1 ? cell.colSpan : undefined}
                                  style={cellStyle}
                                  title={cell.styling.comment || undefined}
                                >
                                  {cellValue}
                                </td>
                              )
                            })}
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
