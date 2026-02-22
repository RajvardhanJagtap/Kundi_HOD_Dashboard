"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Loader2,
  Users,
  BookOpen,
  UserCheck,
  AlertCircle,
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Clock,
  AlertTriangle,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Mock data structure - Replace with actual hooks when available
interface Claim {
  id: string;
  claimId: string;
  studentRegistration: string;
  moduleName: string;
  moduleCode: string;
  claimType: string;
  status: "OPEN" | "ASSIGNED" | "IN_REVIEW" | "RESOLVED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  submittedDate: string;
  dueDate: string;
  assignedLecturerId?: string;
  assignedLecturerName?: string;
  assignedLecturerEmail?: string;
  notes?: string;
}

interface Lecturer {
  id: string;
  fullName: string;
  email: string;
}

// Mock data
const mockClaims: Claim[] = [
  {
    id: "1",
    claimId: "CLM-H-001",
    studentRegistration: "UR2021/2023/0045",
    moduleName: "Data Structures",
    moduleCode: "CSC102",
    claimType: "GRADE_APPEAL",
    status: "OPEN",
    priority: "HIGH",
    submittedDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    id: "2",
    claimId: "CLM-H-002",
    studentRegistration: "UR2021/2023/0089",
    moduleName: "Database Systems",
    moduleCode: "CSC201",
    claimType: "ATTENDANCE_VARIANCE",
    status: "ASSIGNED",
    priority: "MEDIUM",
    submittedDate: "2024-12-02",
    dueDate: "2024-12-20",
    assignedLecturerId: "L001",
    assignedLecturerName: "Dr. Alice Smith",
    assignedLecturerEmail: "alice.smith@university.edu",
  },
  {
    id: "3",
    claimId: "CLM-H-003",
    studentRegistration: "UR2021/2023/0156",
    moduleName: "Software Engineering",
    moduleCode: "CSC203",
    claimType: "SPECIAL_CONSIDERATION",
    status: "IN_REVIEW",
    priority: "HIGH",
    submittedDate: "2024-12-03",
    dueDate: "2024-12-18",
    assignedLecturerId: "L002",
    assignedLecturerName: "Prof. Bob Johnson",
    assignedLecturerEmail: "bob.johnson@university.edu",
  },
];

const mockLecturers: Lecturer[] = [
  {
    id: "L001",
    fullName: "Dr. Alice Smith",
    email: "alice.smith@university.edu",
  },
  {
    id: "L002",
    fullName: "Prof. Bob Johnson",
    email: "bob.johnson@university.edu",
  },
  {
    id: "L003",
    fullName: "Dr. Emily White",
    email: "emily.white@university.edu",
  },
  {
    id: "L004",
    fullName: "Dr. John Davis",
    email: "john.davis@university.edu",
  },
];

export default function AssignClaimsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [editingClaim, setEditingClaim] = useState<Claim | null>(null);
  const [lecturerSearchTerm, setLecturerSearchTerm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Mock data - Replace with actual hooks
  const claims = mockClaims;
  const lecturers = mockLecturers;
  const isLoading = false;
  const claimsError = null;

  // Filter claims
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      const matchesSearch =
        claim.claimId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.studentRegistration
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        claim.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.moduleCode.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        selectedStatus === "all" || claim.status === selectedStatus;
      const matchesPriority =
        selectedPriority === "all" || claim.priority === selectedPriority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [claims, searchTerm, selectedStatus, selectedPriority]);

  // Filter lecturers for search
  const filteredLecturers = useMemo(() => {
    if (!lecturerSearchTerm) return lecturers;

    return lecturers.filter((lecturer) => {
      const searchLower = lecturerSearchTerm.toLowerCase();
      return (
        lecturer.fullName.toLowerCase().includes(searchLower) ||
        lecturer.email.toLowerCase().includes(searchLower)
      );
    });
  }, [lecturers, lecturerSearchTerm]);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);

  // Statistics
  const statistics = useMemo(() => {
    const openClaims = claims.filter((c) => c.status === "OPEN").length;
    const assignedClaims = claims.filter((c) => c.status === "ASSIGNED").length;
    const inReviewClaims = claims.filter(
      (c) => c.status === "IN_REVIEW"
    ).length;
    const highPriorityClaims = claims.filter(
      (c) => c.priority === "HIGH"
    ).length;

    return {
      openClaims,
      assignedClaims,
      inReviewClaims,
      highPriorityClaims,
    };
  }, [claims]);

  // Handle edit click
  const handleEditClick = (claim: Claim) => {
    setEditingClaim(claim);
    setLecturerSearchTerm("");
    setIsEditDialogOpen(true);
  };

  // Handle update claim
  const handleUpdateClaim = async () => {
    try {
      if (!editingClaim?.assignedLecturerId) {
        toast.error("Please select a lecturer");
        return;
      }

      setIsUpdating(true);

      // TODO: Replace with actual API call
      // await updateClaim(editingClaim.id, {
      //   assignedLecturerId: editingClaim.assignedLecturerId,
      //   notes: editingClaim.notes,
      // });

      toast.success("Claim assigned successfully!");
      setIsEditDialogOpen(false);
      setEditingClaim(null);
      setLecturerSearchTerm("");
    } catch (err: any) {
      console.error("Update claim error:", err);
      const serverMessage = err?.response?.data?.message || err?.message;
      toast.error(serverMessage || "Failed to assign claim");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle errors
  if (claimsError) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {claimsError}
          </AlertDescription>
        </Alert>
        <Button className="mt-4">Try Again</Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-red-100 text-red-800";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "IN_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "RESOLVED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Assign Claims
          </h1>
          <p className="text-gray-600 mt-1">
            Assign student claims to lecturers for review and resolution
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Claim Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Claim Assignment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="student">Student Registration *</Label>
                  <Input
                    id="student"
                    placeholder="e.g., UR2021/2023/0045"
                    className=""
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="module">Module *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CSC102">
                        CSC102 - Data Structures
                      </SelectItem>
                      <SelectItem value="CSC201">
                        CSC201 - Database Systems
                      </SelectItem>
                      <SelectItem value="CSC203">
                        CSC203 - Software Engineering
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimType">Claim Type *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GRADE_APPEAL">Grade Appeal</SelectItem>
                      <SelectItem value="ATTENDANCE_VARIANCE">
                        Attendance Variance
                      </SelectItem>
                      <SelectItem value="SPECIAL_CONSIDERATION">
                        Special Consideration
                      </SelectItem>
                      <SelectItem value="MISSING_SCORE">
                        Missing Score
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input id="dueDate" type="date" className="" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add details about the claim..."
                  rows={3}
                  className="resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#026892] hover:bg-[#026892]/90 text-white px-6"
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  {isCreating ? "Creating..." : "Create Claim Assignment"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Open Claims</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{statistics.openClaims}</h3>
              <p className="text-[11px] font-medium text-red-600 truncate">Requiring assignment</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Assigned Claims</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{statistics.assignedClaims}</h3>
              <p className="text-[11px] font-medium text-blue-600 truncate">Assigned to lecturers</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-[#026892]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">In Review</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{statistics.inReviewClaims}</h3>
              <p className="text-[11px] font-medium text-yellow-600 truncate">Being processed</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-yellow-50 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">High Priority</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{statistics.highPriorityClaims}</h3>
              <p className="text-[11px] font-medium text-red-600 truncate">Urgent claims</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Claims Table with Filters */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search claims by ID, student reg, or module..."
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
                <SelectItem value="OPEN">Open</SelectItem>
                <SelectItem value="ASSIGNED">Assigned</SelectItem>
                <SelectItem value="IN_REVIEW">In Review</SelectItem>
                <SelectItem value="RESOLVED">Resolved</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={selectedPriority}
              onValueChange={setSelectedPriority}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading claims...</span>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Claim ID</TableHead>
                    <TableHead className="text-gray-700">Student Reg</TableHead>
                    <TableHead className="text-gray-700">Module</TableHead>
                    <TableHead className="text-gray-700">Type</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Priority</TableHead>
                    <TableHead className="text-gray-700">Assigned To</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClaims
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((claim) => (
                      <TableRow key={claim.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="font-medium text-[#026892]">
                            {claim.claimId}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">
                            {claim.studentRegistration}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {claim.moduleCode}
                            </div>
                            <div className="text-sm text-gray-600">
                              {claim.moduleName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-700">
                            {claim.claimType.replace(/_/g, " ")}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(claim.status)}>
                            {claim.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getPriorityColor(claim.priority)}>
                            {claim.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {claim.assignedLecturerName ? (
                              <div>
                                <div className="font-medium">
                                  {claim.assignedLecturerName}
                                </div>
                                <div className="text-xs text-gray-600">
                                  {claim.assignedLecturerEmail}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-500">Unassigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#026892] hover:text-[#026892]/90 hover:bg-[#026892]/10"
                            onClick={() => handleEditClick(claim)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>

              {/* Pagination Controls */}
              <div className="flex items-center justify-end gap-2 py-4 px-4">
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
                  (page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
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
            </div>
          )}

          {!isLoading && filteredClaims.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No claims found matching your search criteria.</p>
              <p className="text-sm mt-2">
                Adjust your filters to see available claims.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Claim Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#026892]">
              Assign Claim
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              Assign this claim to a lecturer for review and resolution
            </p>
          </DialogHeader>

          {editingClaim && (
            <div className="space-y-6 py-4">
              {/* Claim Info Card */}
              <div className="bg-gradient-to-br from-[#026892]/5 to-[#026892]/10 border border-[#026892]/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#026892] p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {editingClaim.claimId}
                    </h3>
                    <p className="text-gray-700 mb-3">
                      {editingClaim.moduleName}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#026892]" />
                        <span className="text-gray-600">
                          Student:{" "}
                          <span className="font-medium text-gray-900">
                            {editingClaim.studentRegistration}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-[#026892]" />
                        <span className="text-gray-600">
                          Priority:{" "}
                          <span className="font-medium text-gray-900">
                            {editingClaim.priority}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Assignment */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Assignment
                </Label>
                {editingClaim.assignedLecturerName ? (
                  <div className="flex items-center gap-3">
                    <div className="bg-[#026892] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                      {editingClaim.assignedLecturerName
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {editingClaim.assignedLecturerName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {editingClaim.assignedLecturerEmail}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">Not yet assigned</p>
                )}
              </div>

              {/* Assign Lecturer */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Select Lecturer *
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <Select
                    value={editingClaim.assignedLecturerId || ""}
                    onValueChange={(value) => {
                      setEditingClaim({
                        ...editingClaim,
                        assignedLecturerId: value,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full pl-10 h-12 border-2 border-gray-200 focus:border-[#026892] transition-colors">
                      <SelectValue placeholder="Search and select a lecturer..." />
                    </SelectTrigger>
                    <SelectContent className="max-h-[300px]">
                      <div className="px-2 py-2 sticky top-0 bg-white border-b z-10">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                          <Input
                            placeholder="Type to search lecturers..."
                            value={lecturerSearchTerm}
                            onChange={(e) =>
                              setLecturerSearchTerm(e.target.value)
                            }
                            className="pl-10 h-9"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="p-1">
                        {filteredLecturers.length > 0 ? (
                          filteredLecturers.map((lecturer) => (
                            <SelectItem
                              key={lecturer.id}
                              value={lecturer.id}
                              className="cursor-pointer hover:bg-[#026892]/5 rounded-md my-1"
                            >
                              <div className="flex items-center gap-3 py-2">
                                <div className="bg-[#026892]/10 text-[#026892] rounded-full w-10 h-10 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                  {lecturer.fullName
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .slice(0, 2)}
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <span className="font-medium text-gray-900 truncate">
                                    {lecturer.fullName}
                                  </span>
                                  <span className="text-sm text-gray-600 truncate">
                                    {lecturer.email}
                                  </span>
                                </div>
                              </div>
                            </SelectItem>
                          ))
                        ) : (
                          <div className="text-center py-6 text-gray-500">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">No lecturers found</p>
                            <p className="text-xs mt-1">
                              Try a different search term
                            </p>
                          </div>
                        )}
                      </div>
                    </SelectContent>
                  </Select>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Search by name or email to find the lecturer you want to
                  assign
                </p>
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Notes (Optional)
                </Label>
                <Textarea
                  placeholder="Add any additional notes or instructions for the assigned lecturer..."
                  value={editingClaim.notes || ""}
                  onChange={(e) =>
                    setEditingClaim({
                      ...editingClaim,
                      notes: e.target.value,
                    })
                  }
                  className="resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingClaim(null);
                    setLecturerSearchTerm("");
                  }}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateClaim}
                  className="bg-[#026892] hover:bg-[#026892]/90 text-white px-6"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4 mr-2" />
                  )}
                  {isUpdating ? "Assigning..." : "Assign Claim"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
