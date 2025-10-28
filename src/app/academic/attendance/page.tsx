"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import {
  Download,
  Eye,
  AlertTriangle,
  CheckCircle,
  Users,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

// Mock data for attendance overview
const attendanceOverview = [
  {
    module: "COE3163 - Software Engineering",
    lecturer: "Dr. Alice Smith",
    totalClasses: 24,
    averageAttendance: 87.5,
    studentsCount: 45,
    lastUpdated: "2025-10-28",
    status: "good",
  },
  {
    module: "COE3264 - Database Systems",
    lecturer: "Prof. Bob Johnson",
    totalClasses: 22,
    averageAttendance: 92.3,
    studentsCount: 38,
    lastUpdated: "2025-10-27",
    status: "excellent",
  },
  {
    module: "COE3166 - Web Development",
    lecturer: "Ms. Carol Davis",
    totalClasses: 20,
    averageAttendance: 65.2,
    studentsCount: 42,
    lastUpdated: "2025-10-28",
    status: "poor",
  },
  {
    module: "COE3261 - Machine Learning",
    lecturer: "Dr. David Brown",
    totalClasses: 18,
    averageAttendance: 78.9,
    studentsCount: 35,
    lastUpdated: "2025-10-26",
    status: "fair",
  },
];

// Mock data for student attendance details
const studentAttendanceDetails = [
  {
    studentId: "222005316",
    name: "John Doe",
    totalClasses: 24,
    attended: 22,
    percentage: 91.7,
    status: "good",
  },
  {
    studentId: "222005324",
    name: "Jane Smith",
    totalClasses: 24,
    attended: 20,
    percentage: 83.3,
    status: "fair",
  },
  {
    studentId: "222007619",
    name: "Mike Johnson",
    totalClasses: 24,
    attended: 24,
    percentage: 100,
    status: "excellent",
  },
  {
    studentId: "222009019",
    name: "Sarah Wilson",
    totalClasses: 24,
    attended: 18,
    percentage: 75.0,
    status: "fair",
  },
  {
    studentId: "222009250",
    name: "Tom Brown",
    totalClasses: 24,
    attended: 14,
    percentage: 58.3,
    status: "poor",
  },
];

// Mock data for daily attendance
const dailyAttendance = [
  {
    date: "2024-12-16",
    totalStudents: 45,
    present: 42,
    absent: 3,
    percentage: 93.3,
  },
  {
    date: "2024-12-13",
    totalStudents: 45,
    present: 39,
    absent: 6,
    percentage: 86.7,
  },
  {
    date: "2024-12-11",
    totalStudents: 45,
    present: 41,
    absent: 4,
    percentage: 91.1,
  },
  {
    date: "2024-12-09",
    totalStudents: 45,
    present: 38,
    absent: 7,
    percentage: 84.4,
  },
  {
    date: "2024-12-06",
    totalStudents: 45,
    present: 40,
    absent: 5,
    percentage: 88.9,
  },
];

export default function AttendancePage() {
  const router = useRouter();
  const [selectedSemester, setSelectedSemester] = useState("Year 1");
  const [selectedModule, setSelectedModule] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  // Pagination states
  const itemsPerPage = 10;
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);

  // Total pages for each tab
  const totalPages1 = Math.ceil((attendanceOverview.length + 2) / itemsPerPage);
  const totalPages2 = Math.ceil((attendanceOverview.length + 2) / itemsPerPage);
  const totalPages3 = Math.ceil((attendanceOverview.length + 2) / itemsPerPage);
  const totalPages4 = Math.ceil((attendanceOverview.length + 2) / itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "excellent":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            Excellent (90%+)
          </Badge>
        );
      case "good":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Good (80-89%)
          </Badge>
        );
      case "fair":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Fair (70-79%)
          </Badge>
        );
      case "poor":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            Poor (&lt;70%)
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 80) return "text-[#026892]";
    if (percentage >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  // Handle back to marks from detailed view
  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Attendance Management
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and analyze student attendance across all department modules
          </p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
          <Download className="mr-2 h-4 w-4" />
          Export Attendance Report
        </Button>
      </div>

      {/* Statistics Cards - match teaching plans style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">
              Department Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800">80.9%</div>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4 text-[#026892]" />
              <span className="text-sm text-[#026892]">
                +2.3% from last month
              </span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800">160</div>
            <div className="flex items-center gap-2 mt-2">
              <Users className="h-4 w-4 text-samps-green-600" />
              <span className="text-sm text-samps-green-600">Across 4 modules</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">
              At Risk Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800">12</div>
            <div className="flex items-center gap-2 mt-2">
              <AlertTriangle className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-samps-red-600">&lt;70% attendance</span>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-700">
              Today's Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-800">93.3%</div>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle className="h-4 w-4 text-samps-green-600" />
              <span className="text-sm text-samps-green-600">
                Above department avg
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="year1" className="w-full">
        <TabsList className="flex items-end gap-6 w-full">
          <TabsTrigger value="year1">Year 1</TabsTrigger>
          <TabsTrigger value="year2">Year 2</TabsTrigger>
          <TabsTrigger value="year3">Year 3</TabsTrigger>
          <TabsTrigger value="year4">Year 4</TabsTrigger>
        </TabsList>

        {/* Year 1 Tab */}
        <TabsContent value="year1" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">
                Year 1 Attendance
              </CardTitle>
              <CardDescription>
                Attendance statistics for Year 1 modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Lecturer</TableHead>
                      <TableHead>Average Attendance</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...attendanceOverview,
                      {
                        module: "COE1111 - Introduction to Programming",
                        lecturer: "Dr. New Lecturer",
                        totalClasses: 25,
                        averageAttendance: 81.2,
                        studentsCount: 50,
                        lastUpdated: "2024-12-12",
                        status: "good",
                      },
                      {
                        module: "COE1112 - Discrete Mathematics",
                        lecturer: "Prof. Math Genius",
                        totalClasses: 23,
                        averageAttendance: 77.5,
                        studentsCount: 48,
                        lastUpdated: "2024-12-10",
                        status: "fair",
                      },
                    ].map((module, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{module.module}</TableCell>
                        <TableCell>Class A</TableCell>
                        <TableCell>{module.lecturer}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-semibold ${getAttendanceColor(
                                module.averageAttendance
                              )}`}
                            >
                              {module.averageAttendance}%
                            </span>
                            <Progress
                              value={module.averageAttendance}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{module.lastUpdated}</TableCell>
                        <TableCell>
                          <Link
                            href={`/academic/attendance/${encodeURIComponent(
                              module.module
                            )}`}
                            passHref
                            legacyBehavior
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-2 py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage1(page1 - 1)}
                    disabled={page1 === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages1 }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page1 === page ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setPage1(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage1(page1 + 1)}
                    disabled={page1 === totalPages1}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Year 2 Tab */}
        <TabsContent value="year2" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">
                Year 2 Attendance
              </CardTitle>
              <CardDescription>
                Attendance statistics for Year 2 modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Lecturer</TableHead>
                      <TableHead>Average Attendance</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...attendanceOverview,
                      {
                        module: "COE2111 - Data Structures",
                        lecturer: "Dr. Struct Algo",
                        totalClasses: 22,
                        averageAttendance: 85.0,
                        studentsCount: 44,
                        lastUpdated: "2024-12-13",
                        status: "good",
                      },
                      {
                        module: "COE2112 - Computer Architecture",
                        lecturer: "Prof. Chip Logic",
                        totalClasses: 20,
                        averageAttendance: 79.8,
                        studentsCount: 41,
                        lastUpdated: "2024-12-11",
                        status: "fair",
                      },
                    ].map((module, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{module.module}</TableCell>
                        <TableCell>Class B</TableCell>
                        <TableCell>{module.lecturer}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-semibold ${getAttendanceColor(
                                module.averageAttendance
                              )}`}
                            >
                              {module.averageAttendance}%
                            </span>
                            <Progress
                              value={module.averageAttendance}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{module.lastUpdated}</TableCell>
                        <TableCell>
                          <Link
                            href={`/academic/attendance/${encodeURIComponent(
                              module.module
                            )}`}
                            passHref
                            legacyBehavior
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-2 py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage2(page2 - 1)}
                    disabled={page2 === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages2 }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page2 === page ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setPage2(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage2(page2 + 1)}
                    disabled={page2 === totalPages2}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Year 3 Tab */}
        <TabsContent value="year3" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">
                Year 3 Attendance
              </CardTitle>
              <CardDescription>
                Attendance statistics for Year 3 modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Lecturer</TableHead>
                      <TableHead>Average Attendance</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...attendanceOverview,
                      {
                        module: "COE3111 - Operating Systems",
                        lecturer: "Dr. Kernel Boss",
                        totalClasses: 21,
                        averageAttendance: 88.2,
                        studentsCount: 39,
                        lastUpdated: "2024-12-14",
                        status: "good",
                      },
                      {
                        module: "COE3112 - Algorithms",
                        lecturer: "Prof. Algo Master",
                        totalClasses: 23,
                        averageAttendance: 82.7,
                        studentsCount: 37,
                        lastUpdated: "2024-12-12",
                        status: "good",
                      },
                    ].map((module, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{module.module}</TableCell>
                        <TableCell>Class C</TableCell>
                        <TableCell>{module.lecturer}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-semibold ${getAttendanceColor(
                                module.averageAttendance
                              )}`}
                            >
                              {module.averageAttendance}%
                            </span>
                            <Progress
                              value={module.averageAttendance}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{module.lastUpdated}</TableCell>
                        <TableCell>
                          <Link
                            href={`/academic/attendance/${encodeURIComponent(
                              module.module
                            )}`}
                            passHref
                            legacyBehavior
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-2 py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage3(page3 - 1)}
                    disabled={page3 === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages3 }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page3 === page ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setPage3(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage3(page3 + 1)}
                    disabled={page3 === totalPages3}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Year 4 Tab */}
        <TabsContent value="year4" className="mt-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-1">
                Year 4 Attendance
              </CardTitle>
              <CardDescription>
                Attendance statistics for Year 4 modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Module</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Lecturer</TableHead>
                      <TableHead>Average Attendance</TableHead>
                      <TableHead>Last Update</TableHead>
                      <TableHead>Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      ...attendanceOverview,
                      {
                        module: "COE4111 - Artificial Intelligence",
                        lecturer: "Dr. AI Expert",
                        totalClasses: 20,
                        averageAttendance: 90.1,
                        studentsCount: 36,
                        lastUpdated: "2024-12-15",
                        status: "excellent",
                      },
                      {
                        module: "COE4112 - Cloud Computing",
                        lecturer: "Prof. Cloud Guru",
                        totalClasses: 19,
                        averageAttendance: 84.6,
                        studentsCount: 34,
                        lastUpdated: "2024-12-13",
                        status: "good",
                      },
                    ].map((module, index) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{module.module}</TableCell>
                        <TableCell>Class D</TableCell>
                        <TableCell>{module.lecturer}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`font-semibold ${getAttendanceColor(
                                module.averageAttendance
                              )}`}
                            >
                              {module.averageAttendance}%
                            </span>
                            <Progress
                              value={module.averageAttendance}
                              className="w-16 h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{module.lastUpdated}</TableCell>
                        <TableCell>
                          <Link
                            href={`/academic/attendance/${encodeURIComponent(
                              module.module
                            )}`}
                            passHref
                            legacyBehavior
                          >
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4 mr-1" /> View
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex items-center justify-end gap-2 py-4 px-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage4(page4 - 1)}
                    disabled={page4 === 1}
                    className="gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  {Array.from({ length: totalPages4 }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={page4 === page ? "secondary" : "outline"}
                        size="sm"
                        onClick={() => setPage4(page)}
                      >
                        {page}
                      </Button>
                    )
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage4(page4 + 1)}
                    disabled={page4 === totalPages4}
                    className="gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Students Tab */}
        <TabsContent value="students" className="mt-6">
          ...existing code...
        </TabsContent>

        {/* Daily Tab */}
        <TabsContent value="daily" className="mt-6">
          ...existing code...
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="mt-6">
          ...existing code...
        </TabsContent>
      </Tabs>
    </div>
  );
}
