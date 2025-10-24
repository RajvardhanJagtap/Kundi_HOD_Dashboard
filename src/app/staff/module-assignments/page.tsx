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
  CalendarIcon,
  Loader2,
  Plus,
  Users,
  BookOpen,
  UserCheck,
  AlertCircle,
  Search,
  Filter,
} from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranscripts } from "@/hooks/transcripts/useAllGroups";
import {
  useModuleAssignments,
  useLecturersByDepartment,
  useModulesByDepartment,
  useCreateModuleAssignment,
} from "@/hooks/modules-assigment/useModuleAssignments";

export default function ModuleAssignmentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedLecturer, setSelectedLecturer] = useState("all");
  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [currentSemesterId, setCurrentSemesterId] = useState<string>("");

  // Form state
  const [formData, setFormData] = useState({
    moduleId: "",
    instructorId: "",
    groupId: "",
    assignmentDate: new Date(),
    startDate: new Date(),
    endDate: new Date(),
    creditHours: "",
    contactHours: "",
    assignmentType: "",
    notes: "",
    isActive: "true",
    isPrimary: "true",
    teachingMethods: "",
    assessmentMethods: "",
    venue: "",
    schedule: "",
    maxStudents: "",
    currentEnrollment: "0",
  });

  // Initialize from localStorage (support both selectedAcademicYearId and selectedAcademicYear keys)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const getItem = (k: string) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const storedAcademicYearId = getItem("selectedAcademicYearId");
    const storedAcademicYear = getItem("selectedAcademicYear");
    const storedSemesterId =
      getItem("selectedSemesterId") || getItem("selectedSemester");

    const yearIdToUse =
      storedAcademicYearId && storedAcademicYearId.trim().length > 0
        ? storedAcademicYearId.trim()
        : storedAcademicYear && storedAcademicYear.trim().length > 0
        ? storedAcademicYear.trim()
        : "";

    if (yearIdToUse) setAcademicYearId(yearIdToUse);
    if (storedSemesterId) setCurrentSemesterId(storedSemesterId);
  }, []);

  // Hooks
  const {
    groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useTranscripts({ academicYearId });
  const {
    assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch,
  } = useModuleAssignments({ academicYearId });
  const {
    lecturers,
    isLoading: lecturersLoading,
    error: lecturersError,
  } = useLecturersByDepartment();
  const {
    modules,
    isLoading: modulesLoading,
    error: modulesError,
  } = useModulesByDepartment();
  const { createAssignment, isCreating } = useCreateModuleAssignment();

  // Filter assignments
  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesSearch =
        assignment.moduleName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.moduleCode
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.instructorName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        assignment.groupName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesGroup =
        selectedGroup === "all" || assignment.groupId === selectedGroup;
      const matchesLecturer =
        selectedLecturer === "all" ||
        assignment.instructorId === selectedLecturer;

      return matchesSearch && matchesGroup && matchesLecturer;
    });
  }, [assignments, searchTerm, selectedGroup, selectedLecturer]);

  // Statistics
  const statistics = useMemo(() => {
    const totalAssignments = assignments.length;
    const uniqueModules = new Set(assignments.map((a) => a.moduleId)).size;
    const uniqueLecturers = new Set(assignments.map((a) => a.instructorId))
      .size;
    const uniqueGroups = new Set(assignments.map((a) => a.groupId)).size;
    const activeAssignments = assignments.filter((a) => a.isActive).length;

    return {
      totalAssignments,
      uniqueModules,
      uniqueLecturers,
      uniqueGroups,
      activeAssignments,
    };
  }, [assignments]);

  // Handle form submission
  const handleCreateAssignment = async () => {
    try {
      if (!formData.moduleId || !formData.instructorId || !formData.groupId) {
        toast.error("Please fill in all required fields");
        return;
      }

      await createAssignment({
        moduleId: formData.moduleId,
        instructorId: formData.instructorId,
        groupId: formData.groupId,
        academicYearId,
        semesterId: currentSemesterId,
        assignmentDate: format(formData.assignmentDate, "yyyy-MM-dd"),
        startDate: format(formData.startDate, "yyyy-MM-dd"),
        endDate: format(formData.endDate, "yyyy-MM-dd"),
        creditHours: formData.creditHours,
        contactHours: formData.contactHours,
        assignmentType: formData.assignmentType,
        notes: formData.notes,
        isActive: formData.isActive,
        isPrimary: formData.isPrimary,
        teachingMethods: formData.teachingMethods,
        assessmentMethods: formData.assessmentMethods,
        venue: formData.venue,
        schedule: formData.schedule,
        maxStudents: formData.maxStudents,
        currentEnrollment: formData.currentEnrollment,
      });

      toast.success("Module assignment created successfully!");
      setIsCreateDialogOpen(false);
      refetch();

      // Reset form
      setFormData({
        moduleId: "",
        instructorId: "",
        groupId: "",
        assignmentDate: new Date(),
        startDate: new Date(),
        endDate: new Date(),
        creditHours: "",
        contactHours: "",
        assignmentType: "",
        notes: "",
        isActive: "true",
        isPrimary: "true",
        teachingMethods: "",
        assessmentMethods: "",
        venue: "",
        schedule: "",
        maxStudents: "",
        currentEnrollment: "0",
      });
    } catch (error) {
      toast.error("Failed to create module assignment");
    }
  };

  // Handle errors
  if (assignmentsError || groupsError || lecturersError || modulesError) {
    return (
      <div className="space-y-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-red-800">
            {assignmentsError || groupsError || lecturersError || modulesError}
          </AlertDescription>
        </Alert>
        <Button onClick={refetch} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  const isLoading =
    assignmentsLoading || groupsLoading || lecturersLoading || modulesLoading;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Module Assignments
          </h1>
          <p className="text-gray-600 mt-1">
            Assign modules to lecturers for each class group
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Create New Module Assignment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Module Assignment</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="module">Module *</Label>
                  <Select
                    value={formData.moduleId}
                    onValueChange={(value) => {
                      setFormData((prev) => ({ ...prev, moduleId: value }));
                      const selectedModule = modules.find(
                        (m) => m.id === value
                      );
                      if (selectedModule) {
                        setFormData((prev) => ({
                          ...prev,
                          creditHours: selectedModule.credits.toString(),
                          contactHours: selectedModule.contactHours.toString(),
                        }));
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select module" />
                    </SelectTrigger>
                    <SelectContent>
                      {modules.map((module) => (
                        <SelectItem key={module.id} value={module.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{module.code}</span>
                            <span className="text-sm text-gray-600">
                              {module.name}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Lecturer *</Label>
                  <Select
                    value={formData.instructorId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, instructorId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select lecturer" />
                    </SelectTrigger>
                    <SelectContent>
                      {lecturers.map((lecturer) => (
                        <SelectItem key={lecturer.id} value={lecturer.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {lecturer.fullName}
                            </span>
                            <span className="text-sm text-gray-600">
                              {lecturer.email}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group">Class Group *</Label>
                  <Select
                    value={formData.groupId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, groupId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class group" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{group.name}</span>
                            <span className="text-sm text-gray-600">
                              {group.code} - Year {group.yearLevel}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignmentType">Assignment Type</Label>
                  <Select
                    value={formData.assignmentType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        assignmentType: value,
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select assignment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PRIMARY">
                        Primary Instructor
                      </SelectItem>
                      <SelectItem value="SECONDARY">
                        Secondary Instructor
                      </SelectItem>
                      <SelectItem value="ASSISTANT">
                        Assistant Instructor
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignmentDate">Assignment Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.assignmentDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.assignmentDate}
                        onSelect={(date) =>
                          date &&
                          setFormData((prev) => ({
                            ...prev,
                            assignmentDate: date,
                          }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.startDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.startDate}
                        onSelect={(date) =>
                          date &&
                          setFormData((prev) => ({ ...prev, startDate: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(formData.endDate, "PPP")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.endDate}
                        onSelect={(date) =>
                          date &&
                          setFormData((prev) => ({ ...prev, endDate: date }))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creditHours">Credit Hours</Label>
                  <Input
                    id="creditHours"
                    type="number"
                    value={formData.creditHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        creditHours: e.target.value,
                      }))
                    }
                    placeholder="Enter credit hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactHours">Contact Hours</Label>
                  <Input
                    id="contactHours"
                    type="number"
                    value={formData.contactHours}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        contactHours: e.target.value,
                      }))
                    }
                    placeholder="Enter contact hours"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxStudents">Max Students</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxStudents: e.target.value,
                      }))
                    }
                    placeholder="Enter max students"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    value={formData.venue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        venue: e.target.value,
                      }))
                    }
                    placeholder="Enter venue"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="schedule">Schedule</Label>
                  <Input
                    id="schedule"
                    value={formData.schedule}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        schedule: e.target.value,
                      }))
                    }
                    placeholder="Enter schedule (e.g., Mon/Wed/Fri 9:00-10:30)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teachingMethods">Teaching Methods</Label>
                  <Textarea
                    id="teachingMethods"
                    value={formData.teachingMethods}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        teachingMethods: e.target.value,
                      }))
                    }
                    placeholder="Enter teaching methods"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assessmentMethods">Assessment Methods</Label>
                  <Textarea
                    id="assessmentMethods"
                    value={formData.assessmentMethods}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        assessmentMethods: e.target.value,
                      }))
                    }
                    placeholder="Enter assessment methods"
                    rows={3}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, notes: e.target.value }))
                  }
                  placeholder="Enter any additional notes"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateAssignment}
                  disabled={isCreating}
                  className="bg-[#026892] hover:bg-[#026892]/90"
                >
                  {isCreating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Create Assignment
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Assignments
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    statistics.totalAssignments
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#026892]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Modules</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    statistics.uniqueModules
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Lecturers</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    statistics.uniqueLecturers
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Groups</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    statistics.uniqueGroups
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-800">
                  {isLoading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    statistics.activeAssignments
                  )}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search assignments by module, lecturer, or group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Groups" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                {groups.map((group) => (
                  <SelectItem key={group.id} value={group.id}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedLecturer}
              onValueChange={setSelectedLecturer}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Lecturers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lecturers</SelectItem>
                {lecturers.map((lecturer) => (
                  <SelectItem key={lecturer.id} value={lecturer.id}>
                    {lecturer.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Module Assignments ({filteredAssignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading module assignments...</span>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Module</TableHead>
                    <TableHead className="text-gray-700">Lecturer</TableHead>
                    <TableHead className="text-gray-700">Group</TableHead>
                    <TableHead className="text-gray-700">Semester</TableHead>
                    <TableHead className="text-gray-700">Credits</TableHead>
                    <TableHead className="text-gray-700">
                      Contact Hours
                    </TableHead>
                    <TableHead className="text-gray-700">Students</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments.map((assignment) => (
                    <TableRow key={assignment.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {assignment.moduleCode}
                          </div>
                          <div className="text-sm text-gray-600">
                            {assignment.moduleName}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {assignment.instructorName}
                          </div>
                          <div className="text-sm text-gray-600">
                            {assignment.instructorEmail}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {assignment.groupName}
                          </div>
                          {/* <div className="text-sm text-gray-600">{assignment.groupCode}</div> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {assignment.semesterName}
                          </div>
                          {/* <div className="text-sm text-gray-600">Semester {assignment.semesterNumber}</div> */}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {assignment.moduleCredits}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {assignment.contactHours} hrs
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>
                            {assignment.currentEnrollment}/
                            {assignment.maxStudents}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            assignment.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }
                        >
                          {assignment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#026892] hover:text-[#026892]/90"
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && filteredAssignments.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No module assignments found matching your search criteria.</p>
              <p className="text-sm mt-2">
                Try creating a new assignment using the button above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
