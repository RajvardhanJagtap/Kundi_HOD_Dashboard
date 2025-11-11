"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  FileText,
  Archive,
  Eye,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const ITEMS_PER_PAGE = 10;

export default function ResourcesPage() {
  const [page, setPage] = useState(1);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const resources = [
    {
      fileName: "Department Budget 2024.xlsx",
      type: "Spreadsheet",
      uploadedBy: "Admin",
      date: "2024-07-15",
      size: "2.4 MB",
      icon: "FileSpreadsheet",
    },
    {
      fileName: "Faculty Meeting Agenda.pdf",
      type: "PDF Document",
      uploadedBy: "Dr. Emily White",
      date: "2024-07-20",
      size: "156 KB",
      icon: "FileText",
    },
    {
      fileName: "Lab Equipment Manuals.zip",
      type: "Archive",
      uploadedBy: "IT Support",
      date: "2024-07-10",
      size: "15.8 MB",
      icon: "Archive",
    },
    {
      fileName: "Annual Report 2024.pdf",
      type: "PDF Document",
      uploadedBy: "Dr. John Iradukunda",
      date: "2024-08-05",
      size: "3.2 MB",
      icon: "FileText",
    },
    {
      fileName: "Student Performance Analysis.xlsx",
      type: "Spreadsheet",
      uploadedBy: "Prof. Sarah Johnson",
      date: "2024-08-12",
      size: "1.8 MB",
      icon: "FileSpreadsheet",
    },
    {
      fileName: "Course Materials Archive.zip",
      type: "Archive",
      uploadedBy: "Admin",
      date: "2024-08-18",
      size: "45.6 MB",
      icon: "Archive",
    },
    {
      fileName: "Semester Schedule 2024-2025.pdf",
      type: "PDF Document",
      uploadedBy: "Dr. Michael Brown",
      date: "2024-08-25",
      size: "892 KB",
      icon: "FileText",
    },
    {
      fileName: "Faculty Research Papers.zip",
      type: "Archive",
      uploadedBy: "Dr. Emily White",
      date: "2024-09-02",
      size: "28.4 MB",
      icon: "Archive",
    },
    {
      fileName: "Department Guidelines.pdf",
      type: "PDF Document",
      uploadedBy: "Admin",
      date: "2024-09-10",
      size: "654 KB",
      icon: "FileText",
    },
    {
      fileName: "Equipment Inventory 2024.xlsx",
      type: "Spreadsheet",
      uploadedBy: "IT Support",
      date: "2024-09-15",
      size: "2.1 MB",
      icon: "FileSpreadsheet",
    },
    {
      fileName: "Student Handbook 2024.pdf",
      type: "PDF Document",
      uploadedBy: "Dr. John Iradukunda",
      date: "2024-09-20",
      size: "4.5 MB",
      icon: "FileText",
    },
    {
      fileName: "Lab Safety Protocols.pdf",
      type: "PDF Document",
      uploadedBy: "IT Support",
      date: "2024-09-25",
      size: "1.2 MB",
      icon: "FileText",
    },
  ];

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesType = filterType === "all" || resource.type === filterType;
    const matchesSearch = resource.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentResources = filteredResources.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);

  const getFileIcon = (iconName: string) => {
    switch (iconName) {
      case "FileSpreadsheet":
        return <FileSpreadsheet className="h-5 w-5 text-[#026892]" />;
      case "FileText":
        return <FileText className="h-5 w-5 text-[#026892]" />;
      case "Archive":
        return <Archive className="h-5 w-5 text-[#026892]" />;
      default:
        return <FileText className="h-5 w-5 text-[#026892]" />;
    }
  };

  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Department Resources
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and access shared departmental resources and documents
          </p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
          <PlusCircle className="mr-2 h-4 w-4" />
          Upload Resource
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Resources
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {resources.length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+8 from last month</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#026892]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  PDF Documents
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {resources.filter(r => r.type === "PDF Document").length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3 from last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Spreadsheets
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {resources.filter(r => r.type === "Spreadsheet").length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+2 from last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FileSpreadsheet className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Archives
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  {resources.filter(r => r.type === "Archive").length}
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+1 from last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <Archive className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="flex-1">
              <Input
                placeholder="Search by file name or uploader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PDF Document">PDF Documents</SelectItem>
                <SelectItem value="Spreadsheet">Spreadsheets</SelectItem>
                <SelectItem value="Archive">Archives</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded By</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentResources.length > 0 ? (
                  currentResources.map((resource, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {getFileIcon(resource.icon)}
                          <span className="font-medium text-gray-900">
                            {resource.fileName}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {resource.type}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {resource.size}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {resource.uploadedBy}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {resource.date}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#026892] hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#026892] hover:bg-blue-50"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      No resources found matching your filters
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}