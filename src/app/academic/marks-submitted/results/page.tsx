"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMarkSheet } from "@/hooks/module-marks/useMarkSheet";
import { useExamSheet } from "@/hooks/module-marks/useExamSheet";
import { useSubmission } from "@/hooks/useSubmission";
import { saveAs } from "file-saver";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
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
  
  // Submission hook
  const {
    isSubmitting,
    submissionData,
    error: submissionError,
    submit,
    clearSubmission,
  } = useSubmission();
  const [downloading, setDownloading] = useState(false);

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

  // Filter the current tab data based on search
  const filteredData = currentData.filter((row) => {
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
    if (!moduleId || currentData.length === 0) {
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
      additionalNotes: approvalNotes.trim() || undefined
    };
    
    await submit(moduleId, activeTab === "assessments" ? "cat" : "exam", options);
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
                    submitted && submissionData
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-blue-600 hover:bg-blue-700"
                  }`}
                  onClick={handleApproveClick}
                  disabled={
                    isSubmitting || 
                    currentLoading || 
                    currentData.length === 0 ||
                    (submitted && !!submissionData) // Disable if successfully submitted
                  }
                >
                  {isSubmitting ? (
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  ) : submitted && submissionData ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <MessageSquare className="h-4 w-4 mr-2" />
                  )}
                  {isSubmitting
                    ? "Approving..."
                    : submitted && submissionData
                    ? "Approved"
                    : "Approve Submission"}
                </Button>
              </div>
            </div>

            {/* Stats */}
            {currentData.length > 0 && (
              <div className="flex flex-wrap gap-6 mt-4 text-sm text-gray-600 border-t pt-4">
                {search && filteredData.length !== currentData.length && (
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
        <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
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
                <p>This will approve the {activeTab === "assessments" ? "CAT" : "exam"} marks for forwarding to the next approval level.</p>
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
                className="bg-blue-600 hover:bg-blue-700"
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
                    {submissionData.message || "Approval successful! The marks have been approved."}
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
            ) : currentData.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mb-4" />
                <div className="text-gray-600 text-lg mb-2">
                  No {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                  Data
                </div>
                <div className="text-gray-400 text-center">
                  No {activeTab} data found for this module or the Excel file is empty.
                </div>
              </div>
            ) : (
              <div className="p-4 bg-white">
                {/* Tab Header */}
                <div className="mb-4 text-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                    Marksheet
                  </h3>
                </div>

                {/* Display Excel data exactly as it is */}
                <div className="w-full overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <tbody>
                      {filteredData.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`}>
                          {row.map((cell, cellIndex) => {
                            const cellValue = formatCellValue(cell);
                            const isEmpty = cellValue === "";

                            // Check if this cell contains "FAIL" for highlighting
                            const isFailCell =
                              cellValue.toLowerCase() === "fail";

                            // Determine if this looks like a header row
                            const isHeaderRow = row.some(
                              (c) =>
                                String(c)
                                  .toLowerCase()
                                  .includes("final assessment") ||
                                String(c)
                                  .toLowerCase()
                                  .includes("summary statistics") ||
                                String(c)
                                  .toLowerCase()
                                  .includes("performance summary") ||
                                String(c).toLowerCase().includes("exam") ||
                                String(c).toLowerCase().includes("college") ||
                                String(c).toLowerCase().includes("department")
                            );

                            return (
                              <td
                                key={`cell-${rowIndex}-${cellIndex}`}
                                className={`
                                  border border-gray-300 p-1 text-center
                                  ${isEmpty ? "bg-white" : ""}
                                  ${
                                    isFailCell
                                      ? "bg-red-100 text-red-700 font-bold"
                                      : ""
                                  }
                                  ${
                                    isHeaderRow
                                      ? "bg-gray-100 font-semibold"
                                      : ""
                                  }
                                `}
                                style={{
                                  minWidth: isEmpty ? "20px" : "auto",
                                  fontSize: "11px",
                                }}
                              >
                                {cellValue}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
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