"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  ArrowLeft,
  Eye,
  Download,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useStudentEnrollments } from "@/hooks/transcripts/useAllGroups";
import { useAcademicYears } from "@/hooks/academic-year-and-semesters/useAcademicYears";
import { useSemesters } from "@/hooks/academic-year-and-semesters/useSemesters";
import { AcademicContextProvider } from "@/src/app/academicContext";

const ITEMS_PER_PAGE = 10;

export default function ClassTranscriptsPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.classId as string;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);

  // Fetch academic years and semesters
  const { years, isLoading: yearsLoading } = useAcademicYears();
  const { semesters, isLoading: semestersLoading } = useSemesters(selectedYear);

  // Set initial year and semester when data is loaded
  useEffect(() => {
    if (years?.length && !selectedYear) {
      const currentYear = years.find(
        (year) =>
          new Date(year.startDate) <= new Date() &&
          new Date(year.endDate) >= new Date()
      );
      const yearToUse = currentYear || years[0];
      setSelectedYear(yearToUse.id);
    }
  }, [years, selectedYear]);

  useEffect(() => {
    if (semesters?.length && !selectedSemester) {
      setSelectedSemester(semesters[0].id);
    }
  }, [semesters, selectedSemester]);

  useEffect(() => {
    // Set initialization complete when initial data is available
    if (years?.length > 0 && selectedYear && semesters?.length > 0 && selectedSemester) {
      setIsInitializing(false);
    }
  }, [years, selectedYear, semesters, selectedSemester]);

  const handleYearChange = (yearId: string) => {
    setSelectedYear(yearId);
    setSelectedSemester(""); // Reset semester when year changes
  };

  const handleSemesterChange = (semesterId: string) => {
    setSelectedSemester(semesterId);
  };

  // Wrap the component's content with AcademicContextProvider
  const { enrollments, isLoading, error, refetch } = useStudentEnrollments({
    groupId,
    semesterId: selectedSemester,
  });

  // Get class information from the first enrollment (since all students belong to the same group)
  const classInfo = useMemo(() => {
    if (enrollments.length === 0) return null;

    const firstEnrollment = enrollments[0];
    return {
      groupName: firstEnrollment.groupName,
      programName: firstEnrollment.programName,
      yearLevel: firstEnrollment.currentYearLevel,
      academicYear: firstEnrollment.academicYearName,
      // include the academic year id so we can pass it down to student transcript pages
      academicYearId: firstEnrollment.academicYearId,
      departmentName: firstEnrollment.departmentName || "Not specified",
    };
  }, [enrollments]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = enrollments.length;
    const activeEnrollments = enrollments.filter((e) => e.isActive).length;
    const graduatedStudents = enrollments.filter((e) => e.isGraduated).length;
    const averageGPA =
      enrollments.length > 0
        ? enrollments.reduce((sum, e) => sum + (e.cumulativeGpa || 0), 0) /
          enrollments.length
        : 0;

    // Calculate transcript completion status based on module enrollments
    let completedTranscripts = 0;
    let pendingTranscripts = 0;

    enrollments.forEach((enrollment) => {
      const hasAllModulesCompleted = enrollment.moduleEnrollments.every(
        (mod) => mod.isCompleted
      );
      if (hasAllModulesCompleted && enrollment.moduleEnrollments.length > 0) {
        completedTranscripts++;
      } else {
        pendingTranscripts++;
      }
    });

    return {
      totalStudents,
      activeEnrollments,
      graduatedStudents,
      averageGPA,
      completedTranscripts,
      pendingTranscripts,
    };
  }, [enrollments]);

  // Get enrollment status
  const getEnrollmentStatus = (enrollment: any) => {
    if (enrollment.isGraduated) return "Graduated";
    if (enrollment.isDroppedOut) return "Dropped Out";
    if (enrollment.isSuspended) return "Suspended";
    if (enrollment.isTransferred) return "Transferred";
    if (!enrollment.isActive) return "Inactive";

    // Check if all modules are completed
    const hasAllModulesCompleted = enrollment.moduleEnrollments.every(
      (mod: any) => mod.isCompleted
    );
    if (hasAllModulesCompleted && enrollment.moduleEnrollments.length > 0) {
      return "Complete";
    }

    return "Pending";
  };

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Complete":
      case "Graduated":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-orange-100 text-orange-800";
      case "Inactive":
      case "Dropped Out":
        return "bg-red-100 text-red-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Transferred":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Filter students based on search and status
  const filteredEnrollments = useMemo(() => {
    const filtered = enrollments.filter((enrollment) => {
      const matchesSearch =
        enrollment.studentFullName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.enrollmentNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.studentEmail
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const enrollmentStatus = getEnrollmentStatus(enrollment);
      const matchesStatus =
        selectedStatus === "all" ||
        enrollmentStatus.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    // Reset to page 1 when filters change
    setCurrentPage(1);

    return filtered;
  }, [enrollments, searchTerm, selectedStatus]);

  // Pagination logic
  const totalPages = Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentEnrollments = filteredEnrollments.slice(startIndex, endIndex);

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Calculate credit completion percentage
  const getCreditCompletionPercentage = (enrollment: any) => {
    if (enrollment.totalCreditsAttempted === 0) return 0;
    return Math.round(
      (enrollment.totalCreditsEarned / enrollment.totalCreditsAttempted) * 100
    );
  };

  // Show loading state during initialization or when any critical data is loading
  const showLoading = isInitializing || yearsLoading || semestersLoading || (isLoading && enrollments.length === 0);

  if (error) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
        <Button onClick={refetch} className="mt-4 bg-[#026892] hover:bg-[#026892]/90">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <AcademicContextProvider
      academicYears={years || []}
      selectedYear={selectedYear}
      academicSemesters={semesters || []}
      selectedSemester={selectedSemester}
      isLoading={yearsLoading || semestersLoading}
      error={null}
      onYearChange={handleYearChange}
      onSemesterChange={handleSemesterChange}
    >
      <div className="flex-1 p-4 md:p-6 grid gap-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center hover:cursor-pointer border-none hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classes
            </Button>
            <div>
              {showLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin text-[#026892]" />
                  <h1 className="text-2xl font-bold text-gray-900">
                    Loading...
                  </h1>
                </div>
              ) : classInfo ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {classInfo.groupName}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {classInfo.programName} - Year {classInfo.yearLevel}
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Class Not Found
                  </h1>
                  <p className="text-gray-600 mt-1">
                    No students found for this class
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Students Table */}
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Student Transcripts
            </CardTitle>
            {/* Filters and Search */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by student name, enrollment number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="graduated">Graduated</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {showLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#026892]" />
                <span className="ml-3 text-gray-600">Loading student enrollments...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student ID</TableHead>
                      <TableHead>Names</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>GPA</TableHead>
                      <TableHead>Total Credits</TableHead>
                      <TableHead>Percentage</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {showLoading ? (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8"
                        >
                          <div className="flex items-center justify-center">
                            <Loader2 className="w-6 h-6 animate-spin text-[#026892] mr-2" />
                            <span className="text-gray-600">Loading students...</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : currentEnrollments.length > 0 ? (
                      currentEnrollments.map((enrollment) => (
                        <TableRow key={enrollment.id}>
                          <TableCell className="font-medium text-gray-900">
                            {enrollment.enrollmentNumber}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {enrollment.studentFullName || "No name"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {enrollment.studentEmail || "No email"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {enrollment.cumulativeGpa
                              ? enrollment.cumulativeGpa.toFixed(1)
                              : "N/A"}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {enrollment.totalCreditsEarned}/
                            {enrollment.totalCreditsAttempted}
                          </TableCell>
                          <TableCell className="text-gray-700">
                            {getCreditCompletionPercentage(enrollment)}%
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={getStatusBadgeClass(
                                getEnrollmentStatus(enrollment)
                              )}
                            >
                              {getEnrollmentStatus(enrollment)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Link
                              href={`/students/transcripts/${groupId}/${
                                enrollment.studentId
                              }${
                                classInfo?.academicYearId
                                  ? `?yearId=${encodeURIComponent(
                                      classInfo.academicYearId
                                    )}`
                                  : ""
                              }`}
                            >
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-[#026892] hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-8 text-gray-500"
                        >
                          No students found matching your search criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>

                {/* Pagination - Always visible when there are items */}
                {filteredEnrollments.length > 0 && (
                  <div className="flex items-center justify-end gap-2 py-4 px-4 border-t border-gray-200">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={
                            currentPage === pageNum ? "secondary" : "outline"
                          }
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AcademicContextProvider>
  );
}