"use client";
import React from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useSemesters } from "@/hooks/academic-year-and-semesters/useSemesters";
import { useAcademicYears } from "@/hooks/academic-year-and-semesters/useAcademicYears";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  CheckSquare,
} from "lucide-react";
import {
  useDepartmentGroupReadiness,
  useModuleSubmissionDetails,
} from "@/hooks/modules/useModuleAssignments";
import { submitToDean } from "@/lib/module-marks/grading-api";
import { useToast } from "@/hooks/use-toast";

export default function MarksSubmittedPage() {
  // Main tabs: 'mark-submissions', 'analytics', 'deadlines'
  const [mainActiveTab, setMainActiveTab] = React.useState("mark-submissions");

  // State for semester selection using the semester hooks
  const { years: academicYears, isLoading: yearsLoading } = useAcademicYears();
  const [currentAcademicYearId, setCurrentAcademicYearId] =
    React.useState<string>("");
  const { semesters, isLoading: semestersLoading } = useSemesters(
    currentAcademicYearId
  );
  const [selectedSemesterId, setSelectedSemesterId] =
    React.useState<string>("");

  // Set current academic year when years are loaded
  React.useEffect(() => {
    if (academicYears && academicYears.length > 0) {
      // Find the current academic year
      const currentYear = academicYears.find(
        (year) =>
          year.startDate <= new Date().toISOString() &&
          year.endDate >= new Date().toISOString()
      );
      setCurrentAcademicYearId(currentYear?.id || academicYears[0].id);
    }
  }, [academicYears]);

  // Set initial semester ID when semesters are loaded
  React.useEffect(() => {
    if (semesters && semesters.length > 0) {
      setSelectedSemesterId(semesters[0].id);
      fetchGroupReadiness(semesters[0].id);
    }
  }, [semesters]);

  // Use the department group readiness hook for HOD view
  const {
    data: groupReadinessData,
    loading: groupsLoading,
    error: groupsError,
    totalGroups,
    readyGroups,
    partiallyReadyGroups,
    notReadyGroups,
    overallReadinessPercentage,
    summary,
    fetchGroupReadiness,
    clearError: clearGroupsError,
  } = useDepartmentGroupReadiness(selectedSemesterId);

  // Module submission details hook for detailed view
  const {
    data: submissionDetails,
    loading: submissionsLoading,
    error: submissionsError,
    fetchAllSubmissionDetails,
    clearError: clearSubmissionsError,
  } = useModuleSubmissionDetails();

  // Table State
  const [moduleSearch, setModuleSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("All Status");
  const [yearFilter, setYearFilter] = React.useState("All Years");
  const [localPage, setLocalPage] = React.useState(1);
  const [approvingIds, setApprovingIds] = React.useState<Set<string>>(
    new Set()
  );
  const [bulkApproving, setBulkApproving] = React.useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Handle approval of submission to dean
  const handleApproveSubmission = async (
    groupId: string,
    semesterId: string,
    groupCode: string
  ) => {
    setApprovingIds((prev) => new Set(prev).add(groupId));

    try {
      await submitToDean(groupId, semesterId);

      toast({
        title: "Success!",
        description: `Marks for ${groupCode} have been successfully submitted to the dean for approval.`,
        variant: "default",
      });

      // Refresh the group readiness data
      await fetchGroupReadiness(selectedSemesterId);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to submit marks to dean. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApprovingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(groupId);
        return newSet;
      });
    }
  };

  // Handle bulk approval of all ready groups
  const handleBulkApproval = async () => {
    const readyGroups = filteredGroups.filter(
      (group) =>
        group.readinessStatus === "READY" &&
        group.canBeSubmittedToDean &&
        !group.isSubmittedToDean
    );

    if (readyGroups.length === 0) {
      toast({
        title: "No Groups Ready",
        description: "There are no groups ready to be submitted to the dean.",
        variant: "default",
      });
      return;
    }

    setBulkApproving(true);
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    for (const group of readyGroups) {
      try {
        await submitToDean(group.groupId, group.semesterId);
        successCount++;
      } catch (error: any) {
        errorCount++;
        errors.push(`${group.groupCode}: ${error.message}`);
      }
    }

    setBulkApproving(false);

    // Show results
    if (successCount > 0 && errorCount === 0) {
      toast({
        title: "Success!",
        description: `Successfully submitted ${successCount} group${
          successCount > 1 ? "s" : ""
        } to the dean.`,
        variant: "default",
      });
    } else if (successCount > 0 && errorCount > 0) {
      toast({
        title: "Partial Success",
        description: `Submitted ${successCount} groups. ${errorCount} failed. Check individual items for details.`,
        variant: "default",
      });
    } else {
      toast({
        title: "Error",
        description: `Failed to submit any groups. ${errors
          .slice(0, 2)
          .join(", ")}${errors.length > 2 ? "..." : ""}`,
        variant: "destructive",
      });
    }

    // Refresh data after bulk approval
    await fetchGroupReadiness(selectedSemesterId);
  };

  // Filter groups based on search and filters
  const filteredGroups = React.useMemo(() => {
    return groupReadinessData.filter((group) => {
      const matchesSearch =
        group.groupName.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        group.groupCode.toLowerCase().includes(moduleSearch.toLowerCase()) ||
        group.programName.toLowerCase().includes(moduleSearch.toLowerCase());

      const matchesStatus =
        statusFilter === "All Status" ||
        (statusFilter === "Ready" && group.readinessStatus === "READY") ||
        (statusFilter === "Partial" && group.readinessStatus === "PARTIAL") ||
        (statusFilter === "Not Ready" &&
          group.readinessStatus === "NOT_READY") ||
        (statusFilter === "Submitted" && group.isSubmittedToDean);

      const matchesYear =
        yearFilter === "All Years" ||
        (yearFilter === `Year ${group.yearLevel}` &&
          group.yearLevel.toString() === yearFilter.replace("Year ", ""));

      return matchesSearch && matchesStatus && matchesYear;
    });
  }, [groupReadinessData, moduleSearch, statusFilter, yearFilter]);

  // Local pagination for filtered data
  const pageSize = 10;
  const totalFilteredPages = Math.ceil(filteredGroups.length / pageSize);
  const paginatedGroups = filteredGroups.slice(
    (localPage - 1) * pageSize,
    localPage * pageSize
  );

  // Reset local page when filters change
  React.useEffect(() => {
    setLocalPage(1);
  }, [moduleSearch, statusFilter, yearFilter]);

  // Analytics data based on group readiness
  const analyticsData = React.useMemo(() => {
    const pieData = [
      { name: "Ready", value: readyGroups, color: "#22c55e" },
      { name: "Partial", value: partiallyReadyGroups, color: "#eab308" },
      { name: "Not Ready", value: notReadyGroups, color: "#ef4444" },
    ];

    const submissionStats = {
      totalGroups,
      ready: readyGroups,
      partial: partiallyReadyGroups,
      notReady: notReadyGroups,
      submitted: groupReadinessData.filter((g) => g.isSubmittedToDean).length,
    };

    return { pieData, submissionStats };
  }, [
    groupReadinessData,
    totalGroups,
    readyGroups,
    partiallyReadyGroups,
    notReadyGroups,
  ]);

  const renderStatusBadge = (group: any) => {
    const getStatusConfig = () => {
      if (group.isSubmittedToDean) {
        return {
          className: "bg-blue-100 text-[#026892]/90",
          icon: <CheckSquare className="h-4 w-4" />,
          text: "Submitted to Dean",
        };
      }

      switch (group.readinessStatus) {
        case "READY":
          return {
            className: "bg-green-100 text-green-700",
            icon: <CheckCircle className="h-4 w-4" />,
            text: "Ready",
          };
        case "PARTIALLY_READY":
          return {
            className: "bg-yellow-100 text-yellow-700",
            icon: <Clock className="h-4 w-4" />,
            text: "Partial",
          };
        case "NOT_READY":
          return {
            className: "bg-red-100 text-red-700",
            icon: <AlertCircle className="h-4 w-4" />,
            text: "Not Ready",
          };
        default:
          return {
            className: "bg-gray-100 text-gray-700",
            icon: <Clock className="h-4 w-4" />,
            text: "Unknown",
          };
      }
    };

    const config = getStatusConfig();

    return (
      <span
        className={`${config.className} px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 w-fit`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  return (
    <div className="p-2">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Marks Management
      </h1>
      <p className="text-gray-600 text-base mb-2">
        Review and manage marks submitted by department lecturers
      </p>

      <div className="flex items-center justify-between mb-4 mt-4">
        <div className="flex items-end gap-6 w-full border-b border-gray-200">
          <button
            className={`inline-flex items-center whitespace-nowrap px-2 py-3 text-sm font-medium transition-colors ${
              mainActiveTab === "mark-submissions"
                ? "text-[#026892] border-b-2 border-[#026892]"
                : "text-gray-600"
            }`}
            onClick={() => setMainActiveTab("mark-submissions")}
          >
            All Submissions
          </button>
          <button
            className={`inline-flex items-center whitespace-nowrap px-2 py-3 text-sm font-medium transition-colors ${
              mainActiveTab === "analytics"
                ? "text-[#026892] border-b-2 border-[#026892]"
                : "text-gray-600"
            }`}
            onClick={() => setMainActiveTab("analytics")}
          >
            Analytics
          </button>
        </div>
        <button
          className="bg-[#026892] text-white px-2 py-2 rounded-md font-medium text-sm hover:bg-[#026892]/90 w-[180px] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          onClick={handleBulkApproval}
          disabled={
            bulkApproving ||
            filteredGroups.filter(
              (g) =>
                g.readinessStatus === "READY" &&
                g.canBeSubmittedToDean &&
                !g.isSubmittedToDean
            ).length === 0
          }
        >
          {bulkApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              Submit All Ready
            </>
          )}
        </button>
      </div>

      {/* Error Display */}
      {(groupsError || submissionsError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          <div className="flex justify-between items-center">
            <span>{groupsError || submissionsError}</span>
            <button
              onClick={() => {
                clearGroupsError();
                clearSubmissionsError();
              }}
              className="text-red-700 hover:text-red-900"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Group Readiness Tab */}
      {mainActiveTab === "mark-submissions" && (
        <Card className="p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-black mb-1">
            Department Group Readiness
          </h2>
          <p className="text-gray-600 text-sm mb-4">
            Review and manage the readiness status of groups in your department
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
              <option>Year 4</option>
              <option>Year 5</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm text-gray-700 bg-white"
            >
              <option>All Status</option>
              <option>Ready</option>
              <option>Partial</option>
              <option>Not Ready</option>
              <option>Submitted</option>
            </select>
            <div className="relative w-full max-w-xs">
              <input
                type="search"
                value={moduleSearch}
                onChange={(e) => setModuleSearch(e.target.value)}
                placeholder="Search group, program..."
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

          {groupsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-[#026892]" />
              <span className="ml-2 text-gray-600">
                Loading group readiness data...
              </span>
            </div>
          ) : (
            <>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Group
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Program
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Year Level
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Progress
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Modules
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedGroups.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-8 text-center text-gray-500"
                        >
                          {groupsLoading
                            ? "Loading..."
                            : moduleSearch || statusFilter !== "All Status"
                            ? "No matching results found"
                            : "No groups found"}
                        </td>
                      </tr>
                    ) : (
                      paginatedGroups.map((group) => (
                        <tr key={group.groupId} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div>
                              <div className="font-medium">
                                {group.groupName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {group.groupCode}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div>
                              <div className="font-medium">
                                {group.programName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {group.programCode}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            Year {group.yearLevel}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-[#026892] h-2 rounded-full"
                                  style={{
                                    width: `${group.progressPercentage}%`,
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs whitespace-nowrap">
                                {group.progressPercentage}%
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {group.completedModules}/{group.totalModules}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {renderStatusBadge(group)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 text-right">
                            <div className="flex gap-2 justify-end">
                              <button
                                className="flex items-center gap-1 text-[#0891b2] bg-[#e0f2fe] hover:bg-[#bae6fd] px-3 py-1 rounded-md text-sm font-medium"
                                onClick={() => {
                                  // Store necessary data in localStorage for the class page
                                  if (typeof window !== "undefined") {
                                    localStorage.setItem("selectedGroupId", group.groupId);
                                    localStorage.setItem("selectedSemesterId", group.semesterId);
                                    localStorage.setItem("selectedAcademicYearId", currentAcademicYearId);
                                    localStorage.setItem("selectedAcademicYear", currentAcademicYearId);
                                    localStorage.setItem("selectedSemester", group.semesterId);
                                  }
                                  
                                  // Navigate to group details page
                                  router.push(
                                    `/academic/classes-marks/class/${encodeURIComponent(
                                      group.groupName
                                    )}/${group.semesterId}?groupId=${
                                      group.groupId
                                    }&semesterId=${group.semesterId}&academicYearId=${currentAcademicYearId}`
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
                                </svg>
                                View Details
                              </button>
                              {group.readinessStatus === "READY" &&
                                group.canBeSubmittedToDean &&
                                !group.isSubmittedToDean && (
                                  <button
                                    className="flex items-center gap-1 text-white bg-[#026892] hover:bg-[#026892]/90 disabled:bg-[#026892]/40 px-3 py-1 rounded-md text-sm font-medium"
                                    onClick={() =>
                                      handleApproveSubmission(
                                        group.groupId,
                                        group.semesterId,
                                        group.groupCode
                                      )
                                    }
                                    disabled={approvingIds.has(group.groupId)}
                                  >
                                    {approvingIds.has(group.groupId) ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                    {approvingIds.has(group.groupId)
                                      ? "Submitting..."
                                      : "Submit to Dean"}
                                  </button>
                                )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-between items-center mt-4">
                <div className="text-sm text-gray-600">
                  Showing {paginatedGroups.length} of {filteredGroups.length}{" "}
                  filtered results ({totalGroups} total)
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
      )}

      {/* Analytics Tab */}
      {mainActiveTab === "analytics" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Group Readiness Statistics Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Group Readiness Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Groups:</span>
                <span className="font-semibold">
                  {analyticsData.submissionStats.totalGroups}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ready:</span>
                <span className="font-semibold text-green-600">
                  {analyticsData.submissionStats.ready}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Partially Ready:</span>
                <span className="font-semibold text-yellow-600">
                  {analyticsData.submissionStats.partial}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Not Ready:</span>
                <span className="font-semibold text-red-600">
                  {analyticsData.submissionStats.notReady}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Submitted to Dean:</span>
                <span className="font-semibold text-[#026892]">
                  {analyticsData.submissionStats.submitted}
                </span>
              </div>
            </div>
          </Card>

          {/* Readiness Distribution Chart */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Readiness Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {analyticsData.pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Department Progress Card */}
          <Card className="p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Department Progress
            </h3>
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-[#026892] mb-2">
                {overallReadinessPercentage}%
              </div>
              <div className="text-sm text-gray-600">
                Overall Department Readiness
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Ready Groups:</span>
                <span className="font-semibold text-green-600">
                  {Math.round((readyGroups / totalGroups) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Partial Groups:</span>
                <span className="font-semibold text-yellow-600">
                  {Math.round((partiallyReadyGroups / totalGroups) * 100)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Not Ready Groups:</span>
                <span className="font-semibold text-red-600">
                  {Math.round((notReadyGroups / totalGroups) * 100)}%
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
