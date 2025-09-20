"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2, CheckCircle } from "lucide-react";
import { useModuleAssignments } from "@/hooks/modules/useModuleAssignments";
import { submitToDean } from "@/lib/module-marks/grading-api";
import { useToast } from "@/hooks/use-toast";

// Keep existing analytics dummy data
const gradeDistributionData = [
  { name: "Approved", value: 3, color: "#22c55e" },
  { name: "Pending", value: 2, color: "#eab308" },
  { name: "Not Submitted", value: 1, color: "#6b7280" },
];

const submissionStatistics = {
  totalSubmissions: 4,
  approved: 1,
  pending: 1,
  overdue: 1,
  rejected: 1,
};

const gradeDistribution = [
  { grade: "A", percentage: 25, color: "#22c55e" },
  { grade: "B", percentage: 35, color: "#3b82f6" },
  { grade: "C", percentage: 30, color: "#f59e0b" },
  { grade: "D", percentage: 8, color: "#8b5cf6" },
  { grade: "F", percentage: 2, color: "#ef4444" },
];

const departmentStats = {
  overallAverage: 74.2,
  highestModuleAvg: 86.3,
  lowestModuleAvg: 62.1,
};

const deadlinesData = [
  {
    module: "COE3166 - Web Development",
    instructor: "Ms. Carol Davis",
    deadline: "Dec 18, 2024",
    status: "Overdue",
    daysLeft: -2,
  },
  {
    module: "COE3163 - Software Engineering",
    instructor: "Dr. Alice Smith",
    deadline: "Dec 20, 2024",
    status: "2 days left",
    daysLeft: 2,
  },
];

// Helper function to generate consistent status for demonstration
const getStatusForAssignment = (assignmentId: string) => {
  const statuses = ["Pending", "Approved", "Overdue", "Rejected"];
  // Use assignment ID to generate consistent status
  const hash = assignmentId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  return statuses[Math.abs(hash) % statuses.length];
};

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export default function MarksSubmittedPage() {
  // Main tabs: 'mark-submissions', 'analytics', 'deadlines'
  const [mainActiveTab, setMainActiveTab] = React.useState("mark-submissions");

  // API Hook - fetch more data initially to reduce need for pagination
  const {
    data: moduleAssignments,
    loading,
    error,
    totalElements,
    totalPages,
    currentPage,
    setPage,
    clearError
  } = useModuleAssignments({ page: 0, size: 50 });

  // Module Table State
  const [moduleSearch, setModuleSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Status");
  const [yearFilter, setYearFilter] = React.useState("All Years");
  const [localPage, setLocalPage] = React.useState(1);
  const [approvingIds, setApprovingIds] = React.useState<Set<string>>(new Set());
  const [bulkApproving, setBulkApproving] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Handle approval of submission to dean
  const handleApproveSubmission = async (groupId: string, semesterId: string, assignmentId: string) => {
    setApprovingIds(prev => new Set(prev).add(assignmentId));
    
    try {
      await submitToDean(groupId, semesterId);
      
      toast({
        title: "Success!",
        description: "Marks have been successfully submitted to the dean for approval.",
        variant: "default",
      });
      
      // Optionally refresh the data or update the status locally
      // For now, we'll keep the current approach where status is generated from ID
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit marks to dean. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApprovingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(assignmentId);
        return newSet;
      });
    }
  };

  // Handle bulk approval of all pending submissions
  const handleBulkApproval = async () => {
    const pendingItems = filteredData.filter(row => row.status === "Pending");
    
    if (pendingItems.length === 0) {
      toast({
        title: "No Pending Items",
        description: "There are no pending submissions to approve.",
        variant: "default",
      });
      return;
    }

    setBulkApproving(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const item of pendingItems) {
      try {
        await submitToDean(item.groupId, item.semesterId);
        successCount++;
      } catch (error: any) {
        errorCount++;
        errors.push(`${item.className}: ${error.message}`);
      }
    }

    setBulkApproving(false);

    // Show results
    if (successCount > 0 && errorCount === 0) {
      toast({
        title: "Success!",
        description: `Successfully approved ${successCount} submission${successCount > 1 ? 's' : ''} to the dean.`,
        variant: "default",
      });
    } else if (successCount > 0 && errorCount > 0) {
      toast({
        title: "Partial Success",
        description: `Approved ${successCount} submissions. ${errorCount} failed. Check individual items for details.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to approve any submissions. ${errors.slice(0, 2).join(', ')}${errors.length > 2 ? '...' : ''}`,
        variant: "destructive",
      });
    }
  };

  // Transform API data to match table format - memoized to prevent recalculation
  const transformedData = React.useMemo(() => {
    return moduleAssignments.map(assignment => ({
      id: assignment.id,
      groupId: assignment.groupId, // Add group ID
      className: `${assignment.groupName} (${assignment.groupCode})`,
      lecturer: assignment.instructorName,
      lecturerEmail: assignment.instructorEmail,
      students: assignment.currentEnrollment,
      maxStudents: assignment.maxStudents,
      module: `${assignment.moduleCode} - ${assignment.moduleName}`,
      moduleCode: assignment.moduleCode,
      moduleName: assignment.moduleName,
      submissionDate: Math.random() > 0.3 ? formatDate(assignment.updatedAt) : "Not submitted",
      deadline: formatDate(assignment.endDate),
      status: getStatusForAssignment(assignment.id), // Consistent status based on ID
      academicYear: assignment.academicYearName,
      academicYearId: assignment.academicYearId, // Add academic year ID  
      semester: assignment.semesterName,
      semesterId: assignment.semesterId, // Add semester ID
      departmentName: assignment.departmentName,
      schoolName: assignment.schoolName,
      collegeName: assignment.collegeName,
    }));
  }, [moduleAssignments]);

  // Filter data based on search and filters - memoized
  const filteredData = React.useMemo(() => {
    return transformedData.filter(row => {
      const matchesSearch =
        row.className.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        row.lecturer.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        row.module.toLowerCase().includes(moduleSearch.toLowerCase());

      const matchesStatus = statusFilter === "All Status" || row.status === statusFilter;

      // For year filter, you might want to extract year from academicYear or className
      const matchesYear = yearFilter === "All Years"; // Implement year filtering logic as needed

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [transformedData, moduleSearch, statusFilter, yearFilter]);

  // Local pagination for filtered data
  const pageSize = 10;
  const totalFilteredPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = filteredData.slice(
    (localPage - 1) * pageSize,
    localPage * pageSize
  );

  // Reset local page when filters change
  React.useEffect(() => {
    setLocalPage(1);
  }, [moduleSearch, statusFilter, yearFilter]);

  // Deadlines state
  const [selectedModule, setSelectedModule] = React.useState("");
  const [selectedDeadline, setSelectedDeadline] = React.useState("");

  const renderStatusBadge = (status: string) => {
    const statusConfig = {
      "Pending": {
        className: "bg-yellow-100 text-yellow-700",
        icon: (
          <svg className="h-4 w-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
          </svg>
        )
      },
      "Approved": {
        className: "bg-green-100 text-green-700",
        icon: (
          <svg className="h-4 w-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )
      },
      "Overdue": {
        className: "bg-red-100 text-red-700",
        icon: (
          <svg className="h-4 w-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2 2" />
          </svg>
        )
      },
      "Rejected": {
        className: "bg-red-100 text-red-700",
        icon: (
          <svg className="h-4 w-4 inline" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        )
      }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`${config.className} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}>
        {config.icon}
        {status}
      </span>
    );
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Marks Management
      </h1>
      <p className="text-gray-600 text-base mb-2">
        Review and approve marks submitted by lecturers
      </p>

      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex gap-2 w-full">
          <button
            className={`px-6 py-2 rounded-md font-medium text-sm border ${mainActiveTab === "mark-submissions"
                ? "bg-[#026892] text-white border-gray-200 hover:bg-[#026892]/90"
                : "bg-white text-black border-gray-200 hover:bg-gray-100"
              }`}
            onClick={() => setMainActiveTab("mark-submissions")}
          >
            Mark Submissions
          </button>
          <button
            className={`px-6 py-2 rounded-md font-medium text-sm border ${mainActiveTab === "analytics"
                ? "bg-[#026892] text-white border-gray-200 hover:bg-[#026892]/90"
                : "bg-white text-black border-gray-200 hover:bg-gray-100"
              }`}
            onClick={() => setMainActiveTab("analytics")}
          >
            Analytics
          </button>
          <button
            className={`px-6 py-2 rounded-md font-medium text-sm border ${mainActiveTab === "deadlines"
                ? "bg-[#026892] text-white border-gray-200 hover:bg-[#026892]/90"
                : "bg-white text-black border-gray-200 hover:bg-gray-100"
              }`}
            onClick={() => setMainActiveTab("deadlines")}
          >
            Deadlines
          </button>
        </div>
        <button 
          className="bg-[#026892] text-white px-2 py-2 rounded-md font-medium text-sm hover:bg-[#026892]/90 w-[180px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={handleBulkApproval}
          disabled={bulkApproving || filteredData.filter(row => row.status === "Pending").length === 0}
        >
          {bulkApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Approving...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Approve All Pending
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{error}</span>
            <button
              onClick={clearError}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Mark Submissions Tab */}
      {mainActiveTab === "mark-submissions" && (
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-1">
            Lecturer Mark Submissions
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Review and manage marks submitted by department lecturers
          </p>

          <div className="flex gap-2 mb-4 items-center">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
            >
              <option>All Years</option>
              <option>Year 1</option>
              <option>Year 2</option>
              <option>Year 3</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Approved</option>
              <option>Overdue</option>
              <option>Rejected</option>
            </select>
            <div className="relative w-full max-w-xs">
              <input
                type="search"
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                placeholder="Search class, lecturer, module..."
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
              <span className="ml-2 text-gray-600">Loading module assignments...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700 font-semibold">
                        Class
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Module
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Lecturer
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Students
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Submission Date
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Deadline
                      </TableHead>
                      <TableHead className="text-gray-700 font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          {loading ? 'Loading...' : (moduleSearch || statusFilter !== "All Status" ? 'No matching results found' : 'No module assignments found')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">{row.className}</div>
                              <div className="text-xs text-gray-500">
                                {row.academicYear} • {row.semester}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">{row.moduleCode}</div>
                              <div className="text-xs text-gray-500">{row.moduleName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div>{row.lecturer}</div>
                              <div className="text-xs text-gray-500">{row.departmentName}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {row.students}/{row.maxStudents}
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {row.submissionDate}
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            {row.deadline}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(row.status)}
                          </TableCell>
                          <TableCell className="text-right flex gap-2 justify-end">
                            <button
                              className="flex items-center gap-1 text-[#0891b2] bg-[#e0f2fe] hover:bg-[#bae6fd] px-3 py-1 rounded-md text-sm font-medium"
                              onClick={() => {
                                // Store group ID and academic data in localStorage for the class page
                                localStorage.setItem('selectedGroupId', row.groupId);
                                localStorage.setItem('selectedAcademicYearId', row.academicYearId);
                                localStorage.setItem('selectedSemesterId', row.semesterId);
                                
                                router.push(
                                  `/academic/classes-marks/class/${encodeURIComponent(
                                    row.className
                                  )}/${row.academicYearId}?groupId=${row.groupId}&semesterId=${row.semesterId}`
                                );
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                              </svg>{" "}
                              View
                            </button>
                            {row.status === "Pending" && (
                              <button 
                                className="flex items-center gap-1 text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 px-3 py-1 rounded-md text-sm font-medium"
                                onClick={() => handleApproveSubmission(row.groupId, row.semesterId, row.id)}
                                disabled={approvingIds.has(row.id)}
                              >
                                {approvingIds.has(row.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <CheckCircle className="h-4 w-4" />
                                )}
                                {approvingIds.has(row.id) ? "Approving..." : "Approvety"}
                              </button>
                            )}
                            {row.status === "Overdue" && (
                              <button className="flex items-center gap-1 text-[#0891b2] bg-[#e0f2fe] hover:bg-[#bae6fd] px-3 py-1 rounded-md text-sm font-medium">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8v6m0 0l-3-3m3 3l3-3"
                                  />
                                </svg>{" "}
                                Remind
                              </button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {paginatedData.length} of {filteredData.length} filtered results ({totalElements} total)
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded-md border text-sm font-medium bg-white text-gray-700 disabled:opacity-50"
                    onClick={() => setLocalPage(p => Math.max(1, p - 1))}
                    disabled={localPage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 px-3 py-1">
                    Page {localPage} of {totalFilteredPages || 1}
                  </span>
                  <button
                    className="px-3 py-1 rounded-md border text-sm font-medium bg-white text-gray-700 disabled:opacity-50"
                    onClick={() => setLocalPage(p => Math.min(totalFilteredPages, p + 1))}
                    disabled={localPage >= totalFilteredPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
        </Card>
      )}

      {/* Analytics Tab */}
      {mainActiveTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Submission Statistics Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Submission Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Submissions:</span>
                <span className="font-semibold">
                  {submissionStatistics.totalSubmissions}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved:</span>
                <span className="font-semibold text-green-600">
                  {submissionStatistics.approved}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-orange-600">
                  {submissionStatistics.pending}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue:</span>
                <span className="font-semibold text-red-600">
                  {submissionStatistics.overdue}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected:</span>
                <span className="font-semibold text-red-600">
                  {submissionStatistics.rejected}
                </span>
              </div>
            </div>
          </Card>

          {/* Grade Distribution Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Grade Distribution
            </h3>
            <div className="space-y-3">
              {gradeDistribution.map((grade) => (
                <div
                  key={grade.grade}
                  className="flex justify-between items-center"
                >
                  <span className="text-gray-600">{grade.grade} Grades:</span>
                  <span
                    className={`font-semibold ${grade.grade === "F" ? "text-red-600" : "text-gray-900"
                      }`}
                  >
                    {grade.percentage}%
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeDistribution}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="grade" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="percentage" fill="#026892" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Department Average Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department Average
            </h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#026892] mb-2">
                {departmentStats.overallAverage}%
              </div>
              <div className="text-sm text-gray-600">
                Overall Department Average
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Highest Module Avg:</span>
                <span className="font-semibold text-green-600">{departmentStats.highestModuleAvg}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Lowest Module Avg:</span>
                <span className="font-semibold text-red-600">{departmentStats.lowestModuleAvg}%</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Deadlines Tab */}
      {mainActiveTab === "deadlines" && (
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-1">
            Mark Submission Deadlines
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            Manage and track mark submission deadlines for all modules
          </p>

          {/* Set New Deadline Section */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Set New Deadline
            </h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Module
                </label>
                <select
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                  className="w-full border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
                >
                  <option value="">Select Module</option>
                  {moduleAssignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.moduleId}>
                      {assignment.moduleCode} - {assignment.moduleName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Deadline
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDeadline}
                    onChange={(e) => setSelectedDeadline(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 text-sm text-gray-700 bg-white pr-10"
                  />
                  <svg
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
              <button className="bg-[#026892] text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-[#026892]/90">
                Set Deadline
              </button>
            </div>
          </div>

          {/* Upcoming Deadlines Section */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Deadlines
            </h3>
            <div className="space-y-3">
              {deadlinesData.map((deadline, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${deadline.status === "Overdue"
                      ? "bg-red-50 border-red-200"
                      : "bg-yellow-50 border-yellow-200"
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {deadline.module}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Instructor: {deadline.instructor}
                      </p>
                      <p className="text-sm text-gray-600">
                        Deadline: {deadline.deadline}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${deadline.status === "Overdue"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {deadline.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}