"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Eye, Users, GraduationCap, BookOpen, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranscripts } from "@/hooks/transcripts/useAllGroups"

export default function TranscriptsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [selectedYear, setSelectedYear] = useState("all")
  const [academicYearId, setAcademicYearId] = useState<string>("");
  
  // TODO: Get academicYearId from your system - you can replace this with actual implementation
  // For now, I'm using the hardcoded value from your example  
  const { groups, isLoading, error, refetch } = useTranscripts({ academicYearId })

  // Get unique departments and year levels for filters
  const departments = useMemo(() => {
    const uniqueDepartments = Array.from(new Set(
      groups.map(group => group.departmentName).filter(Boolean)
    ))
    return uniqueDepartments
  }, [groups])

  const yearLevels = useMemo(() => {
    const uniqueYears = Array.from(new Set(
      groups.map(group => group.yearLevel).filter(Boolean)
    )).sort((a, b) => a - b)
    return uniqueYears
  }, [groups])

  useEffect(() => {
        // Get group ID and other IDs from URL params or localStorage
        const urlAcademicYearId = (typeof window !== "undefined" ? localStorage.getItem("selectedAcademicYearId") : "");
        
        // Load stored academic year and semester from localStorage
        const storedYear = typeof window !== "undefined" ? localStorage.getItem("selectedAcademicYear") : "";
        if (urlAcademicYearId) setAcademicYearId(urlAcademicYearId);
    }, []);

  // Filter data based on search and selections
  const filteredGroups = useMemo(() => {
    return groups.filter((group) => {
      const matchesSearch =
        group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (group.departmentName && group.departmentName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        group.code.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesDepartment = selectedDepartment === "all" || group.departmentName === selectedDepartment
      const matchesYear = selectedYear === "all" || group.yearLevel.toString() === selectedYear

      return matchesSearch && matchesDepartment && matchesYear
    })
  }, [groups, searchTerm, selectedDepartment, selectedYear])

  // Calculate statistics
  const totalStudents = groups.reduce((sum, group) => sum + (group.currentEnrollment || 0), 0)
  const totalCapacity = groups.reduce((sum, group) => sum + (group.capacity || 0), 0)
  const activeGroups = groups.filter(group => group.isActive).length

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Get status based on group data
  const getGroupStatus = (group: any) => {
    if (!group.isActive) return "Inactive"
    if (group.isFull) return "Full"
    return "Active"
  }

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Full":
        return "bg-red-100 text-red-800"
      case "Active":
        return "bg-green-100 text-green-800"
      case "Inactive":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  if (error) {
    return (
        <div className="space-y-6">
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
          <Button onClick={refetch} className="mt-4">
            Try Again
          </Button>
        </div>
    )
  }

  return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Transcripts</h1>
            <p className="text-gray-600 text-sm">Manage and view student transcripts by class groups</p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Groups</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : groups.length}
                  </p>
                  <p className="text-xs text-[#026892]">Active groups: {activeGroups}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-[#026892]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalStudents}
                  </p>
                  <p className="text-xs text-green-600">Current enrollment</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalCapacity}
                  </p>
                  <p className="text-xs text-orange-600">Maximum enrollment</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Utilization</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      `${totalCapacity > 0 ? Math.round((totalStudents / totalCapacity) * 100) : 0}%`
                    )}
                  </p>
                  <p className="text-xs text-purple-600">Enrollment rate</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search by group name, code, or department..."
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
                    <Select value={selectedDepartment ?? ""} onValueChange={setSelectedDepartment}>
                      {dept}
                    </Select>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-32">
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
          </CardContent>
        </Card>

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <CardTitle>Academic Groups ({filteredGroups.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading academic groups...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-900">
                        Group Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-900">
                        Code
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-700">
                        Department
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-700">
                        Year Level
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-700">
                        Enrollment
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-700">
                        Capacity
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-700">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm uppercase tracking-wider font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredGroups.map((group) => (
                      <tr key={group.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {group.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {group.code}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {group.departmentName || "-"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          Year {group.yearLevel}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {group.currentEnrollment || 0}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {group.capacity}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={getStatusBadgeClass(getGroupStatus(group))}>
                            {getGroupStatus(group)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link href={`/students/transcripts/${group.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#026892] hover:text-[#026892]/90 bg-transparent hover:cursor-pointer border hover:bg-blue-100 flex items-center"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && filteredGroups.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No academic groups found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}