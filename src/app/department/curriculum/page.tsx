"use client";

import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  PlusCircle,
  Eye,
  BookOpen,
  GraduationCap,
  Target,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  Award,
} from "lucide-react";
import Link from "next/link";

interface Module {
  id: number;
  code: string;
  name: string;
  credits: number;
  semester: string;
  lecturer: string;
  status: string;
  lastUpdated: string;
}

const ITEMS_PER_PAGE = 10;

export default function CurriculumPage() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(1);
  const [page3, setPage3] = useState(1);
  const [page4, setPage4] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const year1Modules: Module[] = [
    {
      id: 1,
      code: "COE1101",
      name: "Introduction to Programming",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Dr. Alice Iradukunda",
      status: "Active",
      lastUpdated: "2024-09-15",
    },
    {
      id: 2,
      code: "COE1102",
      name: "Mathematics for Computing I",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Prof. Bob Johnson",
      status: "Active",
      lastUpdated: "2024-09-10",
    },
    {
      id: 3,
      code: "COE1103",
      name: "Digital Logic Design",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Dr. Carol Davis",
      status: "Under Review",
      lastUpdated: "2024-08-20",
    },
    {
      id: 4,
      code: "COE1201",
      name: "Data Structures",
      credits: 15,
      semester: "Semester 2",
      lecturer: "Dr. David Brown",
      status: "Active",
      lastUpdated: "2024-09-18",
    },
    {
      id: 5,
      code: "COE1202",
      name: "Computer Architecture",
      credits: 15,
      semester: "Semester 2",
      lecturer: "Prof. Emily White",
      status: "Active",
      lastUpdated: "2024-09-12",
    },
  ];

  const year2Modules: Module[] = [
    {
      id: 6,
      code: "COE2101",
      name: "Object-Oriented Programming",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Dr. Frank Miller",
      status: "Active",
      lastUpdated: "2024-09-14",
    },
    {
      id: 7,
      code: "COE2102",
      name: "Database Systems",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Prof. Grace Lee",
      status: "Active",
      lastUpdated: "2024-09-11",
    },
    {
      id: 8,
      code: "COE2103",
      name: "Operating Systems",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Dr. Henry Chen",
      status: "Under Review",
      lastUpdated: "2024-08-25",
    },
  ];

  const year3Modules: Module[] = [
    {
      id: 9,
      code: "COE3101",
      name: "Software Engineering",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Dr. Ian Taylor",
      status: "Active",
      lastUpdated: "2024-09-16",
    },
    {
      id: 10,
      code: "COE3102",
      name: "Web Development",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Prof. Jane Wilson",
      status: "Active",
      lastUpdated: "2024-09-13",
    },
  ];

  const year4Modules: Module[] = [
    {
      id: 11,
      code: "COE4101",
      name: "Artificial Intelligence",
      credits: 15,
      semester: "Semester 1",
      lecturer: "Dr. Kevin Martinez",
      status: "Active",
      lastUpdated: "2024-09-17",
    },
    {
      id: 12,
      code: "COE4102",
      name: "Final Year Project",
      credits: 30,
      semester: "Full Year",
      lecturer: "Various Supervisors",
      status: "Active",
      lastUpdated: "2024-09-19",
    },
  ];

  const filterModules = (modules: Module[]) => {
    return modules.filter((module) => {
      const matchesSearch =
        module.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.lecturer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        filterStatus === "all" || module.status === filterStatus;
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

  const renderModuleTable = (
    modules: Module[],
    page: number,
    setPage: (page: number) => void
  ) => {
    const filteredModules = filterModules(modules);
    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentModules = filteredModules.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredModules.length / ITEMS_PER_PAGE);

    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Module Code</TableHead>
              <TableHead>Module Name</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Semester</TableHead>
              <TableHead>Lecturer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentModules.length > 0 ? (
              currentModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium text-gray-900">
                    {module.code}
                  </TableCell>
                  <TableCell className="text-gray-700">{module.name}</TableCell>
                  <TableCell className="text-gray-700">
                    {module.credits}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {module.semester}
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {module.lecturer}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(module.status)}>
                      {module.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    {module.lastUpdated}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/department/curriculum/${module.code}`}
                      passHref
                      legacyBehavior
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#026892] hover:bg-blue-50"
                      >
                        <Eye className="h-4 w-4 mr-1" />
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
                  No modules found matching your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
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
      </>
    );
  };

  const allModules = [
    ...year1Modules,
    ...year2Modules,
    ...year3Modules,
    ...year4Modules,
  ];

  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Curriculum Management
          </h1>
          <p className="text-gray-600 mt-1">
            Oversee and update the department's academic curriculum
          </p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Curriculum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Module</DialogTitle>
              <DialogDescription>
                Create a new module for the curriculum
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="code">Module Code</Label>
                  <Input id="code" placeholder="e.g., COE1101" />
                </div>
                <div>
                  <Label htmlFor="credits">Credits</Label>
                  <Input id="credits" type="number" placeholder="15" />
                </div>
              </div>
              <div>
                <Label htmlFor="name">Module Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Introduction to Programming"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Year 1</SelectItem>
                      <SelectItem value="2">Year 2</SelectItem>
                      <SelectItem value="3">Year 3</SelectItem>
                      <SelectItem value="4">Year 4</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="semester">Semester</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Semester 1</SelectItem>
                      <SelectItem value="2">Semester 2</SelectItem>
                      <SelectItem value="full">Full Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="lecturer">Assigned Lecturer</Label>
                <Input id="lecturer" placeholder="e.g., Dr. Alice Iradukunda" />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Module description..."
                />
              </div>
              <div>
                <Label htmlFor="pdf">Upload Curriculum PDF</Label>
                <Input id="pdf" type="file" accept=".pdf" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#026892] hover:bg-[#026892]/90">
                Create Module
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Modules
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {allModules.length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Across all years</span>
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
                  Total Credits
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {allModules.reduce((sum, m) => sum + m.credits, 0)}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Credit hours</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Active Modules
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {allModules.filter((m) => m.status === "Active").length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>Currently active</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Under Review
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {
                    allModules.filter((m) => m.status === "Under Review")
                      .length
                  }
                </h3>
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <span>Needs attention</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
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
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or lecturer..."
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
                {renderModuleTable(year1Modules, page1, setPage1)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year2" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or lecturer..."
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
                {renderModuleTable(year2Modules, page2, setPage2)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year3" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or lecturer..."
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
                {renderModuleTable(year3Modules, page3, setPage3)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="year4" className="mt-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search by code, name, or lecturer..."
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
                {renderModuleTable(year4Modules, page4, setPage4)}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}