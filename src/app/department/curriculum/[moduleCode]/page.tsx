"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Edit,
  Download,
  Upload,
  FileText,
  Calendar,
  User,
  BookOpen,
  Award,
  Clock,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ModuleDetailPage() {
  const params = useParams();
  const moduleCode = params?.code as string;
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 15; // Example total pages

  // Mock module data - in a real app, this would come from an API
  const moduleData = {
    code: moduleCode || "COE1101",
    name: "Introduction to Programming",
    credits: 15,
    semester: "Semester 1",
    year: "Year 1",
    lecturer: "Dr. Alice Iradukunda",
    status: "Active",
    lastUpdated: "2024-09-15",
    description:
      "This module introduces students to fundamental programming concepts using Python. Students will learn variables, control structures, functions, and basic data structures.",
    learningOutcomes: [
      "Understand basic programming concepts and syntax",
      "Write simple programs to solve computational problems",
      "Debug and test code effectively",
      "Apply problem-solving techniques to programming challenges",
    ],

    prerequisites: ["None"],
    pdfUrl: "#", // In real app, this would be actual PDF URL
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

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handlePagePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handlePageNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleBackToCurriculum = () => {
    window.location.href = "/department/curriculum";
  };

  return (
    <div className="flex-1 p-4 md:p-6 grid gap-6">
      {/* Header */}
      <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToCurriculum}
                className="text-gray-600 hover:text-gray-900"
              >
                <ChevronRight className="h-4 w-4 rotate-180 mr-2" />
                Back to Curriculums
              </Button>
            </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {moduleData.code} - {moduleData.name}
            </h1>
            <p className="text-gray-600 mt-1">Module curriculum details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="text-[#026892] border-[#026892]"
          >
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
                <Edit className="mr-2 h-4 w-4" />
                Edit Module
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Module</DialogTitle>
                <DialogDescription>
                  Update module information and curriculum PDF
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-code">Module Code</Label>
                    <Input
                      id="edit-code"
                      defaultValue={moduleData.code}
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-credits">Credits</Label>
                    <Input
                      id="edit-credits"
                      type="number"
                      defaultValue={moduleData.credits}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-name">Module Name</Label>
                  <Input id="edit-name" defaultValue={moduleData.name} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="edit-year">Year</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
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
                    <Label htmlFor="edit-semester">Semester</Label>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
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
                  <Label htmlFor="edit-lecturer">Assigned Lecturer</Label>
                  <Input
                    id="edit-lecturer"
                    defaultValue={moduleData.lecturer}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select defaultValue="Active">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    defaultValue={moduleData.description}
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-pdf">
                    Update Curriculum PDF (Optional)
                  </Label>
                  <div className="mt-2">
                    <div className="flex items-center justify-center w-full">
                      <label
                        htmlFor="edit-pdf"
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-3 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">
                            PDF files only (MAX. 10MB)
                          </p>
                        </div>
                        <input
                          id="edit-pdf"
                          type="file"
                          className="hidden"
                          accept=".pdf"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#026892] hover:bg-[#026892]/90"
                  onClick={() => {
                    // Handle save logic here
                    setIsEditDialogOpen(false);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module Information Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Module Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Status
                </Label>
                <div className="mt-1">
                  <Badge className={getStatusColor(moduleData.status)}>
                    {moduleData.status}
                  </Badge>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <BookOpen className="h-4 w-4" />
                  <Label className="text-sm font-medium">Module Code</Label>
                </div>
                <p className="text-sm text-gray-900">{moduleData.code}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Award className="h-4 w-4" />
                  <Label className="text-sm font-medium">Credits</Label>
                </div>
                <p className="text-sm text-gray-900">{moduleData.credits}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Calendar className="h-4 w-4" />
                  <Label className="text-sm font-medium">Semester</Label>
                </div>
                <p className="text-sm text-gray-900">{moduleData.semester}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <User className="h-4 w-4" />
                  <Label className="text-sm font-medium">Lecturer</Label>
                </div>
                <p className="text-sm text-gray-900">{moduleData.lecturer}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <Clock className="h-4 w-4" />
                  <Label className="text-sm font-medium">Last Updated</Label>
                </div>
                <p className="text-sm text-gray-900">
                  {moduleData.lastUpdated}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Learning Outcomes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {moduleData.learningOutcomes.map((outcome, index) => (
                  <li key={index} className="text-sm text-gray-700">
                    <span className="font-medium text-[#026892]">
                      {index + 1}.
                    </span>{" "}
                    {outcome}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* PDF Viewer */}
        <div className="lg:col-span-2">
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    Curriculum Document
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Module curriculum PDF
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomOut}
                    disabled={zoomLevel <= 50}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <span className="text-sm font-medium text-gray-700 min-w-[60px] text-center">
                    {zoomLevel}%
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleZoomIn}
                    disabled={zoomLevel >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* PDF Viewer Mockup */}
              <div className="border-2 border-gray-200 rounded-lg overflow-hidden">
                <div
                  className="bg-gray-100 p-8 flex items-center justify-center min-h-[600px]"
                  style={{ transform: `scale(${zoomLevel / 100})` }}
                >
                  <div className="bg-white shadow-lg p-8 max-w-2xl w-full">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText className="h-8 w-8 text-[#026892]" />
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">
                          {moduleData.name}
                        </h2>
                        <p className="text-sm text-gray-600">
                          {moduleData.code}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-4 text-sm text-gray-700">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Module Description
                        </h3>
                        <p>{moduleData.description}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Prerequisites
                        </h3>
                        <p>{moduleData.prerequisites.join(", ")}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Learning Outcomes
                        </h3>
                        <ul className="list-disc list-inside space-y-1">
                          {moduleData.learningOutcomes.map((outcome, idx) => (
                            <li key={idx}>{outcome}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                {/* PDF Navigation */}
                <div className="bg-gray-50 border-t border-gray-200 px-4 py-3 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePagePrev}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Previous
                  </Button>
                  <span className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePageNext}
                    disabled={currentPage === totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}