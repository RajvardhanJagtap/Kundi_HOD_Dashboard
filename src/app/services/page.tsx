"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, RefreshCw, Eye } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function StudentServices() {
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const router = useRouter();

  // Department options extracted from the data
  const departments = [
    "Computer Science",
    "Business Administration",
    "Civil Engineering",
    "Education",
    "Economics",
    "Medicine",
    "Law",
    "Journalism",
    "Agriculture",
    "Public Health",
    "Architecture",
    "Pharmacy",
    "Chemistry",
    "Psychology",
    "Mathematics",
    "Geography",
    "Physics",
  ];

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
  };

  const tabData = {
    pending: {
      services: [
        {
          studentId: "UR-2024-001",
          serviceType: "Academic Appeal",
          department: "Computer Science",
          school: "School of Science & Technology",
          requestDate: "2025-09-15",
          priority: "High",
        },
        {
          studentId: "UR-2024-045",
          serviceType: "Special Exam Request",
          department: "Business Administration",
          school: "School of Business",
          requestDate: "2025-09-18",
          priority: "Medium",
        },
        {
          studentId: "UR-2023-156",
          serviceType: "Hostel Application",
          department: "Civil Engineering",
          school: "School of Engineering",
          requestDate: "2025-09-16",
          priority: "Low",
        },
        {
          studentId: "UR-2024-089",
          serviceType: "Fee Waiver Request",
          department: "Education",
          school: "School of Education",
          requestDate: "2025-09-20",
          priority: "High",
        },
        {
          studentId: "UR-2022-234",
          serviceType: "Course Transfer Appeal",
          department: "Economics",
          school: "School of Business",
          requestDate: "2025-09-17",
          priority: "Medium",
        },
        {
          studentId: "UR-2024-067",
          serviceType: "Transcript Request",
          department: "Medicine",
          school: "School of Medicine",
          requestDate: "2025-09-19",
          priority: "Low",
        },
      ],
      satisfaction: [
        { name: "Processing Time", rating: "3.8/5.0", progress: 76 },
        { name: "Communication Quality", rating: "3.9/5.0", progress: 78 },
        { name: "Process Transparency", rating: "3.7/5.0", progress: 74 },
      ],
    },
    approved: {
      services: [
        {
          studentId: "UR-2024-102",
          serviceType: "Academic Appeal",
          department: "Law",
          school: "School of Law",
          approvedDate: "2025-09-10",
          status: "Completed",
        },
        {
          studentId: "UR-2024-178",
          serviceType: "Special Exam Request",
          department: "Journalism",
          school: "School of Arts & Social Sciences",
          approvedDate: "2025-09-12",
          status: "In Progress",
        },
        {
          studentId: "UR-2023-067",
          serviceType: "Hostel Application",
          department: "Agriculture",
          school: "School of Agriculture",
          approvedDate: "2025-09-08",
          status: "Completed",
        },
        {
          studentId: "UR-2024-134",
          serviceType: "Fee Waiver Request",
          department: "Public Health",
          school: "School of Public Health",
          approvedDate: "2025-09-11",
          status: "Completed",
        },
        {
          studentId: "UR-2023-089",
          serviceType: "Transcript Request",
          department: "Architecture",
          school: "School of Engineering",
          approvedDate: "2025-09-13",
          status: "Completed",
        },
        {
          studentId: "UR-2024-156",
          serviceType: "Medical Leave Appeal",
          department: "Pharmacy",
          school: "School of Medicine",
          approvedDate: "2025-09-09",
          status: "In Progress",
        },
      ],
      satisfaction: [
        { name: "Service Delivery", rating: "4.3/5.0", progress: 86 },
        { name: "Resolution Quality", rating: "4.1/5.0", progress: 82 },
        { name: "Student Satisfaction", rating: "4.2/5.0", progress: 84 },
      ],
    },
    rejected: {
      services: [
        {
          studentId: "UR-2024-203",
          serviceType: "Academic Appeal",
          department: "Chemistry",
          school: "School of Science & Technology",
          rejectedDate: "2025-09-14",
          reason: "Insufficient evidence",
        },
        {
          studentId: "UR-2023-145",
          serviceType: "Special Exam Request",
          department: "Psychology",
          school: "School of Arts & Social Sciences",
          rejectedDate: "2025-09-16",
          reason: "Late submission",
        },
        {
          studentId: "UR-2024-078",
          serviceType: "Fee Waiver Request",
          department: "Mathematics",
          school: "School of Science & Technology",
          rejectedDate: "2025-09-15",
          reason: "Does not meet criteria",
        },
        {
          studentId: "UR-2024-190",
          serviceType: "Course Transfer Appeal",
          department: "Geography",
          school: "School of Arts & Social Sciences",
          rejectedDate: "2025-09-17",
          reason: "No available slots",
        },
        {
          studentId: "UR-2023-234",
          serviceType: "Hostel Application",
          department: "Physics",
          school: "School of Science & Technology",
          rejectedDate: "2025-09-13",
          reason: "Accommodation full",
        },
      ],
      satisfaction: [
        { name: "Rejection Rationale", rating: "3.8/5.0", progress: 76 },
        { name: "Appeal Process Info", rating: "3.6/5.0", progress: 72 },
        { name: "Resubmission Guidance", rating: "3.9/5.0", progress: 78 },
      ],
    },
  };

  const currentData = tabData[activeTab as keyof typeof tabData];

  // Filter function - simplified to only use search and department
  const filteredServices = currentData.services.filter((service: any) => {
    const matchesSearch =
      !searchQuery ||
      service.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.department.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      !selectedDepartment ||
      selectedDepartment === "all" ||
      service.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedServices = filteredServices.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedDepartment, activeTab]);

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-black mb-2">
          Department Services Management
        </h1>
        <p className="text-gray-600 mt-1">
          Comprehensive oversight of college affairs and academic progress
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mt-6 mb-6">
        <nav className="-mb-px flex space-x-8">
          {Object.entries(tabData).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === key
                  ? "border-[#026892] text-[#026892] hover:cursor-pointer"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:cursor-pointer"
              }`}
            >
              {key}
            </button>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent>
            <div>
              {/* Filters Section */}
              <div className="mt-6 mb-6 space-y-4">
                {/* Search and Department Filter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search by Student ID, Service Type, Department..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  {/* Department Filter */}
                  <Select
                    value={selectedDepartment}
                    onValueChange={setSelectedDepartment}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((department) => (
                        <SelectItem key={department} value={department}>
                          {department}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Services Table */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold text-black">
                  Service Requests Details
                </h4>
                <div className="overflow-x-auto">
                  <div className="bg-white rounded-lg shadow-sm border">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Student ID
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Service Type
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Department
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            School
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            {activeTab === "pending"
                              ? "Request Date"
                              : activeTab === "approved"
                              ? "Approved Date"
                              : "Rejected Date"}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            {activeTab === "pending"
                              ? "Priority"
                              : activeTab === "approved"
                              ? "Status"
                              : "Reason"}
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedServices.length > 0 ? (
                          paginatedServices.map(
                            (service: any, index: number) => (
                              <tr
                                key={index}
                                className="hover:bg-gray-50 transition-colors"
                              >
                                <td className="px-4 py-3 text-sm font-mono text-black">
                                  {service.studentId}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {service.serviceType}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {service.department}
                                </td>
                                <td className="px-4 py-3 text-sm text-[#026892]">
                                  {service.school}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-600">
                                  {(service as any).requestDate ||
                                    (service as any).approvedDate ||
                                    (service as any).rejectedDate}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {activeTab === "pending" && (
                                    <span
                                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                        (service as any).priority === "High"
                                          ? "bg-red-100 text-red-800"
                                          : (service as any).priority ===
                                            "Medium"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-green-100 text-[#026892]"
                                      }`}
                                    >
                                      {(service as any).priority}
                                    </span>
                                  )}
                                  {activeTab === "approved" && (
                                    <span
                                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                                        (service as any).status === "Completed"
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-[#026892]"
                                      }`}
                                    >
                                      {(service as any).status}
                                    </span>
                                  )}
                                  {activeTab === "rejected" && (
                                    <span className="text-red-600 text-xs">
                                      {(service as any).reason}
                                    </span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/services/${service.studentId}`)}
                                    className="text-[#026892] hover:bg-blue-50"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                </td>
                              </tr>
                            )
                          )
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No service requests match the current filters
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pagination and Record Count */}
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-600 whitespace-nowrap">
                    Showing {startIndex + 1} to{" "}
                    {Math.min(
                      startIndex + itemsPerPage,
                      filteredServices.length
                    )}{" "}
                    of {filteredServices.length} requests
                  </div>

                  <div className="ml-auto">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              setCurrentPage(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: Math.max(1, totalPages) },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => setCurrentPage(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              setCurrentPage(
                                Math.min(
                                  Math.max(1, totalPages),
                                  currentPage + 1
                                )
                              )
                            }
                            className={
                              currentPage === totalPages || totalPages <= 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
