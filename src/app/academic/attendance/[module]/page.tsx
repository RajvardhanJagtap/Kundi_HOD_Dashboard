"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { ArrowLeft, ChevronLeft, ChevronRight, Download } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

// Mock data for module attendance
const moduleDetails = {
  module: "COE3163",
  name: "Software Engineering",
  lecturer: "Dr. John Smith",
  class: "Class A",
  totalStudents: 45,
  averageAttendance: 85.5,
  lastUpdated: "2025-10-28",
};

const attendanceRecords = [
  {
    studentId: "ST001",
    name: "Alice Johnson",
    present: 22,
    totalClasses: 25,
    percentage: 88,
    lastAttended: "2025-10-27",
    status: "good",
  },
  {
    studentId: "ST002",
    name: "Bob Wilson",
    present: 20,
    totalClasses: 25,
    percentage: 80,
    lastAttended: "2025-10-28",
    status: "good",
  },
  {
    studentId: "ST003",
    name: "Carol Smith",
    present: 18,
    totalClasses: 25,
    percentage: 72,
    lastAttended: "2025-10-25",
    status: "fair",
  },
  {
    studentId: "ST004",
    name: "David Brown",
    present: 15,
    totalClasses: 25,
    percentage: 60,
    lastAttended: "2025-10-28",
    status: "poor",
  },
  {
    studentId: "ST005",
    name: "Emily Davis",
    present: 23,
    totalClasses: 25,
    percentage: 92,
    lastAttended: "2025-10-28",
    status: "excellent",
  },
  {
    studentId: "ST006",
    name: "Frank Miller",
    present: 19,
    totalClasses: 25,
    percentage: 76,
    lastAttended: "2025-10-26",
    status: "fair",
  },
  {
    studentId: "ST007",
    name: "Grace Lee",
    present: 21,
    totalClasses: 25,
    percentage: 84,
    lastAttended: "2025-10-28",
    status: "good",
  },
];

const dailyRecords = [
  {
    date: "2025-10-28",
    present: 42,
    absent: 3,
    percentage: 93.3,
    notes: "Regular class",
  },
  {
    date: "2025-10-25",
    present: 40,
    absent: 5,
    percentage: 88.9,
    notes: "Lab session",
  },
  {
    date: "2025-10-23",
    present: 38,
    absent: 7,
    percentage: 84.4,
    notes: "Tutorial",
  },
  {
    date: "2025-10-21",
    present: 43,
    absent: 2,
    percentage: 95.6,
    notes: "Regular class",
  },
  {
    date: "2025-10-18",
    present: 41,
    absent: 4,
    percentage: 91.1,
    notes: "Regular class",
  },
  {
    date: "2025-10-16",
    present: 39,
    absent: 6,
    percentage: 86.7,
    notes: "Lab session",
  },
];

// Helper function to get color based on attendance percentage
const getAttendanceColor = (percentage: number) => {
  if (percentage >= 90) return "text-green-600";
  if (percentage >= 80) return "text-[#026892]";
  if (percentage >= 70) return "text-yellow-600";
  return "text-red-600";
};

// Helper function to get status badge
const getStatusBadge = (status: string) => {
  switch (status) {
    case "excellent":
      return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    case "good":
      return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    case "fair":
      return <Badge className="bg-yellow-100 text-yellow-800">Fair</Badge>;
    case "poor":
      return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

export default function ModuleAttendancePage() {
  const params = useParams();
  const moduleId = params.module;

  // Pagination state for both tables
  const [studentsCurrentPage, setStudentsCurrentPage] = useState(1);
  const [dailyCurrentPage, setDailyCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalStudentsPages = Math.ceil(attendanceRecords.length / itemsPerPage);
  const totalDailyPages = Math.ceil(dailyRecords.length / itemsPerPage);

  // Get current items for both tables
  const studentsCurrentItems = attendanceRecords.slice(
    (studentsCurrentPage - 1) * itemsPerPage,
    studentsCurrentPage * itemsPerPage
  );

  const dailyCurrentItems = dailyRecords.slice(
    (dailyCurrentPage - 1) * itemsPerPage,
    dailyCurrentPage * itemsPerPage
  );

  return (
    <div className="flex-1 space-y-4 p-4 md:p-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <Link
            href="/academic/attendance"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2 h-10 hover:bg-gray-100 rounded-md px-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Attendance
          </Link>
          <h2 className="text-2xl font-bold tracking-tight">
            {moduleDetails.name} ({moduleDetails.module})
          </h2>
          <p className="text-muted-foreground">
            {moduleDetails.class} • {moduleDetails.lecturer}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0">
          <TabsTrigger
            value="students"
            className="rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="daily"
            className="rounded-none data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent"
          >
            Daily Records
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Total Classes</TableHead>
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Last Attended</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentsCurrentItems.map((record) => (
                  <TableRow key={record.studentId}>
                    <TableCell className="font-medium">
                      {record.studentId}
                    </TableCell>
                    <TableCell>{record.name}</TableCell>
                    <TableCell>{record.present}</TableCell>
                    <TableCell>{record.totalClasses}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${getAttendanceColor(
                            record.percentage
                          )}`}
                        >
                          {record.percentage}%
                        </span>
                        <Progress
                          value={record.percentage}
                          className="h-2 w-16"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{record.lastAttended}</TableCell>
                    <TableCell>{getStatusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-2 py-4 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentsCurrentPage(studentsCurrentPage - 1)}
                disabled={studentsCurrentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {Array.from({ length: totalStudentsPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      studentsCurrentPage === page ? "secondary" : "outline"
                    }
                    size="sm"
                    onClick={() => setStudentsCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setStudentsCurrentPage(studentsCurrentPage + 1)}
                disabled={studentsCurrentPage === totalStudentsPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Attendance %</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyCurrentItems.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.date}</TableCell>
                    <TableCell className="text-green-600">
                      {record.present}
                    </TableCell>
                    <TableCell className="text-red-600">
                      {record.absent}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${getAttendanceColor(
                            record.percentage
                          )}`}
                        >
                          {record.percentage}%
                        </span>
                        <Progress
                          value={record.percentage}
                          className="h-2 w-16"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{record.notes}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-end gap-2 py-4 px-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDailyCurrentPage(dailyCurrentPage - 1)}
                disabled={dailyCurrentPage === 1}
                className="gap-1"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {Array.from({ length: totalDailyPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={
                      dailyCurrentPage === page ? "secondary" : "outline"
                    }
                    size="sm"
                    onClick={() => setDailyCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDailyCurrentPage(dailyCurrentPage + 1)}
                disabled={dailyCurrentPage === totalDailyPages}
                className="gap-1"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
