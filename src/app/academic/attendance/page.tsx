"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { Download, Eye, AlertTriangle, CheckCircle, Users, ChevronRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"

// Mock data for attendance overview
const attendanceOverview = [
  {
    module: "COE3163 - Software Engineering",
    lecturer: "Dr. Alice Smith",
    totalClasses: 24,
    averageAttendance: 87.5,
    studentsCount: 45,
    lastUpdated: "2024-12-15",
    status: "good",
  },
  {
    module: "COE3264 - Database Systems",
    lecturer: "Prof. Bob Johnson",
    totalClasses: 22,
    averageAttendance: 92.3,
    studentsCount: 38,
    lastUpdated: "2024-12-14",
    status: "excellent",
  },
  {
    module: "COE3166 - Web Development",
    lecturer: "Ms. Carol Davis",
    totalClasses: 20,
    averageAttendance: 65.2,
    studentsCount: 42,
    lastUpdated: "2024-12-10",
    status: "poor",
  },
  {
    module: "COE3261 - Machine Learning",
    lecturer: "Dr. David Brown",
    totalClasses: 18,
    averageAttendance: 78.9,
    studentsCount: 35,
    lastUpdated: "2024-12-16",
    status: "fair",
  },
]

// Mock data for student attendance details
const studentAttendanceDetails = [
  { studentId: "222005316", name: "John Doe", totalClasses: 24, attended: 22, percentage: 91.7, status: "good" },
  { studentId: "222005324", name: "Jane Smith", totalClasses: 24, attended: 20, percentage: 83.3, status: "fair" },
  {
    studentId: "222007619",
    name: "Mike Johnson",
    totalClasses: 24,
    attended: 24,
    percentage: 100,
    status: "excellent",
  },
  { studentId: "222009019", name: "Sarah Wilson", totalClasses: 24, attended: 18, percentage: 75.0, status: "fair" },
  { studentId: "222009250", name: "Tom Brown", totalClasses: 24, attended: 14, percentage: 58.3, status: "poor" },
]

// Mock data for daily attendance
const dailyAttendance = [
  { date: "2024-12-16", totalStudents: 45, present: 42, absent: 3, percentage: 93.3 },
  { date: "2024-12-13", totalStudents: 45, present: 39, absent: 6, percentage: 86.7 },
  { date: "2024-12-11", totalStudents: 45, present: 41, absent: 4, percentage: 91.1 },
  { date: "2024-12-09", totalStudents: 45, present: 38, absent: 7, percentage: 84.4 },
  { date: "2024-12-06", totalStudents: 45, present: 40, absent: 5, percentage: 88.9 },
]

export default function AttendancePage() {
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState("Year 1")
  const [selectedModule, setSelectedModule] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Excellent (90%+)</Badge>
      case "good":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Good (80-89%)</Badge>
      case "fair":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Fair (70-79%)</Badge>
      case "poor":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Poor (&lt;70%)</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }

  }

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  // Handle back to marks from detailed view
  function handleBackToMarks() {
    router.back();
  }

  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Monitor and analyze student attendance across all department modules</p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Attendance Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Department Average</p>
                <p className="text-2xl font-bold text-blue-600">80.9%</p>
                <p className="text-xs text-green-600 mt-1">+2.3% from last month</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">160</p>
                <p className="text-xs text-gray-500 mt-1">Across 4 modules</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <Users className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">At Risk Students</p>
                <p className="text-2xl font-bold text-red-600">12</p>
                <p className="text-xs text-red-600 mt-1">&lt;70% attendance</p>
              </div>
              <div className="p-3 rounded-full bg-red-50">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Today's Average</p>
                <p className="text-2xl font-bold text-green-600">93.3%</p>
                <p className="text-xs text-green-600 mt-1">Above department avg</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-50 gap-10">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-[#026892] data-[state=active]:text-white hover:bg-gray-200 hover:text-black hover:data-[state=active]:bg-[#026892]/90 border border-gray-200 w-[150px] text-center rounded-md "
          >
            Module Overview
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="data-[state=active]:bg-[#026892] data-[state=active]:text-white hover:bg-gray-100 hover:text-black border border-gray-200 w-[150px] text-center rounded-md"
          >
            Student Details
          </TabsTrigger>
          <TabsTrigger value="daily" className="data-[state=active]:bg-[#026892] data-[state=active]:text-white hover:bg-hover:bg-gray-100 hover:text-black border border-gray-200 w-[150px] text-center rounded-md">
            Daily Tracking
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="data-[state=active]:bg-[#026892] data-[state=active]:text-white hover:bg-hover:bg-gray-100 hover:text-black border border-gray-200 w-[150px] text-center rounded-md"
          >
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">Module Attendance Overview</CardTitle>
              <CardDescription>Attendance statistics for all department modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="year filter">Year</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger id="year filter" className="w-[180px]">
                      <SelectValue placeholder="Select Year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year 1">Year 1</SelectItem>
                      <SelectItem value="year 2">Year 2</SelectItem>
                      <SelectItem value="year 3">Year 3</SelectItem>
                      <SelectItem value="year 4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status-filter">Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger id="status-filter" className="w-[180px]">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="fair">Fair</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader className="bg-gray-50">
                  <TableRow>
                    <TableHead className="text-gray-700 font-semibold">Module</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Lecturer</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Students</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Total Classes</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Average Attendance</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Last Updated</TableHead>
                    <TableHead className="text-gray-700 font-semibold">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendanceOverview.map((module, index) => (
                    <TableRow key={index}>
                      <TableCell className="text-gray-700 text-sm">{module.module}</TableCell>
                      <TableCell className="text-gray-700 text-sm">{module.lecturer}</TableCell>
                      <TableCell className="text-gray-700 text-sm">{module.studentsCount}</TableCell>
                      <TableCell className="text-gray-700 text-sm">{module.totalClasses}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getAttendanceColor(module.averageAttendance)}`}>
                            {module.averageAttendance}%
                          </span>
                          <Progress value={module.averageAttendance} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 text-sm">{getStatusBadge(module.status)}</TableCell>
                      <TableCell className="text-gray-700 text-sm">{module.lastUpdated}</TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl">
                            <DialogHeader>
                              <DialogTitle>Attendance Details - {module.module}</DialogTitle>
                              <DialogDescription>
                                Detailed attendance records for {module.lecturer}'s class
                              </DialogDescription>
                            </DialogHeader>
                            <div className="max-h-96 overflow-y-auto">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead className="text-gray-700 font-semibold">Student ID</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Name</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Classes Attended</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Total Classes</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Percentage</TableHead>
                                    <TableHead className="text-gray-700 font-semibold">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {studentAttendanceDetails.map((student) => (
                                    <TableRow key={student.studentId}>
                                      <TableCell className="text-gray-700 text-sm font-semibold">{student.studentId}</TableCell>
                                      <TableCell className="text-gray-700 text-sm">{student.name}</TableCell>
                                      <TableCell className="text-gray-700 text-sm">{student.attended}</TableCell>
                                      <TableCell className="text-gray-700 text-sm">{student.totalClasses}</TableCell>
                                      <TableCell className={getAttendanceColor(student.percentage)}>
                                        {student.percentage}%
                                      </TableCell>
                                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">Student Attendance Records</CardTitle>
              <CardDescription>Individual student attendance across all modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-6">
                <div className="grid gap-2">
                  <Label htmlFor="search-student">Search Student</Label>
                  <Input id="search-student" placeholder="Enter student ID or name..." className="w-[250px]" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="module-filter">Module</Label>
                  <Select value={selectedModule} onValueChange={setSelectedModule}>
                    <SelectTrigger id="module-filter" className="w-[200px]">
                      <SelectValue placeholder="Select Module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Modules</SelectItem>
                      <SelectItem value="COE3163">COE3163 - Software Engineering</SelectItem>
                      <SelectItem value="COE3264">COE3264 - Database Systems</SelectItem>
                      <SelectItem value="COE3166">COE3166 - Web Development</SelectItem>
                      <SelectItem value="COE3261">COE3261 - Machine Learning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Classes Attended</TableHead>
                    <TableHead>Total Classes</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentAttendanceDetails.map((student) => (
                    <TableRow key={student.studentId}>
                      <TableCell className="font-medium">{student.studentId}</TableCell>
                      <TableCell>{student.name}</TableCell>
                      <TableCell>{student.attended}</TableCell>
                      <TableCell>{student.totalClasses}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getAttendanceColor(student.percentage)}`}>
                            {student.percentage}%
                          </span>
                          <Progress value={student.percentage} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(student.status)}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          View History
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">Daily Attendance Tracking</CardTitle>
              <CardDescription>Track daily attendance patterns and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader className="bg-blue-50">
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Students</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Attendance %</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dailyAttendance.map((day, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{day.date}</TableCell>
                      <TableCell>{day.totalStudents}</TableCell>
                      <TableCell className="text-green-600">{day.present}</TableCell>
                      <TableCell className="text-red-600">{day.absent}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span className={`font-semibold ${getAttendanceColor(day.percentage)}`}>
                            {day.percentage}%
                          </span>
                          <Progress value={day.percentage} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        {day.percentage >= 90 ? (
                          <Badge className="bg-green-100 text-green-800">Excellent</Badge>
                        ) : day.percentage >= 80 ? (
                          <Badge className="bg-blue-100 text-blue-800">Good</Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">Needs Attention</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-black">Attendance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-semibold text-green-600">89.2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Week</span>
                    <span className="font-semibold">86.7%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-semibold">87.8%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Month</span>
                    <span className="font-semibold">85.4%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-black">Risk Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Critical (&lt;60%)</span>
                    <span className="font-semibold text-red-600">3 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>At Risk (60-69%)</span>
                    <span className="font-semibold text-orange-600">9 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fair (70-79%)</span>
                    <span className="font-semibold text-yellow-600">28 students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Good (80%+)</span>
                    <span className="font-semibold text-green-600">120 students</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-black">Module Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Database Systems</span>
                    <span className="font-semibold text-green-600">92.3%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Software Engineering</span>
                    <span className="font-semibold text-blue-600">87.5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Machine Learning</span>
                    <span className="font-semibold text-yellow-600">78.9%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Web Development</span>
                    <span className="font-semibold text-red-600">65.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
