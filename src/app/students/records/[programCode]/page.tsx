"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Download,
  ChevronLeft,
  ChevronRight,
  FileText,
  TrendingUp,
  Users,
  GraduationCap,
  Award,
} from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  gpa: number;
  creditsCompleted: number;
  enrollmentStatus: string;
  enrollmentDate: string;
  academicStatus: string;
}

const ITEMS_PER_PAGE = 10;

export default function ProgramStudentsPage() {
  const params = useParams();
  const router = useRouter();
  const programCode = (params?.programCode as string) || "COE-Y1";

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterAcademicStatus, setFilterAcademicStatus] = useState("all");

  // Sample student data
  const students: Student[] = [
    {
      id: "STU001",
      name: "Alice Johnson",
      email: "alice.j@university.edu",
      phone: "+250 788 123 456",
      gpa: 3.8,
      creditsCompleted: 45,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU002",
      name: "Bob Iradukunda",
      email: "bob.Iradukunda@university.edu",
      phone: "+250 788 234 567",
      gpa: 3.5,
      creditsCompleted: 42,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU003",
      name: "Carol White",
      email: "carol.w@university.edu",
      phone: "+250 788 345 678",
      gpa: 3.2,
      creditsCompleted: 38,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU004",
      name: "David Brown",
      email: "david.b@university.edu",
      phone: "+250 788 456 789",
      gpa: 2.8,
      creditsCompleted: 35,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Probation",
    },
    {
      id: "STU005",
      name: "Emma Davis",
      email: "emma.d@university.edu",
      phone: "+250 788 567 890",
      gpa: 3.9,
      creditsCompleted: 48,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Dean's List",
    },
    {
      id: "STU006",
      name: "Frank Miller",
      email: "frank.m@university.edu",
      phone: "+250 788 678 901",
      gpa: 3.6,
      creditsCompleted: 44,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU007",
      name: "Grace Lee",
      email: "grace.l@university.edu",
      phone: "+250 788 789 012",
      gpa: 3.4,
      creditsCompleted: 40,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU008",
      name: "Henry Chen",
      email: "henry.c@university.edu",
      phone: "+250 788 890 123",
      gpa: 2.9,
      creditsCompleted: 36,
      enrollmentStatus: "LOA",
      enrollmentDate: "2024-09-01",
      academicStatus: "Leave of Absence",
    },
    {
      id: "STU009",
      name: "Isabella Garcia",
      email: "isabella.g@university.edu",
      phone: "+250 788 901 234",
      gpa: 3.7,
      creditsCompleted: 46,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU010",
      name: "Jack Wilson",
      email: "jack.w@university.edu",
      phone: "+250 788 012 345",
      gpa: 3.3,
      creditsCompleted: 41,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU011",
      name: "Kate Martinez",
      email: "kate.m@university.edu",
      phone: "+250 788 123 457",
      gpa: 3.1,
      creditsCompleted: 39,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU012",
      name: "Liam Anderson",
      email: "liam.a@university.edu",
      phone: "+250 788 234 568",
      gpa: 2.7,
      creditsCompleted: 33,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Probation",
    },
    {
      id: "STU013",
      name: "Mia Thompson",
      email: "mia.t@university.edu",
      phone: "+250 788 345 679",
      gpa: 4.0,
      creditsCompleted: 50,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Dean's List",
    },
    {
      id: "STU014",
      name: "Noah Taylor",
      email: "noah.t@university.edu",
      phone: "+250 788 456 780",
      gpa: 3.5,
      creditsCompleted: 43,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
    {
      id: "STU015",
      name: "Olivia Roberts",
      email: "olivia.r@university.edu",
      phone: "+250 788 567 891",
      gpa: 3.2,
      creditsCompleted: 37,
      enrollmentStatus: "Active",
      enrollmentDate: "2024-09-01",
      academicStatus: "Good Standing",
    },
  ];

  const programInfo = {
    code: programCode,
    name: programCode.includes("COE")
      ? "Computer Engineering"
      : programCode.includes("CSE")
      ? "Computer Science"
      : programCode.includes("SE")
      ? "Software Engineering"
      : programCode.includes("EE")
      ? "Electrical Engineering"
      : "Mechanical Engineering",
    year: programCode.includes("Y1")
      ? "Year 1"
      : programCode.includes("Y2")
      ? "Year 2"
      : programCode.includes("Y3")
      ? "Year 3"
      : "Year 4",
    coordinator: "Dr. Alice Iradukunda",
    department: "Engineering",
  };

  const filterStudents = (students: Student[]) => {
    return students.filter((student) => {
      const matchesSearch =
        student.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || student.enrollmentStatus === filterStatus;
      const matchesAcademicStatus =
        filterAcademicStatus === "all" ||
        student.academicStatus === filterAcademicStatus;
      return matchesSearch && matchesStatus && matchesAcademicStatus;
    });
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "LOA":
        return "bg-yellow-100 text-yellow-800";
      case "Suspended":
        return "bg-red-100 text-red-800";
      case "Graduated":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getAcademicStatusColor = (status: string) => {
    switch (status) {
      case "Dean's List":
        return "bg-purple-100 text-purple-800";
      case "Good Standing":
        return "bg-green-100 text-green-800";
      case "Probation":
        return "bg-orange-100 text-orange-800";
      case "Leave of Absence":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getGPAColor = (gpa: number) => {
    if (gpa >= 3.7) return "text-green-600 font-semibold";
    if (gpa >= 3.0) return "text-blue-600 font-medium";
    if (gpa >= 2.5) return "text-orange-600";
    return "text-red-600";
  };

  const filteredStudents = filterStudents(students);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);

  const avgGPA = (
    students.reduce((sum, s) => sum + s.gpa, 0) / students.length
  ).toFixed(2);
  const activeStudents = students.filter(
    (s) => s.enrollmentStatus === "Active"
  ).length;
  const deansListStudents = students.filter(
    (s) => s.academicStatus === "Dean's List"
  ).length;

  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Programs
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {programInfo.name} - {programInfo.year}
          </h1>
          <p className="text-gray-600 mt-1">
            Program Code: {programInfo.code} • Coordinator:{" "}
            {programInfo.coordinator}
          </p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white gap-2">
          <Download className="h-4 w-4" />
          Export Records
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Students
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {students.length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Enrolled students</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#026892]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Active Students
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {activeStudents}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Currently enrolled</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Average GPA
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {avgGPA}
                </h3>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <span>Program average</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Enrolled Students
          </CardTitle>
          <div className="flex flex-col lg:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by ID, name, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Enrollment Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="LOA">Leave of Absence</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterAcademicStatus}
              onValueChange={setFilterAcademicStatus}
            >
              <SelectTrigger className="w-full lg:w-[200px]">
                <SelectValue placeholder="Academic Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Academic Status</SelectItem>
                <SelectItem value="Dean's List">Dean's List</SelectItem>
                <SelectItem value="Good Standing">Good Standing</SelectItem>
                <SelectItem value="Probation">Probation</SelectItem>
                <SelectItem value="Leave of Absence">
                  Leave of Absence
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>GPA</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Enrollment Status</TableHead>
                  <TableHead>Academic Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentStudents.length > 0 ? (
                  currentStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium text-gray-900">
                        {student.id}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-600" />
                          </div>
                          <span className="text-gray-900 font-medium">
                            {student.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-700">
                          <div className="flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {student.email}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Phone className="h-3 w-3" />
                            {student.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={getGPAColor(student.gpa)}>
                          {student.gpa.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {student.creditsCompleted}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getEnrollmentStatusColor(
                            student.enrollmentStatus
                          )}
                        >
                          {student.enrollmentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={getAcademicStatusColor(
                            student.academicStatus
                          )}
                        >
                          {student.academicStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#026892] hover:bg-blue-50"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-500"
                    >
                      No students found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {totalPages > 1 && (
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
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
