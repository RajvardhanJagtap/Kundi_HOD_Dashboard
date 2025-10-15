"use client"

import { useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Search, ArrowLeft, Eye, Download, Users, GraduationCap, BookOpen, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useStudentEnrollments } from "@/hooks/transcripts/useAllGroups"

export default function ClassTranscriptsPage() {
  const params = useParams()
  const router = useRouter()
  const groupId = params.classId as string

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const { enrollments, isLoading, error, refetch } = useStudentEnrollments({ groupId })

  // Get class information from the first enrollment (since all students belong to the same group)
  const classInfo = useMemo(() => {
    if (enrollments.length === 0) return null
    
    const firstEnrollment = enrollments[0]
    return {
      groupName: firstEnrollment.groupName,
      programName: firstEnrollment.programName,
      yearLevel: firstEnrollment.currentYearLevel,
      academicYear: firstEnrollment.academicYearName,
      departmentName: firstEnrollment.departmentName || "Not specified",
    }
  }, [enrollments])

  // Calculate statistics
  const stats = useMemo(() => {
    const totalStudents = enrollments.length
    const activeEnrollments = enrollments.filter(e => e.isActive).length
    const graduatedStudents = enrollments.filter(e => e.isGraduated).length
    const averageGPA = enrollments.length > 0 
      ? enrollments.reduce((sum, e) => sum + (e.cumulativeGpa || 0), 0) / enrollments.length
      : 0

    // Calculate transcript completion status based on module enrollments
    let completedTranscripts = 0
    let pendingTranscripts = 0

    enrollments.forEach(enrollment => {
      const hasAllModulesCompleted = enrollment.moduleEnrollments.every(mod => mod.isCompleted)
      if (hasAllModulesCompleted && enrollment.moduleEnrollments.length > 0) {
        completedTranscripts++
      } else {
        pendingTranscripts++
      }
    })

    return {
      totalStudents,
      activeEnrollments,
      graduatedStudents,
      averageGPA,
      completedTranscripts,
      pendingTranscripts
    }
  }, [enrollments])

  // Get enrollment status
  const getEnrollmentStatus = (enrollment: any) => {
    if (enrollment.isGraduated) return "Graduated"
    if (enrollment.isDroppedOut) return "Dropped Out"
    if (enrollment.isSuspended) return "Suspended"
    if (enrollment.isTransferred) return "Transferred"
    if (!enrollment.isActive) return "Inactive"
    
    // Check if all modules are completed
    const hasAllModulesCompleted = enrollment.moduleEnrollments.every((mod: any) => mod.isCompleted)
    if (hasAllModulesCompleted && enrollment.moduleEnrollments.length > 0) {
      return "Complete"
    }
    
    return "Pending"
  }

  // Get status badge styling
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "Complete":
      case "Graduated":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-orange-100 text-orange-800"
      case "Inactive":
      case "Dropped Out":
        return "bg-red-100 text-red-800"
      case "Suspended":
        return "bg-red-100 text-red-800"
      case "Transferred":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Filter students based on search and status
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const matchesSearch =
        enrollment.studentFullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.enrollmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.studentEmail?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const enrollmentStatus = getEnrollmentStatus(enrollment)
      const matchesStatus =
        selectedStatus === "all" || enrollmentStatus.toLowerCase() === selectedStatus.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [enrollments, searchTerm, selectedStatus])

  // Format date helper
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  // Calculate credit completion percentage
  const getCreditCompletionPercentage = (enrollment: any) => {
    if (enrollment.totalCreditsAttempted === 0) return 0
    return Math.round((enrollment.totalCreditsEarned / enrollment.totalCreditsAttempted) * 100)
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
          <div className="items-center space-x-4">
            <Button variant="outline" onClick={() => router.back()} className="flex items-center mb-3 hover:cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Classes
            </Button>
            <div>
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
                </div>
              ) : classInfo ? (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{classInfo.groupName}</h1>
                  <p className="text-gray-600 text-sm">
                    {classInfo.programName} - Year {classInfo.yearLevel}
                  </p>
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Class Not Found</h1>
                  <p className="text-gray-600 text-sm">No students found for this class</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.totalStudents}
                  </p>
                  <p className="text-xs text-[#026892]">Active: {stats.activeEnrollments}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-[#026892]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed Transcripts</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.completedTranscripts}
                  </p>
                  <p className="text-xs text-green-600">Ready for review</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Transcripts</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.pendingTranscripts}
                  </p>
                  <p className="text-xs text-orange-600">Require completion</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Class Average GPA</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : stats.averageGPA.toFixed(1)}
                  </p>
                  <p className="text-xs text-purple-600">Academic performance</p>
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
                  placeholder="Search by student name, enrollment number, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-48">
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
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardHeader>
            <CardTitle>Students ({filteredEnrollments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="ml-2">Loading student enrollments...</span>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Student ID
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Names
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        GPA
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Total Credits
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Percentage
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEnrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {enrollment.enrollmentNumber}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {enrollment.studentFullName || "No name"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {enrollment.studentEmail || "No email"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {enrollment.cumulativeGpa ? enrollment.cumulativeGpa.toFixed(1) : "N/A"}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {enrollment.totalCreditsEarned}/{enrollment.totalCreditsAttempted}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {getCreditCompletionPercentage(enrollment)}%
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Badge className={getStatusBadgeClass(getEnrollmentStatus(enrollment))}>
                            {getEnrollmentStatus(enrollment)}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <Link href={`/students/transcripts/${groupId}/${enrollment.studentId}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-[#026892] hover:text-[#026892]/90 bg-transparent hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View Transcript
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!isLoading && filteredEnrollments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No students found matching your search criteria.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}