"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMarkSheet } from "@/hooks/module-marks/useMarkSheet";
import { useExamSheet } from "@/hooks/module-marks/useExamSheet";
import { useSubmission } from "@/hooks/useSubmission";

import { saveAs } from "file-saver";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
} from "lucide-react";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const moduleId = searchParams.get("moduleId");
  const [activeTab, setActiveTab] = useState<"assessments" | "exams">(
    "assessments"
  );
  const [search, setSearch] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [showSubmissionMessage, setShowSubmissionMessage] = useState(false);

  // Approval dialog state
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalComments, setApprovalComments] = useState("");
  const [approvalNotes, setApprovalNotes] = useState("");

  // Track approval status
  const [catApproved, setCatApproved] = useState(false);
  const [examApproved, setExamApproved] = useState(false);
  const [overallApproved, setOverallApproved] = useState(false);
  const [marksApprovalStatus, setMarksApprovalStatus] = useState({
    cat: false,
    exam: false,
  });

  // Submission hook
  const {
    isSubmitting,
    submissionData,
    error: submissionError,
    submit,
    clearSubmission,
  } = useSubmission();
  const [downloading, setDownloading] = useState(false);

  // Handle overall marks approval
  const handleOverallApproval = async () => {
    // Check if we can approve overall marks
    if (!moduleId || !catApproved || !examApproved || overallApproved || isSubmitting) {
      console.log('Cannot approve overall marks:', {
        moduleId,
        catApproved,
        examApproved,
        overallApproved,
        isSubmitting
      });
      return;
    }

    try {
      await submit(moduleId, "overall", {
        comments: "Overall marks approved and ready for Dean review",
        forwardToNext: true,
        additionalNotes: "Module assessment completed successfully",
      });

      toast({
        title: "Success",
        description: "Overall marks approved successfully",
        duration: 3000,
      });

      // Update approval states after successful submission
      setOverallApproved(true);
      setCatApproved(true);
      setExamApproved(true);
      setMarksApprovalStatus({
        cat: true,
        exam: true
      });
      setSubmitted(true);
      
      // Don't trigger a data refresh as it might reset our states
      // Instead, let's just update the UI state
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve overall marks",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  // Toast hook
  const { toast } = useToast();

  // Initialize approval status from stored data
  useEffect(() => {
    if (!moduleId) return;
    
    // Get stored approval status
    const storedStatus = localStorage.getItem(`approvalStatus-${moduleId}`);
    if (storedStatus) {
      const status = JSON.parse(storedStatus);
      setCatApproved(status.cat);
      setExamApproved(status.exam);
      setOverallApproved(status.overall);
      setMarksApprovalStatus({
        cat: status.cat,
        exam: status.exam
      });
      setSubmitted(status.overall);
    }
  }, [moduleId]);

  // Hooks for both tabs
  const {
    marksheetData,
    isLoading: assessmentsLoading,
    error: assessmentsError,
    excelBlob: assessmentsBlob,
    refetch: refetchAssessments,
  } = useMarkSheet(moduleId);
  const {
    examSheetData,
    isLoading: examsLoading,
    error: examsError,
    excelBlob: examsBlob,
    refetch: refetchExams,
  } = useExamSheet(moduleId);

  // Current tab data
  const currentData =
    activeTab === "assessments" ? marksheetData : examSheetData;
  const currentLoading =
    activeTab === "assessments" ? assessmentsLoading : examsLoading;
  const currentError =
    activeTab === "assessments" ? assessmentsError : examsError;
  const currentBlob = activeTab === "assessments" ? assessmentsBlob : examsBlob;
  const currentRefetch =
    activeTab === "assessments" ? refetchAssessments : refetchExams;

  // Update approval status from submission data
  useEffect(() => {
    if (!moduleId || !submissionData?.data) return;
    
    const { catSubmission, examSubmission, overallSubmission } = submissionData.data;
    
    // Log current submission state
    console.log('Current submission state:', {
      cat: catSubmission?.status,
      exam: examSubmission?.status,
      overall: overallSubmission?.status,
      canApproveOverall: 
        catSubmission?.status === "APPROVED" && 
        examSubmission?.status === "APPROVED" &&
        overallSubmission?.status !== "APPROVED"
    });
    
    // Update CAT status
    if (catSubmission) {
      const isCatApproved = catSubmission.status === "APPROVED";
      setCatApproved(isCatApproved);
      setMarksApprovalStatus((prev) => ({ ...prev, cat: isCatApproved }));
    }
    
    // Update Exam status
    if (examSubmission) {
      const isExamApproved = examSubmission.status === "APPROVED";
      setExamApproved(isExamApproved);
      setMarksApprovalStatus((prev) => ({ ...prev, exam: isExamApproved }));
    }
    
    // Update Overall status
    if (overallSubmission) {
      const isOverallApproved = overallSubmission.status === "APPROVED";
      setOverallApproved(isOverallApproved);
      setSubmitted(isOverallApproved);
    }
    
    // Check if both CAT and Exam are approved but overall is not
    if (catSubmission?.status === "APPROVED" && 
        examSubmission?.status === "APPROVED" && 
        overallSubmission?.status !== "APPROVED") {
      console.log('Both CAT and Exam approved, enabling overall approval button');
    }
    
    // Store the latest status
    localStorage.setItem(`approvalStatus-${moduleId}`, JSON.stringify({
      cat: catSubmission?.status === "APPROVED",
      exam: examSubmission?.status === "APPROVED",
      overall: overallSubmission?.status === "APPROVED"
    }));
  }, [moduleId, submissionData]);

  // Handle submission data changes and persist state
  useEffect(() => {
    if (!moduleId) return;
    
    if (submissionData) {
      let newStatus;
      
      if (activeTab === "assessments") {
        newStatus = {
          cat: true,
          exam: marksApprovalStatus.exam,
          overall: overallApproved
        };
        setCatApproved(true);
        setMarksApprovalStatus((prev) => ({ ...prev, cat: true }));
      } else {
        newStatus = {
          cat: marksApprovalStatus.cat,
          exam: true,
          overall: overallApproved
        };
        setExamApproved(true);
        setMarksApprovalStatus((prev) => ({ ...prev, exam: true }));
      }
      
      // Store approval status
      localStorage.setItem(`approvalStatus-${moduleId}`, JSON.stringify(newStatus));
    }
  }, [submissionData, activeTab, moduleId, marksApprovalStatus, overallApproved]);

  // Auto-hide submission message after 5 seconds
  useEffect(() => {
    if (showSubmissionMessage && (submissionData || submissionError)) {
      const timer = setTimeout(() => {
        setShowSubmissionMessage(false);
        if (submissionData) {
          // Don't clear the submitted state on success - keep button as "Approved"
        } else {
          setSubmitted(false);
        }
        clearSubmission();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [showSubmissionMessage, submissionData, submissionError, clearSubmission]);

  // Find the column header row index (first row that looks like column headers)
  const findHeaderRowIndex = (data: any[][]): number => {
    // Keywords that indicate module info rows (to skip)
    const moduleInfoKeywords = [
      'college', 'school', 'department', 'module code', 'module title',
      'academic year', 'program', 'year level', 'semester'
    ];
    
    // Keywords that indicate column headers (what we want to keep)
    const headerKeywords = [
      'sn', 'sl.no', 'sl no', 'reg. number', 'reg number', 'candidate reg',
      'gender', 'final assessment', 'test', 'assignment', 'attendance',
      'total marks', 'remark', 'grade', 'question', 'marks'
    ];
    
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const rowText = row.map(c => String(c || '').toLowerCase()).join(' ');
      
      // Check if this row contains header keywords
      const hasHeaderKeywords = headerKeywords.some(keyword => 
        rowText.includes(keyword)
      );
      
      // Check if this row contains module info keywords
      const hasModuleInfoKeywords = moduleInfoKeywords.some(keyword => 
        rowText.includes(keyword)
      );
      
      // If it has header keywords but not module info keywords, it's likely the header row
      if (hasHeaderKeywords && !hasModuleInfoKeywords) {
        return i;
      }
    }
    
    // Fallback: return 0 if no header row found
    return 0;
  };

  // Filter out module info rows (everything before the column header row)
  const getDisplayData = (data: any[][]): any[][] => {
    if (data.length === 0) return data;
    
    const headerRowIndex = findHeaderRowIndex(data);
    // Return from header row onwards (including the header row)
    return data.slice(headerRowIndex);
  };

  // Get display data without module info rows
  const displayData = getDisplayData(currentData);

  // Extract maximum marks for each column from header rows
  const getColumnMaxMarks = (data: any[][]): number[] => {
    const maxMarks: number[] = [];
    if (data.length === 0) return maxMarks;

    // Check first 3 rows for header information (might have multi-level headers)
    for (let rowIdx = 0; rowIdx < Math.min(3, data.length); rowIdx++) {
      const row = data[rowIdx];
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cellValue = String(row[colIdx] || '');
        
        // Look for patterns like "/20.00", "/30.00", "/50", etc.
        const maxMatch = cellValue.match(/\/(\d+\.?\d*)/);
        if (maxMatch) {
          const maxValue = parseFloat(maxMatch[1]);
          if (!isNaN(maxValue) && maxValue > 0) {
            // Store the maximum for this column (keep the first found)
            if (!maxMarks[colIdx] || maxMarks[colIdx] === 0) {
              maxMarks[colIdx] = maxValue;
            }
          }
        }
      }
    }
    
    return maxMarks;
  };

  // Get column max marks
  const columnMaxMarks = getColumnMaxMarks(displayData);

  // Calculate colspans for header cells to match Excel structure
  const calculateColspans = (data: any[][], activeTab: string): number[][] => {
    const colspans: number[][] = data.map(() => []);
    
    if (data.length === 0) return colspans;
    
    // Initialize all colspans to 1
    for (let rowIdx = 0; rowIdx < data.length; rowIdx++) {
      for (let colIdx = 0; colIdx < (data[rowIdx]?.length || 0); colIdx++) {
        colspans[rowIdx][colIdx] = 1;
      }
    }
    
    // Process header rows (first 3 rows typically contain headers)
    for (let rowIdx = 0; rowIdx < Math.min(3, data.length); rowIdx++) {
      const row = data[rowIdx];
      if (!row || row.length === 0) continue;
      
      const rowText = row.map(c => String(c || '').toLowerCase()).join(' ');
      
      // Check if this is a header row
      const hasHeaderKeywords = rowText.includes('final assessment') ||
        rowText.includes('test') || rowText.includes('assignment') ||
        rowText.includes('examinati') || rowText.includes('total exam') ||
        rowText.includes('cat mark') || rowText.includes('final mark');
      
      if (!hasHeaderKeywords) continue;
      
      for (let colIdx = 0; colIdx < row.length; colIdx++) {
        const cellValue = String(row[colIdx] || '').trim();
        const cellLower = cellValue.toLowerCase();
        
        if (cellValue === '') {
          colspans[rowIdx][colIdx] = 0; // Skip empty cells
          continue;
        }
        
        // CATs tab spanning logic
        if (activeTab === "assessments") {
          // Row 0: "FINAL ASSESSMENT" spans across Test and Assignment sections
          if (rowIdx === 0 && cellLower.includes("final assessment")) {
            let spanCount = 1;
            // Count empty cells after this header (merged cells appear as empty)
            // Also count until we hit end markers
            for (let i = colIdx + 1; i < row.length; i++) {
              const nextCell = String(row[i] || '').trim();
              const nextCellLower = nextCell.toLowerCase();
              
              // Stop at end markers
              if (nextCellLower.includes("class attendance") || 
                  nextCellLower.includes("total marks") || 
                  nextCellLower.includes("remark") ||
                  (nextCellLower.includes("sn") && !nextCellLower.includes("number"))) {
                break;
              }
              
              // If cell is empty, it's likely part of the merge
              // If cell has content, check if it's part of Final Assessment section
              if (nextCell === '') {
                spanCount++;
              } else if (nextCellLower.includes("test") || 
                        nextCellLower.includes("assignment") ||
                        nextCellLower.includes("final assessment")) {
                spanCount++;
              } else {
                // Check next row to see if this column belongs to Final Assessment
                if (rowIdx + 1 < data.length) {
                  const nextRowCell = String(data[rowIdx + 1][i] || '').toLowerCase();
                  if (nextRowCell.includes("test") || 
                      nextRowCell.includes("assignment") ||
                      nextRowCell.includes("cat") ||
                      nextRowCell.includes("a1") ||
                      nextRowCell.includes("average")) {
                    spanCount++;
                  } else {
                    break;
                  }
                } else {
                  spanCount++;
                }
              }
            }
            colspans[rowIdx][colIdx] = spanCount;
          }
          // Row 1: "Test" and "Assignment" span across their sub-columns
          else if (rowIdx === 1 && (cellLower === "test" || cellLower === "assignment")) {
            let spanCount = 1;
            // Count empty cells and check next row for sub-headers
            for (let i = colIdx + 1; i < row.length; i++) {
              const nextCell = String(row[i] || '').trim().toLowerCase();
              
              // Stop at next "test"/"assignment" or end markers
              if (nextCell === "test" || 
                  nextCell === "assignment" ||
                  nextCell.includes("class attendance") ||
                  nextCell.includes("total marks")) {
                break;
              }
              
              // Check next row for sub-headers (CAT1, A1, Average)
              if (rowIdx + 1 < data.length) {
                const nextRowCell = String(data[rowIdx + 1][i] || '').toLowerCase();
                if (nextRowCell.includes("average")) {
                  spanCount++;
                  break; // Stop after average
                } else if (nextRowCell.includes("cat") || 
                          nextRowCell.includes("a1") ||
                          nextRowCell.trim() !== '') {
                  spanCount++;
                } else if (nextCell === '') {
                  spanCount++; // Empty cell might be part of merge
                } else {
                  break;
                }
              } else if (nextCell === '') {
                spanCount++; // Empty cell might be part of merge
              } else {
                break;
              }
            }
            colspans[rowIdx][colIdx] = spanCount;
          }
        } else {
          // Exams tab spanning logic
          // Row 0: "EXAMINATION QUESTIONS" spans across ALL question columns until "TOTAL EXAM MARK"
          if (rowIdx === 0 && cellLower.includes("examinati") && cellLower.includes("questions")) {
            let spanCount = 1;
            // Count all columns until we hit "TOTAL EXAM MARK", "CAT MARK", or "FINAL MARK"
            for (let i = colIdx + 1; i < row.length; i++) {
              const nextCell = String(row[i] || '').trim().toLowerCase();
              
              // Stop at other main headers
              if (nextCell.includes("total exam mark") ||
                  nextCell.includes("cat mark") ||
                  (nextCell.includes("final mark") && !nextCell.includes("grade"))) {
                break;
              }
              
              // Count this column if it's empty or part of questions section
              // Check next rows to see if this column contains question data (Q1, Q2, I, E, marks)
              let isQuestionColumn = true;
              if (nextCell !== '') {
                // If cell has content, check if it's a question header
                if (!nextCell.includes("q") && !nextCell.match(/^\d+\.?\d*$/)) {
                  isQuestionColumn = false;
                }
              }
              
              // Verify by checking subsequent rows
              if (isQuestionColumn && rowIdx + 1 < data.length) {
                let foundQuestionData = false;
                for (let checkRow = rowIdx + 1; checkRow < Math.min(rowIdx + 4, data.length); checkRow++) {
                  const checkCell = String(data[checkRow]?.[i] || '').trim().toLowerCase();
                  if (checkCell.match(/^q\d+/i) || 
                      checkCell === "i" || 
                      checkCell === "e" || 
                      checkCell.match(/^\d+\.?\d*$/)) {
                    foundQuestionData = true;
                    break;
                  }
                }
                if (!foundQuestionData && nextCell !== '') {
                  break;
                }
              }
              
              spanCount++;
            }
            colspans[rowIdx][colIdx] = spanCount;
          }
          // Row 1 or 2: Individual questions (Q1, Q2, etc.) span across I and marks columns
          else if ((rowIdx === 1 || rowIdx === 2) && /^q\d+/i.test(cellValue.trim())) {
            // Question spans across: Q itself, I column, and marks column
            // Pattern: Q1 spans to include I column and marks (typically 2-3 columns)
            let spanCount = 1;
            
            // Look ahead to find I column and marks column
            for (let i = colIdx + 1; i < row.length && i < colIdx + 5; i++) {
              // Check if we've hit the next question or end of question section
              const currentCell = String(row[i] || '').trim();
              const currentCellLower = currentCell.toLowerCase();
              
              if (currentCellLower.match(/^q\d+/i) || 
                  currentCellLower.includes("total exam") ||
                  currentCellLower.includes("cat mark") ||
                  currentCellLower.includes("final mark")) {
                break;
              }
              
              // Check next rows for I/E pattern or marks
              let foundIOrMarks = false;
              for (let checkRow = rowIdx + 1; checkRow < Math.min(rowIdx + 3, data.length); checkRow++) {
                const checkCell = String(data[checkRow]?.[i] || '').trim().toLowerCase();
                if (checkCell === "i") {
                  // Found I column - this is part of the question span
                  spanCount++;
                  foundIOrMarks = true;
                  break;
                } else if (checkCell === "e") {
                  // Found E column - this belongs to next question, stop here
                  break;
                } else if (checkCell.match(/^\d+\.?\d*$/)) {
                  // Found marks column - include it and stop
                  spanCount++;
                  foundIOrMarks = true;
                  break;
                }
              }
              
              // Also check current row for marks
              if (!foundIOrMarks && currentCell.match(/^\d+\.?\d*$/)) {
                spanCount++;
                break;
              }
              
              // If empty cell, might be part of merge
              if (currentCell === '' && !foundIOrMarks) {
                spanCount++;
              } else if (!foundIOrMarks) {
                break;
              }
            }
            colspans[rowIdx][colIdx] = Math.max(spanCount, 1);
          }
          // Row 0 or 1: "TOTAL EXAM MARK", "CAT MARK", "FINAL MARK" span across I and E columns
          else if (cellLower.includes("total exam mark") ||
                   cellLower.includes("cat mark") ||
                   (cellLower.includes("final mark") && !cellLower.includes("grade"))) {
            // These span across I and E columns (typically 2 columns: I and E)
            // First, find where the next header starts to limit our span
            let nextHeaderCol = row.length;
            for (let i = colIdx + 1; i < row.length; i++) {
              const nextCell = String(row[i] || '').trim().toLowerCase();
              if (nextCell.includes("total exam mark") ||
                  nextCell.includes("cat mark") ||
                  (nextCell.includes("final mark") && !nextCell.includes("grade"))) {
                nextHeaderCol = i;
                break;
              }
            }
            
            let spanCount = 1;
            let foundICount = 0;
            let foundECount = 0;
            
            // Check next rows (up to 3 rows ahead) for I/E pattern, but don't go beyond next header
            for (let i = colIdx + 1; i < nextHeaderCol && i < colIdx + 4; i++) {
              let foundIOrE = false;
              
              // Check multiple rows ahead for I/E columns
              for (let checkRow = rowIdx + 1; checkRow < Math.min(rowIdx + 4, data.length); checkRow++) {
                const checkCell = String(data[checkRow]?.[i] || '').trim().toLowerCase();
                
                if (checkCell === "i") {
                  foundIOrE = true;
                  foundICount++;
                  spanCount++;
                  break;
                } else if (checkCell === "e") {
                  foundIOrE = true;
                  foundECount++;
                  spanCount++;
                  break;
                }
              }
              
              // If we found both I and E, we can stop
              if (foundICount > 0 && foundECount > 0) {
                break;
              }
              
              // If we didn't find I/E in next rows, check if current position is empty (might be merged)
              if (!foundIOrE) {
                const currentCell = String(row[i] || '').trim();
                // Check if next column might have I/E
                if (currentCell === '') {
                  // Empty cell might be part of merge, continue checking
                  spanCount++;
                } else {
                  // Non-empty cell that's not I/E, stop here
                  break;
                }
              }
            }
            colspans[rowIdx][colIdx] = Math.max(spanCount, 1);
          }
        }
      }
    }
    
    return colspans;
  };

  // Calculate colspans
  const colspans = calculateColspans(displayData, activeTab);

  // Filter the display data based on search
  const filteredData = displayData.filter((row) => {
    if (!search.trim()) return true;
    return row.some((cell) => {
      if (cell === null || cell === undefined) return false;
      return String(cell).toLowerCase().includes(search.toLowerCase());
    });
  });

  const handleDownloadMarksheet = async () => {
    if (!currentBlob || !moduleId) {
      alert("No marksheet available to download");
      return;
    }

    setDownloading(true);
    try {
      const filePrefix =
        activeTab === "assessments" ? "marksheet" : "examsheet";
      const fileName = `${filePrefix}_module_${moduleId}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      saveAs(currentBlob, fileName);
    } catch (err) {
      console.error("Download error:", err);
      alert("Error downloading file. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleBackToModules = () => {
    window.location.href = "/academic/marks-submitted";
  };

  // Updated approval handler with dialog
  const handleApproveClick = () => {
    if (!moduleId || displayData.length === 0) {
      alert("No data to approve");
      return;
    }

    // Set default comments based on tab
    if (activeTab === "assessments") {
      setApprovalComments("CAT marks have been reviewed and approved");
      setApprovalNotes("Good performance overall");
    } else {
      setApprovalComments("EXAM marks verified and approved for processing");
      setApprovalNotes("Examination was conducted fairly");
    }

    setShowApprovalDialog(true);
  };

  const handleApprovalSubmit = async () => {
    if (!moduleId) return;

    setShowApprovalDialog(false);
    setSubmitted(false);
    setShowSubmissionMessage(false);
    clearSubmission();

    const options = {
      comments: approvalComments.trim() || undefined,
      additionalNotes: approvalNotes.trim() || undefined,
    };

    await submit(
      moduleId,
      activeTab === "assessments" ? "cat" : "exam",
      options
    );
    setSubmitted(true);
    setShowSubmissionMessage(true);
  };

  const handleRefresh = () => {
    // Clear submission state when refreshing
    setSubmitted(false);
    setShowSubmissionMessage(false);
    clearSubmission();
    currentRefetch();
  };

  const handleTabSwitch = (tab: "assessments" | "exams") => {
    setActiveTab(tab);
    setSearch("");
    // Clear submission state when switching tabs
    setSubmitted(false);
    setShowSubmissionMessage(false);
    clearSubmission();
  };

  const dismissSubmissionMessage = () => {
    setShowSubmissionMessage(false);
    if (!submissionData) {
      setSubmitted(false);
    }
    clearSubmission();
  };

  const formatCellValue = (value: any): string => {
    if (value === null || value === undefined || value === "") {
      return "";
    }
    return String(value);
  };

  const TabButton = ({
    tabKey,
    label,
    isActive,
    onClick,
  }: {
    tabKey: string;
    label: string;
    isActive: boolean;
    onClick: () => void;
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
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Module Marksheet</h1>
          <p className="text-gray-600 mt-2">
            View and manage student marks for this module.
          </p>
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
              disabled={
                !moduleId ||
                !catApproved ||
                !examApproved ||
                overallApproved ||
                isSubmitting
              }
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
                label="Assessments"
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
                    className="min-w-[100px]"
                  >
                    <RefreshCw
                      className={`h-4 w-4 mr-2 ${
                        currentLoading ? "animate-spin" : ""
                      }`}
                    />
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
                      (activeTab === "assessments" &&
                        (marksApprovalStatus.cat || overallApproved)) ||
                      (activeTab === "exams" &&
                        (marksApprovalStatus.exam || overallApproved))
                        ? "bg-[#026892]"
                        : "bg-[#026892] hover:bg-[#026892]/90"
                    }`}
                    onClick={handleApproveClick}
                    disabled={
                      isSubmitting ||
                      currentLoading ||
                      displayData.length === 0 ||
                      overallApproved ||
                      (activeTab === "assessments" &&
                        marksApprovalStatus.cat) ||
                      (activeTab === "exams" && marksApprovalStatus.exam)
                    }
                  >
                    {isSubmitting ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (activeTab === "assessments" &&
                        (marksApprovalStatus.cat || overallApproved)) ||
                      (activeTab === "exams" &&
                        (marksApprovalStatus.exam || overallApproved)) ? (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    ) : (
                      <MessageSquare className="h-4 w-4 mr-2" />
                    )}
                    {isSubmitting
                      ? "Approving..."
                      : (activeTab === "assessments" &&
                          marksApprovalStatus.cat) ||
                        (activeTab === "exams" && marksApprovalStatus.exam)
                      ? "Approved"
                      : "Approve Submission"}
                  </Button>
                </div>
              </div>

              {/* Stats */}
              {displayData.length > 0 && (
                <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600 border-t pt-4">
                  {search && filteredData.length !== displayData.length && (
                    <div>
                      <span>
                        <strong>{filteredData.length}</strong> filtered results
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Approval Dialog */}
          <Dialog
            open={showApprovalDialog}
            onOpenChange={setShowApprovalDialog}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>
                  Approve {activeTab === "assessments" ? "CAT" : "Exam"} Marks
                </DialogTitle>
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
                    This will approve the{" "}
                    {activeTab === "assessments" ? "CAT" : "exam"} marks for
                    forwarding to the next approval level.
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowApprovalDialog(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleApprovalSubmit}
                  disabled={isSubmitting || !approvalComments.trim()}
                  className="bg-[#026892] hover:bg-[#026892]/90"
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
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
                      {submissionData.message ||
                        "Approval successful! The marks have been approved."}
                    </span>
                  </div>
                  <button
                    onClick={dismissSubmissionMessage}
                    className="text-green-600 hover:text-green-800 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : submissionError ? (
                <div className="flex items-center justify-between gap-3 text-red-800 bg-red-50 border border-red-200 rounded-lg px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium">{submissionError}</span>
                  </div>
                  <button
                    onClick={dismissSubmissionMessage}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : null}
            </div>
          )}

          {/* Main Content - Raw Excel Display */}
          <Card>
            <CardContent className="p-0">
              {currentLoading ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#026892] mb-4"></div>
                  <div className="text-gray-600 text-lg">
                    Loading {activeTab}...
                  </div>
                  <div className="text-gray-400 text-sm mt-2">
                    Fetching Excel file from database
                  </div>
                </div>
              ) : currentError ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                  <div className="text-red-600 text-lg mb-2">
                    Failed to Load{" "}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </div>
                  <div className="text-gray-600 text-center mb-6 max-w-md">
                    {currentError}
                  </div>
                  <Button
                    onClick={handleRefresh}
                    variant="outline"
                    className="min-w-[120px]"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : displayData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
                  <div className="text-gray-600 text-lg mb-2">
                    No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    Data
                  </div>
                  <div className="text-gray-400 text-center">
                    No {activeTab} data found for this module or the Excel file
                    is empty.
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-white">
                  {/* Display Excel data exactly as it is */}
                  <div className="w-full overflow-x-auto">
                    <table className="w-full text-xs border-separate" style={{ borderSpacing: 0 }}>
                      <tbody>
                        {filteredData.map((row, rowIndex) => {
                          // Track which cells to skip (part of a previous colspan)
                          const skipCells = new Set<number>();
                          
                          return (
                            <tr key={`row-${rowIndex}`}>
                              {row.map((cell, cellIndex) => {
                                // Skip cells that are part of a previous colspan
                                if (skipCells.has(cellIndex)) {
                                  return null;
                                }
                                
                                const cellValue = formatCellValue(cell);
                                const isEmpty = cellValue === "";
                                
                                // Get colspan for this cell (if it's a header row)
                                const cellColspan = rowIndex < colspans.length && 
                                  cellIndex < colspans[rowIndex].length 
                                  ? colspans[rowIndex][cellIndex] 
                                  : 1;
                                
                                // Mark cells that should be skipped due to colspan
                                if (cellColspan > 1) {
                                  for (let i = 1; i < cellColspan; i++) {
                                    if (cellIndex + i < row.length) {
                                      skipCells.add(cellIndex + i);
                                    }
                                  }
                                }

                            // Check if this cell contains "FAIL", "REPEAT", or "RETAKE" for highlighting
                            const cellLower = cellValue.toLowerCase();
                            const isFailCell =
                              cellLower === "fail" || 
                              cellLower === "repeat" || 
                              cellLower === "retake";
                            
                            // Check if this cell contains "PASS" for highlighting
                            const isPassCell = cellLower === "pass";

                            // Determine if this is a header row
                            // The first row after filtering should be the column header row
                            // Also check for multi-level headers (rows 0-2 might be headers)
                            const rowText = row.map(c => String(c || '').toLowerCase()).join(' ');
                            const hasHeaderKeywords = rowText.includes('sn') || 
                              rowText.includes('sl.no') || 
                              rowText.includes('sl no') ||
                              rowText.includes('reg') || 
                              rowText.includes('candidate') ||
                              rowText.includes('gender') ||
                              rowText.includes('final assessment') ||
                              rowText.includes('test') ||
                              rowText.includes('assignment') ||
                              rowText.includes('examinati') ||
                              rowText.includes('total exam') ||
                              rowText.includes('cat mark') ||
                              rowText.includes('final mark') ||
                              rowText.includes('grade') ||
                              rowText.includes('remark') ||
                              rowText.includes('attendance') ||
                              rowText.includes('i') && rowText.includes('e'); // I/E columns
                            
                            // Check if this is a data row (contains numbers that look like student data)
                            const hasStudentData = row.some(cell => {
                              const val = String(cell || '');
                              // Check if cell contains registration number pattern or marks
                              return /^\d{6,}$/.test(val.trim()) || // Long numbers (reg numbers)
                                     /^\d+\.?\d*$/.test(val.trim()) && parseFloat(val) > 0 && parseFloat(val) <= 100; // Marks
                            });
                            
                            // First row is always header, or rows with header keywords but no student data
                            const isHeaderRow = rowIndex === 0 || 
                              (rowIndex < 3 && hasHeaderKeywords && !hasStudentData &&
                               !rowText.includes('summary statistics') &&
                               !rowText.includes('performance summary') &&
                               !rowText.includes('total students') &&
                               !rowText.includes('students passed') &&
                               !rowText.includes('average score'));
                            
                            // Determine header background color based on cell content and tab
                            const getHeaderBackgroundColor = (cellValue: string, activeTab: string): string => {
                              const cellLower = cellValue.toLowerCase();
                              
                              if (activeTab === "assessments") {
                                // CATs tab colors
                                if (cellLower.includes("final assessment") || 
                                    cellLower.includes("test") || 
                                    cellLower.includes("assignment") ||
                                    cellLower.includes("cat1") ||
                                    cellLower.includes("a1") ||
                                    cellLower.includes("average")) {
                                  return "bg-blue-200"; // Light blue
                                }
                                // Other headers (SN, REG. NUMBER, GENDER, Class Attendance, Total Marks, REMARK)
                                if (cellValue.trim() !== "") {
                                  return "bg-green-200"; // Light green
                                }
                                return "bg-white";
                              } else {
                                // Exams tab colors
                                if (cellLower.includes("total exam mark") || 
                                    cellLower.includes("total exam")) {
                                  return "bg-yellow-200"; // Yellow
                                }
                                if (cellLower.includes("final mark") || 
                                    cellLower.includes("final")) {
                                  return "bg-orange-200"; // Light orange
                                }
                                if (cellLower.includes("remark")) {
                                  return "bg-white"; // White
                                }
                                // Other headers (EXAMINATI, CAT MARK, GRADE, etc.)
                                if (cellValue.trim() !== "") {
                                  return "bg-green-200"; // Light green
                                }
                                return "bg-white";
                              }
                            };

                            // Get header background color
                            const headerBgColor = isHeaderRow 
                              ? getHeaderBackgroundColor(cellValue, activeTab)
                              : "";

                            // Check if this is a section header row (like "SUMMARY STATISTICS" or "PERFORMANCE SUMMARY")
                            const isSectionHeader = row.some(
                              (c) =>
                                String(c)
                                  .toLowerCase()
                                  .includes("summary statistics") ||
                                String(c)
                                  .toLowerCase()
                                  .includes("performance summary")
                            );
                            
                            // Check if this cell contains a numeric mark that is less than 50% of column max
                            const isLowMark = (() => {
                              if (isHeaderRow || isEmpty || isSectionHeader) return false;
                              
                              // Get the maximum marks for this column
                              const columnMax = columnMaxMarks[cellIndex];
                              
                              // If we don't have a max for this column, skip
                              if (!columnMax || columnMax === 0) return false;
                              
                              // Try to parse the cell value as a number
                              const numValue = parseFloat(cellValue);
                              if (!isNaN(numValue) && numValue >= 0) {
                                // Calculate 50% of the column maximum
                                const passingThreshold = columnMax * 0.5;
                                
                                // Check if the mark is less than 50% of the column max
                                if (numValue < passingThreshold) {
                                  return true;
                                }
                              }
                              
                              // Also check for marks in format "15/20" - extract the obtained value
                              if (cellValue.includes('/')) {
                                const parts = cellValue.split('/');
                                if (parts.length === 2) {
                                  const obtained = parseFloat(parts[0]);
                                  if (!isNaN(obtained) && obtained >= 0 && columnMax) {
                                    const passingThreshold = columnMax * 0.5;
                                    if (obtained < passingThreshold) {
                                      return true;
                                    }
                                  }
                                }
                              }
                              
                              return false;
                            })();

                              return (
                                <td
                                  key={`cell-${rowIndex}-${cellIndex}`}
                                  colSpan={cellColspan > 1 ? cellColspan : undefined}
                                  className={`
                                  p-1 text-center
                                  ${isEmpty && !isHeaderRow ? "bg-white" : ""}
                                  ${
                                    isFailCell
                                      ? "bg-red-100 text-red-700 font-bold"
                                      : ""
                                  }
                                  ${
                                    isLowMark
                                      ? "bg-red-100 text-red-700 font-semibold"
                                      : ""
                                  }
                                  ${
                                    isPassCell && !isHeaderRow
                                      ? "bg-green-100 text-green-800 font-semibold"
                                      : ""
                                  }
                                  ${
                                    isHeaderRow
                                      ? `${headerBgColor} font-bold`
                                      : isSectionHeader
                                      ? "bg-gray-100 font-semibold"
                                      : ""
                                  }
                                `}
                                style={{
                                  minWidth: isEmpty ? "20px" : "auto",
                                  fontSize: "11px",
                                  // Apply slightly bold borders to all cells (headers and data)
                                  borderTop: "1.5px solid",
                                  borderRight: "1.5px solid",
                                  borderBottom: "1.5px solid",
                                  borderLeft: "1.5px solid",
                                  borderColor: isHeaderRow 
                                    ? "#9ca3af" // gray-800 for headers
                                    : isSectionHeader
                                    ? "#9ca3af" // gray-400 for section headers
                                    : "#d1d5db", // gray-300 for data rows
                                }}
                              >
                                {cellValue}
                              </td>
                              );
                            })}
                          </tr>
                        );
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
  );
}
