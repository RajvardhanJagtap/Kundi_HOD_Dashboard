"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  Eye,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
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
import { useTranscripts } from "@/hooks/transcripts/useAllGroups";

const ITEMS_PER_PAGE = 10;

export default function TranscriptsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isInitializing, setIsInitializing] = useState(true);

  // TODO: Get academicYearId from your system - you can replace this with actual implementation
  // For now, I'm using the hardcoded value from your example
  const { groups, isLoading, error, refetch } = useTranscripts({
    academicYearId,
  });

  // Get unique departments and year levels for filters
  const departments = useMemo(() => {
    const uniqueDepartments = Array.from(
      new Set(groups.map((group) => group.departmentName).filter(Boolean))
    );
    return uniqueDepartments;
  }, [groups]);

  const yearLevels = useMemo(() => {
    const uniqueYears = Array.from(
      new Set(groups.map((group) => group.yearLevel).filter(Boolean))
    ).sort((a, b) => a - b);
    return uniqueYears;
  }, [groups]);

  useEffect(() => {
    // Enhanced localStorage access with fallbacks for better browser compatibility
    const getStorageItem = (key: string): string | null => {
      if (typeof window === "undefined") return null;

      try {
        return localStorage.getItem(key);
      } catch (localStorageError) {
        console.warn(
          `localStorage not available for ${key}, trying sessionStorage:`,
          localStorageError
        );
        try {
          return sessionStorage.getItem(key);
        } catch (sessionStorageError) {
          console.warn(
            `sessionStorage also not available for ${key}:`,
            sessionStorageError
          );
          return null;
        }
      }
    };

    // Get academic year ID from storage
    const updateFromStorage = () => {
      const urlAcademicYearId = getStorageItem("selectedAcademicYearId");
      const storedYear = getStorageItem("selectedAcademicYear");

      const newAcademicYearId = urlAcademicYearId && urlAcademicYearId.trim().length > 0
        ? urlAcademicYearId.trim()
        : storedYear && storedYear.trim().length > 0
        ? storedYear.trim()
        : null;

      // Only update if the value has actually changed
      if (newAcademicYearId && newAcademicYearId !== academicYearId) {
        setAcademicYearId(newAcademicYearId);
      } else if (!newAcademicYearId && academicYearId) {
        // Clear if no academic year found
        setAcademicYearId("");
        console.warn("No academic year ID found in storage");
      }
    };

    // Initial load
    updateFromStorage();
    setIsInitializing(false);

    // Listen for academic year changes from header
    const handleAcademicYearChange = () => {
      updateFromStorage();
    };

    window.addEventListener('academicYearChanged', handleAcademicYearChange);

    return () => {
      window.removeEventListener('academicYearChanged', handleAcademicYearChange);
    };
  }, []);

  // Filter data based on search and selections
  const filteredGroups = useMemo(() => {
    const filtered = groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.departmentName &&
          group.departmentName
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        group.code.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" ||
        group.departmentName === selectedDepartment;
      const matchesYear =
        selectedYear === "all" || group.yearLevel.toString() === selectedYear;

      return matchesSearch && matchesDepartment && matchesYear;
    });
    
    // Reset to page 1 when filters change
    setCurrentPage(1);
    
    return filtered;
  }, [groups, searchTerm, selectedDepartment, selectedYear]);

  // Pagination logic
  const totalPages = Math.ceil(filteredGroups.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentGroups = filteredGroups.slice(startIndex, endIndex);

  // Calculate statistics
  const totalStudents = groups.reduce(
    (sum, group) => sum + (group.currentEnrollment || 0),
    0
  );
  const totalCapacity = groups.reduce(
    (sum, group) => sum + (group.capacity || 0),
    0
  );
  const activeGroups = groups.filter((group) => group.isActive).length;

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status based on group data
  const getGroupStatus = (group: any) => {
    if (!group.isActive) return "Inactive";
    if (group.isFull) return "Full";
    return "Active";
  };

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Full":
        return "bg-red-100 text-red-800";
      case "Active":
        return "bg-green-100 text-green-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-blue-100 text-blue-800";
    }
  };

  // Show loading skeleton only during initialization
  const showLoading = isInitializing || isLoading;

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
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Academic Transcripts
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and view student transcripts by class groups
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Groups
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {showLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    groups.length
                  )}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Active: {activeGroups}</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-[#026892]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Students
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {showLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    totalStudents
                  )}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Current enrollment</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Capacity
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {showLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    totalCapacity
                  )}
                </h3>
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Maximum enrollment</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Utilization
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {showLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                  ) : (
                    `${
                      totalCapacity > 0
                        ? Math.round((totalStudents / totalCapacity) * 100)
                        : 0
                    }%`
                  )}
                </h3>
                <div className="flex items-center gap-1 text-sm text-purple-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Enrollment rate</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Groups Table */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900">
            Academic Groups
          </CardTitle>
          {/* Filters and search */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by group name, code, or department..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept || ""}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-full sm:w-[150px]">
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {yearLevels.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    Year {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {showLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#026892]" />
              <span className="ml-3 text-gray-600">Loading academic groups...</span>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Group Name</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Year Level</TableHead>
                    <TableHead>Enrollment</TableHead>
                    <TableHead>Capacity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentGroups.length > 0 ? (
                    currentGroups.map((group) => (
                      <TableRow key={group.id}>
                        <TableCell className="font-medium text-gray-900">
                          {group.name}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {group.code}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {group.departmentName || "-"}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          Year {group.yearLevel}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {group.currentEnrollment || 0}
                        </TableCell>
                        <TableCell className="text-gray-700">
                          {group.capacity}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={getStatusBadgeClass(
                              getGroupStatus(group)
                            )}
                          >
                            {getGroupStatus(group)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link
                            href={`/students/transcripts/${group.id}${
                              academicYearId
                                ? `?yearId=${encodeURIComponent(
                                    academicYearId
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
                        No academic groups found matching your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>

              {/* Pagination - Always visible when there are items */}
              {filteredGroups.length > 0 && (
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
  );
}