"use client";
import React, { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  Calendar,
  Clock,
  Save,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Settings,
  X,
  CalendarDays,
} from "lucide-react";
import { useModuleAssignments } from "@/hooks/deadlines/useModuleAssignments";
import {
  ModuleSubmissionDetails,
  DeadlineSubmission,
} from "@/lib/deadlines/moduleAssignmentsApi";
import { useToast } from "@/hooks/use-toast";

interface DeadlineModalData {
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  lecturerName: string;
  currentCatDeadline?: string;
  currentExamDeadline?: string;
  catStatus?: string;
  examStatus?: string;
}

export default function MarksSubmissionDeadlinesPage() {
  // Toast hook
  const { toast } = useToast();

  // API Hook
  const {
    data: moduleAssignments,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    setPage,
    clearError,
    refetch,
    updateFilters,
    setDeadlines, // Use the new unified function
    getSubmissionDetails,
    submissionError,
    submissionDetailsError,
    isCreatingSubmissions,
  } = useModuleAssignments({ page: 0, size: 20 });

  // Local state for filters and pagination
  const [moduleSearch, setModuleSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All Departments");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");
  const [localPage, setLocalPage] = useState(1);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<DeadlineModalData | null>(null);
  const [loadingModalData, setLoadingModalData] = useState(false);
  const [catDeadline, setCatDeadline] = useState("");
  const [examDeadline, setExamDeadline] = useState("");
  const [savingDeadlines, setSavingDeadlines] = useState(false);
  const [modalError, setModalError] = useState("");

  // Store submission details for each module
  const [moduleSubmissions, setModuleSubmissions] = useState<
    Record<string, ModuleSubmissionDetails>
  >({});

  // Fetch all module submission details on page load or when moduleAssignments changes
  useEffect(() => {
    let isMounted = true;
    async function fetchAllSubmissions() {
      if (!moduleAssignments || moduleAssignments.length === 0) return;
      
      console.log('Page: Fetching submission details for', moduleAssignments.length, 'modules');
      setModuleSubmissions({}); // clear first to avoid stale data
      
      const results: Record<string, ModuleSubmissionDetails> = {};
      
      // Process in batches to avoid overwhelming the server
      const batchSize = 5;
      for (let i = 0; i < moduleAssignments.length; i += batchSize) {
        const batch = moduleAssignments.slice(i, i + batchSize);
        
        await Promise.all(
          batch.map(async (assignment) => {
            try {
              const response = await getSubmissionDetails(assignment.id);
              if (response && response.data && isMounted) {
                results[assignment.id] = response.data;
              }
            } catch (err) {
              console.warn('Page: Failed to fetch submission details for module:', assignment.id, err);
              // Continue with other modules even if one fails
            }
          })
        );
        
        // Small delay between batches
        if (i + batchSize < moduleAssignments.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      if (isMounted) {
        console.log('Page: Loaded submission details for', Object.keys(results).length, 'modules');
        setModuleSubmissions(results);
      }
    }
    
    fetchAllSubmissions();
    
    return () => {
      isMounted = false;
    };
  }, [moduleAssignments, getSubmissionDetails]);

  // Get unique departments and semesters for filters
  const departments = useMemo(() => {
    const depts = [...new Set(moduleAssignments.map((m) => m.departmentName))];
    return ["All Departments", ...depts.sort()];
  }, [moduleAssignments]);

  const semesters = useMemo(() => {
    const sems = [...new Set(moduleAssignments.map((m) => m.semesterName))];
    return ["All Semesters", ...sems.sort()];
  }, [moduleAssignments]);

  // Filter data based on search and filters
  const filteredData = useMemo(() => {
    return moduleAssignments.filter((assignment) => {
      const matchesSearch =
        assignment.instructorName
          .toLowerCase()
          .includes(moduleSearch.toLowerCase()) ||
        assignment.moduleCode
          .toLowerCase()
          .includes(moduleSearch.toLowerCase()) ||
        assignment.moduleName
          .toLowerCase()
          .includes(moduleSearch.toLowerCase());

      const matchesDepartment =
        departmentFilter === "All Departments" ||
        assignment.departmentName === departmentFilter;

      const matchesSemester =
        semesterFilter === "All Semesters" ||
        assignment.semesterName === semesterFilter;

      return matchesSearch && matchesDepartment && matchesSemester;
    });
  }, [moduleAssignments, moduleSearch, departmentFilter, semesterFilter]);

  // Local pagination for filtered data
  const pageSize = 10;
  const totalFilteredPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (localPage - 1) * pageSize,
    localPage * pageSize
  );

  // Reset local pagination when filters change
  useEffect(() => {
    setLocalPage(1);
  }, [moduleSearch, departmentFilter, semesterFilter]);

  // Format date for input (YYYY-MM-DD format)
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      // Ensure we get the date in local timezone
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error formatting date for input:', dateString, error);
      return "";
    }
  };

  // Format date for display
  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return "Not set";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      console.error('Error formatting date for display:', dateString, error);
      return "Invalid date";
    }
  };

  // Get status badge for submission
  const getStatusBadge = (status?: string, deadline?: string) => {
    if (!status || !deadline) {
      return (
        <span className="px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">
          Not Set
        </span>
      );
    }

    const statusConfig: Record<string, { className: string; label: string }> = {
      DRAFT: { className: "bg-yellow-100 text-yellow-700", label: "Draft" },
      SUBMITTED: { className: "bg-blue-100 text-blue-700", label: "Submitted" },
      APPROVED: { className: "bg-green-100 text-green-700", label: "Approved" },
      REJECTED: { className: "bg-red-100 text-red-700", label: "Rejected" },
      OVERDUE: { className: "bg-red-100 text-red-700", label: "Overdue" },
      PENDING: { className: "bg-orange-100 text-orange-700", label: "Pending" },
    };

    const config = statusConfig[status] || {
      className: "bg-gray-100 text-gray-700",
      label: status,
    };

    return (
      <div className="flex flex-col items-start gap-1">
        <span
          className={`${config.className} px-2 py-1 rounded-full text-xs font-semibold`}
        >
          {config.label}
        </span>
        <span className="text-xs text-gray-500">
          {formatDateForDisplay(deadline)}
        </span>
      </div>
    );
  };

  // Open deadline setting modal
  const handleOpenModal = async (assignment: any) => {
    console.log('Page: Opening modal for assignment:', assignment.id);
    setIsModalOpen(true);
    setLoadingModalData(true);
    setModalError("");
    setCatDeadline("");
    setExamDeadline("");

    try {
      const response = await getSubmissionDetails(assignment.id);
      const submissionData = response.data;

      console.log('Page: Modal submission data:', submissionData);

      setModalData({
        moduleId: submissionData.moduleAssignmentId,
        moduleCode: assignment.moduleCode,
        moduleName: assignment.moduleName,
        lecturerName: assignment.instructorName,
        currentCatDeadline: submissionData.catSubmission?.deadline,
        currentExamDeadline: submissionData.examSubmission?.deadline,
        catStatus: submissionData.catSubmission?.status,
        examStatus: submissionData.examSubmission?.status,
      });

      // Set form values with existing deadlines
      setCatDeadline(
        formatDateForInput(submissionData.catSubmission?.deadline || "")
      );
      setExamDeadline(
        formatDateForInput(submissionData.examSubmission?.deadline || "")
      );

      // Store submission data
      setModuleSubmissions((prev) => ({
        ...prev,
        [assignment.id]: submissionData,
      }));
    } catch (error: any) {
      console.error("Page: Error loading submission details:", error);
      setModalError(error.message || "Failed to load submission details");
    } finally {
      setLoadingModalData(false);
    }
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalData(null);
    setCatDeadline("");
    setExamDeadline("");
    setModalError("");
    setSavingDeadlines(false);
  };

  // Save deadlines - using the new unified function
  const handleSaveDeadlines = async () => {
    console.log('Page: Saving deadlines...');
    
    if (!modalData || !catDeadline || !examDeadline) {
      setModalError("Please set both CAT and EXAM deadlines");
      return;
    }

    // Validate dates
    const catDate = new Date(catDeadline);
    const examDate = new Date(examDeadline);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (catDate < today) {
      setModalError("CAT deadline cannot be in the past");
      return;
    }

    if (examDate < today) {
      setModalError("EXAM deadline cannot be in the past");
      return;
    }

    try {
      setSavingDeadlines(true);
      setModalError("");

      // Create deadline object with the required format
      const deadlines = {
        catDeadline: new Date(catDeadline + "T23:59:59").toISOString(),
        examDeadline: new Date(examDeadline + "T23:59:59").toISOString(),
      };

      console.log('Page: Calling setDeadlines with:', { moduleId: modalData.moduleId, deadlines });

      // Use the new unified function that handles both create and update
      const response = await setDeadlines(modalData.moduleId, deadlines);

      console.log('Page: setDeadlines response:', response);

      if (response && (response.success || response.success === undefined)) {
        handleCloseModal();
        toast({
          title: "Success",
          description: response.message || "CAT and EXAM deadlines have been set successfully.",
          variant: "default",
        });
      } else {
        const errorMsg = response?.message || "Failed to save deadlines - invalid response";
        setModalError(errorMsg);
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      console.error('Page: Error saving deadlines:', err);
      const errorMsg = err.message || "Could not save deadlines at this time. Please try again later.";
      setModalError(errorMsg);
      toast({
        title: "Error",
        description: "Could not save deadlines. Please try again or contact support if the problem persists.",
        variant: "destructive",
      });
    } finally {
      setSavingDeadlines(false);
    }
  };

  return (
    <div className="p-2">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Marks Submission Deadlines
          </h1>
          <p className="text-gray-600 text-base">
            Set CAT and EXAM submission deadlines for all modules
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={refetch}
            disabled={loading}
            className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-md font-medium text-sm hover:bg-gray-200 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Error Display */}
      {(error || submissionError || submissionDetailsError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>{error || submissionError || submissionDetailsError}</span>
            </div>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Card className="p-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          <div className="relative flex-1 max-w-md">
            <input
              type="search"
              value={moduleSearch}
              onChange={(e) => setModuleSearch(e.target.value)}
              placeholder="Search modules, lecturers..."
              className="border rounded-md px-10 py-2 text-sm w-full bg-white focus:border-[#0891b2] focus:ring-[#0891b2]"
            />
            <svg
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-[#026892]" />
            <span className="ml-2 text-gray-600">Loading modules...</span>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700 font-semibold">
                      Module
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Lecturer
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Department
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Students
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      CAT Status
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      EXAM Status
                    </TableHead>
                    <TableHead className="text-gray-700 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-8 text-gray-500"
                      >
                        {moduleSearch ||
                        departmentFilter !== "All Departments" ||
                        semesterFilter !== "All Semesters"
                          ? "No matching modules found"
                          : "No modules found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((assignment) => {
                      const submissionData = moduleSubmissions[assignment.id];

                      return (
                        <TableRow key={assignment.id}>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">
                                {assignment.moduleCode}
                              </div>
                              <div className="text-xs text-gray-500 max-w-xs truncate">
                                {assignment.moduleName}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">
                                {assignment.instructorName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {assignment.instructorEmail}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">
                                {assignment.departmentName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {assignment.semesterName}
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-gray-700 text-sm">
                            {assignment.currentEnrollment}/
                            {assignment.maxStudents}
                          </TableCell>

                          <TableCell>
                            {getStatusBadge(
                              submissionData?.catSubmission?.status,
                              submissionData?.catSubmission?.deadline
                            )}
                          </TableCell>

                          <TableCell>
                            {getStatusBadge(
                              submissionData?.examSubmission?.status,
                              submissionData?.examSubmission?.deadline
                            )}
                          </TableCell>

                          <TableCell>
                            <button
                              onClick={() => handleOpenModal(assignment)}
                              disabled={isCreatingSubmissions}
                              className="flex items-center gap-1 bg-[#026892] text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-[#026892]/90 disabled:opacity-50"
                            >
                              <Settings className="h-3 w-3" />
                              Set Deadlines
                            </button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {paginatedData.length} of {filteredData.length} filtered
                results ({totalElements} total)
              </div>
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 rounded-md border text-sm font-medium bg-white text-gray-700 disabled:opacity-50"
                  onClick={() => setLocalPage((p) => Math.max(1, p - 1))}
                  disabled={localPage === 1}
                >
                  Previous
                </button>
                <span className="text-sm text-gray-600 px-3 py-1">
                  Page {localPage} of {totalFilteredPages || 1}
                </span>
                <button
                  className="px-3 py-1 rounded-md border text-sm font-medium bg-white text-gray-700 disabled:opacity-50"
                  onClick={() =>
                    setLocalPage((p) => Math.min(totalFilteredPages, p + 1))
                  }
                  disabled={localPage >= totalFilteredPages}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </Card>

      {/* Deadline Setting Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Set Submission Deadlines
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {modalData?.moduleCode} - {modalData?.moduleName}
                </p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {loadingModalData ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-[#026892]" />
                  <span className="ml-2 text-gray-600">
                    Loading submission details...
                  </span>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Module Info */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">
                          Lecturer:
                        </span>
                        <p className="text-gray-600">
                          {modalData?.lecturerName}
                        </p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">
                          Module:
                        </span>
                        <p className="text-gray-600">
                          {modalData?.moduleCode} - {modalData?.moduleName}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Current Deadlines */}
                  {(modalData?.currentCatDeadline ||
                    modalData?.currentExamDeadline) && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        Current Deadlines
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-blue-700">
                            CAT Deadline:
                          </span>
                          <p className="text-blue-600">
                            {formatDateForDisplay(
                              modalData?.currentCatDeadline || ""
                            )}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                              modalData?.catStatus === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : modalData?.catStatus === "SUBMITTED"
                                ? "bg-blue-100 text-blue-700"
                                : modalData?.catStatus === "DRAFT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {modalData?.catStatus || "Not Set"}
                          </span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700">
                            EXAM Deadline:
                          </span>
                          <p className="text-blue-600">
                            {formatDateForDisplay(
                              modalData?.currentExamDeadline || ""
                            )}
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded text-xs font-medium mt-1 ${
                              modalData?.examStatus === "APPROVED"
                                ? "bg-green-100 text-green-700"
                                : modalData?.examStatus === "SUBMITTED"
                                ? "bg-blue-100 text-blue-700"
                                : modalData?.examStatus === "DRAFT"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {modalData?.examStatus || "Not Set"}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {modalError && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        {modalError}
                      </div>
                    </div>
                  )}

                  {/* Deadline Form */}
                  <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">
                      {modalData?.currentCatDeadline || modalData?.currentExamDeadline 
                        ? 'Update Deadlines' 
                        : 'Set New Deadlines'}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CAT Submission Deadline
                        </label>
                        <input
                          type="date"
                          value={catDeadline}
                          onChange={(e) => setCatDeadline(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#026892] focus:ring-[#026892]"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          EXAM Submission Deadline
                        </label>
                        <input
                          type="date"
                          value={examDeadline}
                          onChange={(e) => setExamDeadline(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#026892] focus:ring-[#026892]"
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveDeadlines}
                disabled={
                  savingDeadlines ||
                  loadingModalData ||
                  !catDeadline ||
                  !examDeadline
                }
                className="px-4 py-2 text-sm font-medium text-white bg-[#026892] rounded-md hover:bg-[#026892]/90 disabled:opacity-50 flex items-center gap-2"
              >
                {savingDeadlines ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {modalData?.currentCatDeadline || modalData?.currentExamDeadline 
                      ? 'Update Deadlines' 
                      : 'Save Deadlines'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}