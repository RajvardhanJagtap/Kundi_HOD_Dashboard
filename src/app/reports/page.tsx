"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { FileBarChart, Download, Eye, Calendar, Search, Filter, Users, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react"

export default function ReportsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const reports = [
    {
      id: "RPT001",
      title: "Faculty Performance Report",
      department: "Computer Science",
      generatedBy: "Dr. Sarah Johnson",
      date: "2024-01-15",
      lastModified: "2024-01-15 14:30",
      status: "Ready",
      type: "Performance",
      size: "2.4 MB",
      downloads: 45,
      description: "Comprehensive analysis of faculty teaching performance and research output"
    },
    {
      id: "RPT002",
      title: "Student Enrollment Analysis",
      department: "Admissions",
      generatedBy: "Ms. Jane Smith",
      date: "2024-01-10",
      lastModified: "2024-01-12 09:15",
      status: "Ready",
      type: "Enrollment",
      size: "1.8 MB",
      downloads: 32,
      description: "Detailed breakdown of student enrollment trends and demographics"
    },
    {
      id: "RPT003",
      title: "Budget Utilization Report",
      department: "Finance",
      generatedBy: "Mr. John Doe",
      date: "2024-01-08",
      lastModified: "2024-01-08 16:45",
      status: "Processing",
      type: "Financial",
      size: "3.2 MB",
      downloads: 18,
      description: "Annual budget allocation and expenditure analysis"
    },
    {
      id: "RPT004",
      title: "Quality Assurance Summary",
      department: "Academic Affairs",
      generatedBy: "Prof. Mary Wilson",
      date: "2024-01-05",
      lastModified: "2024-01-06 11:20",
      status: "Ready",
      type: "Quality",
      size: "1.5 MB",
      downloads: 67,
      description: "Quality metrics and improvement recommendations"
    },
    {
      id: "RPT005",
      title: "Research Output Report",
      department: "Engineering",
      generatedBy: "Dr. Michael Brown",
      date: "2024-01-03",
      lastModified: "2024-01-04 13:10",
      status: "Ready",
      type: "Research",
      size: "4.1 MB",
      downloads: 29,
      description: "Faculty research publications and grant acquisition summary"
    },
    {
      id: "RPT006",
      title: "Infrastructure Assessment",
      department: "Facilities",
      generatedBy: "Mr. David Lee",
      date: "2024-01-01",
      lastModified: "2024-01-02 08:30",
      status: "Draft",
      type: "Infrastructure",
      size: "2.7 MB",
      downloads: 12,
      description: "Campus facilities condition and maintenance requirements"
    }
  ]

  const departments = ["Computer Science", "Engineering", "Business Administration", "Arts & Humanities", "Natural Sciences", "Admissions", "Finance", "Academic Affairs", "Facilities"]
  
  const tabs = [
    { id: "all", label: "All Reports" },
    { id: "ready", label: "Ready" },
    { id: "processing", label: "Processing" },
    { id: "draft", label: "Draft" }
  ]

  // Filter reports based on active tab, search, and filters
  const filteredReports = reports.filter(report => {
    const matchesTab = activeTab === "all" || report.status.toLowerCase() === activeTab
    const matchesSearch = !searchTerm || 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || report.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || report.status === selectedStatus
    
    return matchesTab && matchesSearch && matchesDepartment && matchesStatus
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, startIndex + itemsPerPage)

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedDepartment, selectedStatus, activeTab])

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "Processing":
        return "bg-orange-100 text-orange-800 hover:bg-orange-200"
      case "Draft":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "Performance":
        return "bg-blue-100 text-blue-800"
      case "Financial":
        return "bg-purple-100 text-purple-800"
      case "Quality":
        return "bg-green-100 text-green-800"
      case "Research":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
            <p className="text-gray-600">Generate and manage institutional reports</p>
          </div>
          <Button className="bg-[#026892] hover:bg-[#026892]/90 hover:cursor-pointer">Generate New Report</Button>
        </div>

        {/* Statistics Cards - Dashboard Style */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-800">{reports.length}</p>
                  <p className="text-xs text-[#026892]">All time generated</p>
                </div>
                <div className="w-12 h-12 bg-[#026892]/10 rounded-full flex items-center justify-center">
                  <FileBarChart className="w-6 h-6 text-[#026892]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ready Reports</p>
                  <p className="text-2xl font-bold text-gray-800">{reports.filter(r => r.status === "Ready").length}</p>
                  <p className="text-xs text-green-600">Available for download</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Processing</p>
                  <p className="text-2xl font-bold text-gray-800">{reports.filter(r => r.status === "Processing").length}</p>
                  <p className="text-xs text-orange-600">Being generated</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Draft Reports</p>
                  <p className="text-2xl font-bold text-gray-800">{reports.filter(r => r.status === "Draft").length}</p>
                  <p className="text-xs text-red-600">Pending review</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-[#026892] text-[#026892] hover:cursor-pointer"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:cursor-pointer"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Reports Table */}
        <Card>
          <CardHeader>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search reports by title, department, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Ready">Ready</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Report Title
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Generated By
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedReports.length > 0 ? (
                    paginatedReports.map((report) => (
                      <tr key={report.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center space-x-3">
                            <FileBarChart className="w-5 h-5 text-[#026892]" />
                            <div>
                              <p className="font-medium text-gray-900">{report.title}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {report.department}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {report.generatedBy}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {report.date}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={getStatusBadgeClass(report.status)}>
                            {report.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {report.size}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="text-[#026892] hover:text-[#026892]/90 border hover:bg-blue-100 hover:cursor-pointer">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {report.status === "Ready" && (
                              <Button variant="outline" size="sm" className="text-[#026892] hover:text-[#026892]/90 border hover:bg-[#026892]/10 hover:cursor-pointer">
                                <Download className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                        No reports match the current filters
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination and Record Count */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600 whitespace-nowrap">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredReports.length)} of {filteredReports.length} reports
              </div>
              
              <div className="ml-auto">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map((page) => (
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
                      onClick={() => setCurrentPage(Math.min(Math.max(1, totalPages), currentPage + 1))}
                      className={currentPage === totalPages || totalPages <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
  )
}
