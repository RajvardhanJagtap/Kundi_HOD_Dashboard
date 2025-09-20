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
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import { useModuleSubmissionDetails } from "@/hooks/modules/useModuleAssignments";

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

// Helper function to generate consistent status based on assignment ID
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

  // API Hook - fetch submission details instead of module assignments
  const {
    data: submissionDetails,
    loading,
    error,
    clearError,
    refetch,
    fetchAllSubmissionDetails
  } = useModuleSubmissionDetails();

  // Fetch submission details on component mount
  React.useEffect(() => {
    fetchAllSubmissionDetails();
  }, [fetchAllSubmissionDetails]);

  // Module Table State
  const [moduleSearch, setModuleSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Status");
  const [modulePage, setModulePage] = React.useState(1);
  const router = useRouter();

  // Transform submission details data to match table format - memoized to prevent recalculation
  const transformedData = React.useMemo(() => {
    return submissionDetails.map(submission => {
      // Safe access with defaults for potentially null/undefined properties
      const catSubmission = submission.catSubmission || {
        isSubmitted: false,
        statusDisplay: "Not Submitted",
        submittedAt: null
      };
      
      const examSubmission = submission.examSubmission || {
        isSubmitted: false,
        statusDisplay: "Not Submitted", 
        submittedAt: null
      };
      
      const overallSubmission = submission.overallSubmission || {
        statusDisplay: "Not Available",
        status: "NOT_AVAILABLE"
      };

      return {
        id: submission.moduleAssignmentId,
        lecturer: submission.lecturerName || "Unknown",
        lecturerId: submission.lecturerId || "",
        module: `${submission.moduleCode || "Unknown"} - ${submission.moduleName || "Unknown"}`,
        moduleCode: submission.moduleCode || "Unknown",
        moduleName: submission.moduleName || "Unknown",
        groupName: submission.groupName || "Unknown",
        groupCode: submission.groupCode || "",
        semester: submission.semesterName || "Unknown",
        catSubmission,
        examSubmission,
        overallSubmission,
        // Helper properties for display
        canViewCat: catSubmission.isSubmitted && catSubmission.statusDisplay === "Submitted",
        canViewExam: examSubmission.isSubmitted && examSubmission.statusDisplay === "Submitted",
        catStatus: catSubmission.statusDisplay,
        examStatus: examSubmission.statusDisplay,
        overallStatus: overallSubmission.statusDisplay,
      };
    });
  }, [submissionDetails]);

  // Filter data based on search and status - memoized
  const filteredData = React.useMemo(() => {
    return transformedData.filter(row => {
      const matchesSearch = 
        row.lecturer.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        row.module.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        row.moduleCode.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        row.groupName.toLowerCase().includes(moduleSearch.toLowerCase());
      
      const matchesStatus = statusFilter === "All Status" || 
        row.overallStatus === statusFilter ||
        row.catStatus === statusFilter ||
        row.examStatus === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [transformedData, moduleSearch, statusFilter]);

  // Local pagination for filtered data
  const modulePageSize = 4;
  const moduleTotalPages = Math.ceil(filteredData.length / modulePageSize);
  const modulePaginatedData = filteredData.slice(
    (modulePage - 1) * modulePageSize,
    modulePage * modulePageSize
  );

  // Reset local pagination when search or filter changes
  React.useEffect(() => {
    setModulePage(1);
  }, [moduleSearch, statusFilter]);

  // Deadlines state
  const [selectedModule, setSelectedModule] = React.useState("");
  const [selectedDeadline, setSelectedDeadline] = React.useState("");

  // Extract module assignments for the deadlines dropdown
  const moduleAssignments = React.useMemo(() => {
    // Remove duplicates by moduleAssignmentId
    const seen = new Set<string>();
    return submissionDetails
      .filter((submission) => {
        if (!submission.moduleAssignmentId || seen.has(submission.moduleAssignmentId)) return false;
        seen.add(submission.moduleAssignmentId);
        return true;
      })
      .map((submission) => ({
        id: submission.moduleAssignmentId,
        moduleId: submission.moduleAssignmentId,
        moduleCode: submission.moduleCode || "Unknown",
        moduleName: submission.moduleName || "Unknown",
      }));
  }, [submissionDetails]);

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
            className={`px-6 py-2 rounded-md font-medium text-sm border ${
              mainActiveTab === "mark-submissions"
                ? "bg-[#026892] text-white border-gray-200 hover:bg-[#026892]/90"
                : "bg-white text-black border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => setMainActiveTab("mark-submissions")}
          >
            Mark Submissions
          </button>
          <button 
            className={`px-6 py-2 rounded-md font-medium text-sm border ${
              mainActiveTab === "analytics"
                ? "bg-[#026892] text-white border-gray-200 hover:bg-[#026892]/90"
                : "bg-white text-black border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => setMainActiveTab("analytics")}
          >
            Analytics
          </button>
          <button 
            className={`px-6 py-2 rounded-md font-medium text-sm border ${
              mainActiveTab === "deadlines"
                ? "bg-[#026892] text-white border-gray-200 hover:bg-[#026892]/90"
                : "bg-white text-black border-gray-200 hover:bg-gray-100"
            }`}
            onClick={() => setMainActiveTab("deadlines")}
          >
            Deadlines
          </button>
        </div>
        <button className="bg-[#026892] text-white px-2 py-2 rounded-md font-medium text-sm hover:bg-[#026892]/90 w-[180px]">
          Export All Marks
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
                placeholder="Search lecturer, module..."
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
              <span className="ml-2 text-gray-600">Loading submission details...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-gray-700 font-semibold">Lecturer</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Module</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Group</TableHead>
                      <TableHead className="text-gray-700 font-semibold">CAT Status</TableHead>
                      <TableHead className="text-gray-700 font-semibold">EXAM Status</TableHead>
                      <TableHead className="text-gray-700 font-semibold">Overall Status</TableHead>
                      <TableHead className="text-right text-gray-700 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {modulePaginatedData.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          {loading ? 'Loading...' : (moduleSearch || statusFilter !== "All Status" ? 'No matching results found' : 'No module assignments found')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      modulePaginatedData.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">{row.lecturer}</div>
                              <div className="text-xs text-gray-500">ID: {row.lecturerId}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">{row.moduleCode}</div>
                              <div className="text-xs text-gray-500 max-w-xs truncate">{row.moduleName}</div>
                              <div className="text-xs text-gray-400">{row.semester}</div>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-700 text-sm">
                            <div>
                              <div className="font-medium">{row.groupName}</div>
                              <div className="text-xs text-gray-500">{row.groupCode}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={row.catSubmission.isSubmitted ? "default" : "secondary"}
                              className={`text-xs ${
                                row.catSubmission.isSubmitted 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {row.catStatus}
                            </Badge>
                            {row.catSubmission.submittedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(row.catSubmission.submittedAt).toLocaleDateString()}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={row.examSubmission.isSubmitted ? "default" : "secondary"}
                              className={`text-xs ${
                                row.examSubmission.isSubmitted 
                                  ? 'bg-green-100 text-green-700' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {row.examStatus}
                            </Badge>
                            {row.examSubmission.submittedAt && (
                              <div className="text-xs text-gray-500 mt-1">
                                {new Date(row.examSubmission.submittedAt).toLocaleDateString()}
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={row.overallSubmission.status === "APPROVED" ? "default" : "secondary"}
                              className={`text-xs ${
                                row.overallSubmission.status === "APPROVED"
                                  ? 'bg-blue-100 text-blue-700'
                                  : row.overallSubmission.status === "PENDING"
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}
                            >
                              {row.overallStatus}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right flex gap-2 justify-end">
                            {(row.canViewCat || row.canViewExam) && (
                              <button
                                className="flex items-center gap-1 text-[#0891b2] bg-[#e0f2fe] hover:bg-[#bae6fd] px-3 py-1 rounded-md text-sm font-medium"
                                onClick={() =>
                                  router.push(
                                    `/academic/marks-submitted/results?moduleId=${encodeURIComponent(
                                      row.id
                                    )}`
                                  )
                                }
                              >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-4 h-4"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                              </svg>
                              View Marks
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
                  Showing {modulePaginatedData.length} of {filteredData.length} filtered results ({submissionDetails.length} total)
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded-md border text-sm font-medium bg-white text-gray-700 disabled:opacity-50"
                    onClick={() => setModulePage((p) => Math.max(1, p - 1))}
                    disabled={modulePage === 1}
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600 px-3 py-1">
                    Page {modulePage} of {moduleTotalPages || 1}
                  </span>
                  <button
                    className="px-3 py-1 rounded-md border text-sm font-medium bg-white text-gray-700 disabled:opacity-50"
                    onClick={() => setModulePage((p) => Math.min(moduleTotalPages, p + 1))}
                    disabled={modulePage >= moduleTotalPages}
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Submission Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Submissions:</span>
                <span className="font-semibold">{submissionStatistics.totalSubmissions}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Approved:</span>
                <span className="font-semibold text-green-600">{submissionStatistics.approved}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending:</span>
                <span className="font-semibold text-orange-600">{submissionStatistics.pending}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Overdue:</span>
                <span className="font-semibold text-red-600">{submissionStatistics.overdue}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rejected:</span>
                <span className="font-semibold text-red-600">{submissionStatistics.rejected}</span>
              </div>
            </div>
          </Card>

          {/* Grade Distribution Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
            <div className="space-y-3">
              {gradeDistribution.map((grade) => (
                <div key={grade.grade} className="flex justify-between items-center">
                  <span className="text-gray-600">{grade.grade} Grades:</span>
                  <span className={`font-semibold ${grade.grade === 'F' ? 'text-red-600' : 'text-gray-900'}`}>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Average</h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#026892] mb-2">
                {departmentStats.overallAverage}%
              </div>
              <div className="text-sm text-gray-600">Overall Department Average</div>
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Set New Deadline</h3>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Module</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
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
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Deadlines</h3>
            <div className="space-y-3">
              {deadlinesData.map((deadline, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border ${
                    deadline.status === "Overdue" 
                      ? "bg-red-50 border-red-200" 
                      : "bg-yellow-50 border-yellow-200"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold text-gray-900">{deadline.module}</h4>
                      <p className="text-sm text-gray-600">Instructor: {deadline.instructor}</p>
                      <p className="text-sm text-gray-600">Deadline: {deadline.deadline}</p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        deadline.status === "Overdue"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
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