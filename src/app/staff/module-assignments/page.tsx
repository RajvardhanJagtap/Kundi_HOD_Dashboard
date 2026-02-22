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
  Pencil,
  ChevronLeft,
  ChevronRight,
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
  useUpdateModuleAssignment,
} from "@/hooks/modules-assigment/useModuleAssignments";
import { useSemesters } from "@/hooks/academic-year-and-semesters/useSemesters";

export default function ModuleAssignmentsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroup, setSelectedGroup] = useState("all");
  const [selectedLecturer, setSelectedLecturer] = useState("all");
  const [academicYearId, setAcademicYearId] = useState<string>("");
  const [currentSemesterId, setCurrentSemesterId] = useState<string>("");
  const [editingAssignment, setEditingAssignment] = useState<any>(null);
  const [lecturerSearchTerm, setLecturerSearchTerm] = useState("");
  const [moduleSearchTerm, setModuleSearchTerm] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    moduleId: "",
    instructorId: "",
    groupId: "",
    semesterId: "",
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

    const updateFromStorage = () => {
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
    };

    // Initial load
    updateFromStorage();

    // Listen for academic year and semester changes from header
    const handleStorageChange = () => {
      updateFromStorage();
    };

    window.addEventListener('academicYearChanged', handleStorageChange);
    window.addEventListener('semesterChanged', handleStorageChange);

    return () => {
      window.removeEventListener('academicYearChanged', handleStorageChange);
      window.removeEventListener('semesterChanged', handleStorageChange);
    };
  }, []);

  // Hooks
  const {
    groups,
    isLoading: groupsLoading,
    error: groupsError,
  } = useTranscripts({ academicYearId });
  const {
    semesters,
    isLoading: semestersLoading,
    error: semestersError,
  } = useSemesters(academicYearId);
  const {
    assignments,
    isLoading: assignmentsLoading,
    error: assignmentsError,
    refetch,
  } = useModuleAssignments({ academicYearId, semesterId: currentSemesterId });
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
  const { updateAssignment, isUpdating } = useUpdateModuleAssignment();

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

  // Filter modules for search
  const filteredModules = useMemo(() => {
    if (!moduleSearchTerm) return modules;

    return modules.filter((module) => {
      const searchLower = moduleSearchTerm.toLowerCase();
      return (
        module.name.toLowerCase().includes(searchLower) ||
        module.code.toLowerCase().includes(searchLower)
      );
    });
  }, [modules, moduleSearchTerm]);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredAssignments.length / itemsPerPage);

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
        semesterId: formData.semesterId,
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
      setModuleSearchTerm("");
      setLecturerSearchTerm("");
      refetch();

      // Reset form
      setFormData({
        moduleId: "",
        instructorId: "",
        groupId: "",
        semesterId: "",
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

  // Handle edit click
  const handleEditClick = (assignment: any) => {
    setEditingAssignment(assignment);
    setLecturerSearchTerm("");
    setIsEditDialogOpen(true);
  };

  // Handle update assignment
  const handleUpdateAssignment = async () => {
    try {
      if (!editingAssignment?.instructorId) {
        toast.error("Please select a lecturer");
        return;
      }

      // Prevent no-op: ensure the lecturer actually changed
      const currentLecturerId = editingAssignment?.instructorId || "";
      if (!editingAssignment.id) {
        toast.error("Invalid assignment selected");
        return;
      }

      // Call update hook
      await updateAssignment(editingAssignment.id, {
        assignmentId: editingAssignment.id,
        newLecturerId: editingAssignment.instructorId,
        reason: `Reassigned by HOD via UI`,
      });

      toast.success("Module assignment updated successfully!");
      setIsEditDialogOpen(false);
      setEditingAssignment(null);
      setLecturerSearchTerm("");
      refetch();
    } catch (err: any) {
      console.error("Update assignment error:", err);
      // Try to surface server message if available
      const serverMessage = err?.response?.data?.message || err?.message;
      toast.error(serverMessage || "Failed to update module assignment");
    }
  };

  // Handle errors
  if (
    assignmentsError ||
    groupsError ||
    lecturersError ||
    modulesError ||
    semestersError
  ) {
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
    assignmentsLoading ||
    groupsLoading ||
    lecturersLoading ||
    modulesLoading ||
    semestersLoading;

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

        <Dialog open={isCreateDialogOpen} onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setModuleSearchTerm("");
            setLecturerSearchTerm("");
          }
        }}>
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
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
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
                      <SelectTrigger className="w-full pl-10 h-12 border-2 border-gray-200 focus:border-[#026892] transition-colors">
                        <SelectValue placeholder="Search and select a module..." />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        <div className="px-2 py-2 sticky top-0 bg-white border-b z-10">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <Input
                              placeholder="Type to search modules..."
                              value={moduleSearchTerm}
                              onChange={(e) =>
                                setModuleSearchTerm(e.target.value)
                              }
                              className="pl-10 h-9"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                        <div className="p-1">
                          {filteredModules.length > 0 ? (
                            filteredModules.map((module) => (
                              <SelectItem
                                key={module.id}
                                value={module.id}
                                className="cursor-pointer hover:bg-[#026892]/5 rounded-md my-1"
                              >
                                <div className="flex items-center gap-3 py-2">
                                  <div className="text-[#026892] rounded-lg w-10 h-10 flex items-center justify-center font-semibold text-sm flex-shrink-0">
                                    {module.code}
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <span className="font-medium text-gray-900 truncate">
                                      {module.name}
                                    </span>
                                  </div>
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="text-center py-6 text-gray-500">
                              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                              <p className="text-sm">No modules found</p>
                              <p className="text-xs mt-1">
                                Try a different search term
                              </p>
                            </div>
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor">Lecturer *</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                    <Select
                      value={formData.instructorId}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, instructorId: value }))
                      }
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="group">Semester *</Label>
                  <Select
                    value={formData.semesterId}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, semesterId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((semester) => (
                        <SelectItem key={semester.id} value={semester.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              Semester {semester.name}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Assignments</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  statistics.totalAssignments
                )}
              </h3>
              <p className="text-[11px] font-medium text-gray-600 truncate">Total module assignments</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-[#026892]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Lecturers Involved</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  statistics.uniqueLecturers
                )}
              </h3>
              <p className="text-[11px] font-medium text-gray-600 truncate">Teaching staff</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Class Groups</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  statistics.uniqueGroups
                )}
              </h3>
              <p className="text-[11px] font-medium text-gray-600 truncate">Assigned groups</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Assignments Table with Filters */}
      <Card>
        <CardContent className="space-y-4 p-6">
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
                    <TableHead className="text-gray-700">Class</TableHead>
                    <TableHead className="text-gray-700">Semester</TableHead>
                    <TableHead className="text-gray-700">Credits</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssignments
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((assignment) => (
                      <TableRow
                        key={assignment.id}
                        className="hover:bg-gray-50"
                      >
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
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {assignment.semesterName}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {assignment.moduleCredits}
                          </Badge>
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
                            variant="ghost"
                            size="icon"
                            className="text-[#026892] hover:text-[#026892]/90 hover:bg-[#026892]/10"
                            onClick={() => handleEditClick(assignment)}
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

      {/* Edit Assignment Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#026892]">
              Edit Module Assignment
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              Update the lecturer for this module assignment
            </p>
          </DialogHeader>

          {editingAssignment && (
            <div className="space-y-6 py-4">
              {/* Module Info Card */}
              <div className="bg-gradient-to-br from-[#026892]/5 to-[#026892]/10 border border-[#026892]/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#026892] p-3 rounded-lg">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {editingAssignment.moduleCode}
                    </h3>
                    <p className="text-gray-700 mb-3">
                      {editingAssignment.moduleName}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-[#026892]" />
                        <span className="text-gray-600">
                          Group:{" "}
                          <span className="font-medium text-gray-900">
                            {editingAssignment.groupName}
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-[#026892]" />
                        <span className="text-gray-600">
                          Credits:{" "}
                          <span className="font-medium text-gray-900">
                            {editingAssignment.moduleCredits}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Lecturer */}
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <Label className="text-sm font-medium text-gray-700 mb-2 block">
                  Current Lecturer
                </Label>
                <div className="flex items-center gap-3">
                  <div className="bg-[#026892] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                    {editingAssignment.instructorName
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {editingAssignment.instructorName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {editingAssignment.instructorEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* New Lecturer Selection */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-900">
                  Select New Lecturer *
                </Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                  <Select
                    value={editingAssignment.instructorId}
                    onValueChange={(value) => {
                      setEditingAssignment({
                        ...editingAssignment,
                        instructorId: value,
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

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingAssignment(null);
                    setLecturerSearchTerm("");
                  }}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateAssignment}
                  className="bg-[#026892] hover:bg-[#026892]/90 text-white px-6"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4 mr-2" />
                  )}
                  {isUpdating ? "Updating..." : "Update Assignment"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
