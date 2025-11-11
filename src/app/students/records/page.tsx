"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Program {
  id: number;
  code: string;
  name: string;
  enrolledStudents: number;
  capacity: number;
  coordinator: string;
  status: string;
  department: string;
}

const ITEMS_PER_PAGE = 5;

export default function StudentRecordsPage() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const year1Programs: Program[] = [
    {
      id: 1,
      code: "COE-Y1",
      name: "Computer Engineering - Year 1",
      enrolledStudents: 145,
      capacity: 150,
      coordinator: "Dr. Alice Iradukunda",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 2,
      code: "CSE-Y1",
      name: "Computer Science - Year 1",
      enrolledStudents: 132,
      capacity: 140,
      coordinator: "Prof. Bob Johnson",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 3,
      code: "SE-Y1",
      name: "Software Engineering - Year 1",
      enrolledStudents: 98,
      capacity: 120,
      coordinator: "Dr. Carol Davis",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 4,
      code: "EE-Y1",
      name: "Electrical Engineering - Year 1",
      enrolledStudents: 87,
      capacity: 100,
      coordinator: "Prof. David Brown",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 5,
      code: "ME-Y1",
      name: "Mechanical Engineering - Year 1",
      enrolledStudents: 76,
      capacity: 90,
      coordinator: "Dr. Emily White",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 6,
      code: "CE-Y1",
      name: "Civil Engineering - Year 1",
      enrolledStudents: 65,
      capacity: 80,
      coordinator: "Prof. Frank Miller",
      status: "Active",
      department: "Engineering",
    },
  ];

  const year2Programs: Program[] = [
    {
      id: 7,
      code: "COE-Y2",
      name: "Computer Engineering - Year 2",
      enrolledStudents: 128,
      capacity: 150,
      coordinator: "Dr. Frank Miller",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 8,
      code: "CSE-Y2",
      name: "Computer Science - Year 2",
      enrolledStudents: 115,
      capacity: 140,
      coordinator: "Prof. Grace Lee",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 9,
      code: "SE-Y2",
      name: "Software Engineering - Year 2",
      enrolledStudents: 89,
      capacity: 120,
      coordinator: "Dr. Henry Chen",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 10,
      code: "EE-Y2",
      name: "Electrical Engineering - Year 2",
      enrolledStudents: 72,
      capacity: 100,
      coordinator: "Prof. Ian Taylor",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 11,
      code: "ME-Y2",
      name: "Mechanical Engineering - Year 2",
      enrolledStudents: 68,
      capacity: 90,
      coordinator: "Dr. Jane Wilson",
      status: "Under Review",
      department: "Engineering",
    },
  ];

  const year3Programs: Program[] = [
    {
      id: 12,
      code: "COE-Y3",
      name: "Computer Engineering - Year 3",
      enrolledStudents: 112,
      capacity: 150,
      coordinator: "Dr. Jane Wilson",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 13,
      code: "CSE-Y3",
      name: "Computer Science - Year 3",
      enrolledStudents: 98,
      capacity: 140,
      coordinator: "Prof. Kevin Martinez",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 14,
      code: "SE-Y3",
      name: "Software Engineering - Year 3",
      enrolledStudents: 76,
      capacity: 120,
      coordinator: "Dr. Laura Garcia",
      status: "Under Review",
      department: "Engineering",
    },
    {
      id: 15,
      code: "EE-Y3",
      name: "Electrical Engineering - Year 3",
      enrolledStudents: 65,
      capacity: 100,
      coordinator: "Prof. Michael Roberts",
      status: "Active",
      department: "Engineering",
    },
  ];

  const year4Programs: Program[] = [
    {
      id: 16,
      code: "COE-Y4",
      name: "Computer Engineering - Year 4",
      enrolledStudents: 95,
      capacity: 150,
      coordinator: "Dr. Michael Roberts",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 17,
      code: "CSE-Y4",
      name: "Computer Science - Year 4",
      enrolledStudents: 87,
      capacity: 140,
      coordinator: "Prof. Nancy Thompson",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 18,
      code: "SE-Y4",
      name: "Software Engineering - Year 4",
      enrolledStudents: 65,
      capacity: 120,
      coordinator: "Dr. Oliver Anderson",
      status: "Active",
      department: "Engineering",
    },
    {
      id: 19,
      code: "EE-Y4",
      name: "Electrical Engineering - Year 4",
      enrolledStudents: 58,
      capacity: 100,
      coordinator: "Prof. Patricia Clark",
      status: "Active",
      department: "Engineering",
    },
  ];

  const filterPrograms = (programs: Program[]) => {
    return programs.filter((program) => {
      const matchesSearch =
        program.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        program.coordinator.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || program.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCapacityStatus = (enrolled: number, capacity: number) => {
    const percentage = (enrolled / capacity) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-orange-600";
    return "text-green-600";
  };

  const renderProgramTable = (
    programs: Program[],
    page: number,
    setPage: (page: number) => void
  ) => {
    const filteredPrograms = filterPrograms(programs);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentPrograms = filteredPrograms.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredPrograms.length / ITEMS_PER_PAGE);

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Program Code</TableHead>
              <TableHead>Program Name</TableHead>
              <TableHead>Enrolled Students</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Coordinator</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentPrograms.length > 0 ? (
              currentPrograms.map((program) => (
                <TableRow key={program.id}>
                  <TableCell className="font-medium text-gray-900">
                    {program.code}
                  </TableCell>
                  <TableCell className="text-gray-700">{program.name}</TableCell>
                  <TableCell>
                    <span
                      className={`font-medium ${getCapacityStatus(
                        program.enrolledStudents,
                        program.capacity
                      )}`}
                    >
                      {program.enrolledStudents} / {program.capacity}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {program.capacity}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {program.coordinator}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(program.status)}>
                      {program.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/students/records/${program.code}`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#026892] hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View Students
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-gray-500"
                >
                  No programs found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {totalPages > 0 && (
          <div className="flex items-center justify-end gap-2 py-4 px-4 border-t border-gray-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (pageNum) => (
                <Button
                  key={pageNum}
                  variant={page === pageNum ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              className="gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </>
    );
  };

  const allPrograms = [
    ...year1Programs,
    ...year2Programs,
    ...year3Programs,
    ...year4Programs,
  ];

  const totalStudents = allPrograms.reduce(
    (sum, p) => sum + p.enrolledStudents,
    0
  );
  const totalCapacity = allPrograms.reduce((sum, p) => sum + p.capacity, 0);
  const activePrograms = allPrograms.filter((p) => p.status === "Active").length;

  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Student Records</h1>
          <p className="text-gray-600 mt-1">
            View and manage student enrollment across all programs
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Students
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {totalStudents}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Across all programs</span>
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
                  Total Programs
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {allPrograms.length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Active programs</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
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
                  {totalCapacity}
                </h3>
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <span>Maximum enrollment</span>
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
                  Utilization Rate
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {Math.round((totalStudents / totalCapacity) * 100)}%
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Overall capacity</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
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

        <TabsContent value="year1" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Year 1 Programs
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or coordinator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {renderProgramTable(year1Programs, page1, setPage1)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year2" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Year 2 Programs
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or coordinator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {renderProgramTable(year2Programs, page2, setPage2)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year3" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Year 3 Programs
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or coordinator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {renderProgramTable(year3Programs, page3, setPage3)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year4" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Year 4 Programs
              </CardTitle>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or coordinator..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                {renderProgramTable(year4Programs, page4, setPage4)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}