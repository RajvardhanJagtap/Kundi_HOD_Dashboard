"use client";

import { useState, useMemo } from "react";
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
  Plus,
  Users,
  UserCheck,
  GraduationCap,
  AlertCircle,
  Search,
  Pencil,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function LecturerRegistrationPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [editingLecturer, setEditingLecturer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    qualification: "",
    specialization: "",
    employmentType: "",
    employmentStatus: "ACTIVE",
    officeLocation: "",
    officeHours: "",
    researchInterests: "",
    bio: "",
    dateOfJoining: new Date(),
    title: "",
    nationality: "",
    nationalId: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  // Mock data for lecturers
  const [lecturers] = useState([
    {
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@university.edu",
      phone: "+250788123456",
      department: "Computer Science",
      departmentId: "dept1",
      qualification: "PhD in Computer Science",
      specialization: "Artificial Intelligence",
      employmentType: "Full-Time",
      employmentStatus: "ACTIVE",
      officeLocation: "Block A, Room 201",
      title: "Senior Lecturer",
      dateOfJoining: "2020-09-01",
    },
    {
      id: "2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@university.edu",
      phone: "+250788234567",
      department: "Computer Science",
      departmentId: "dept1",
      qualification: "MSc in Software Engineering",
      specialization: "Web Development",
      employmentType: "Part-Time",
      employmentStatus: "ACTIVE",
      officeLocation: "Block A, Room 203",
      title: "Assistant Lecturer",
      dateOfJoining: "2021-02-15",
    },
    {
      id: "3",
      firstName: "Robert",
      lastName: "Johnson",
      email: "robert.j@university.edu",
      phone: "+250788345678",
      department: "Mathematics",
      departmentId: "dept2",
      qualification: "PhD in Mathematics",
      specialization: "Applied Mathematics",
      employmentType: "Full-Time",
      employmentStatus: "ON_LEAVE",
      officeLocation: "Block B, Room 105",
      title: "Professor",
      dateOfJoining: "2018-08-20",
    },
  ]);

  // Mock departments
  const departments = [
    { id: "dept1", name: "Computer Science" },
    { id: "dept2", name: "Mathematics" },
    { id: "dept3", name: "Physics" },
    { id: "dept4", name: "Chemistry" },
  ];

  // Filter lecturers
  const filteredLecturers = useMemo(() => {
    return lecturers.filter((lecturer) => {
      const matchesSearch =
        lecturer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lecturer.specialization.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDepartment =
        selectedDepartment === "all" || lecturer.departmentId === selectedDepartment;
      const matchesStatus =
        selectedStatus === "all" || lecturer.employmentStatus === selectedStatus;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [lecturers, searchTerm, selectedDepartment, selectedStatus]);

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredLecturers.length / itemsPerPage);

  // Statistics
  const statistics = useMemo(() => {
    const totalLecturers = lecturers.length;
    const activeLecturers = lecturers.filter((l) => l.employmentStatus === "ACTIVE").length;
    const fullTimeLecturers = lecturers.filter((l) => l.employmentType === "Full-Time").length;
    const uniqueDepartments = new Set(lecturers.map((l) => l.departmentId)).size;

    return {
      totalLecturers,
      activeLecturers,
      fullTimeLecturers,
      uniqueDepartments,
    };
  }, [lecturers]);

  // Handle form submission
  const handleCreateLecturer = async () => {
    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.department) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsCreating(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Lecturer registered successfully!");
      setIsCreateDialogOpen(false);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        department: "",
        qualification: "",
        specialization: "",
        employmentType: "",
        employmentStatus: "ACTIVE",
        officeLocation: "",
        officeHours: "",
        researchInterests: "",
        bio: "",
        dateOfJoining: new Date(),
        title: "",
        nationality: "",
        nationalId: "",
        gender: "",
        dateOfBirth: "",
        address: "",
        emergencyContact: "",
        emergencyPhone: "",
      });
    } catch (error) {
      toast.error("Failed to register lecturer");
    } finally {
      setIsCreating(false);
    }
  };

  // Handle edit click
  const handleEditClick = (lecturer: any) => {
    setEditingLecturer(lecturer);
    setIsEditDialogOpen(true);
  };

  // Handle update lecturer
  const handleUpdateLecturer = async () => {
    try {
      if (!editingLecturer?.firstName || !editingLecturer?.email) {
        toast.error("Please fill in all required fields");
        return;
      }

      setIsUpdating(true);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Lecturer updated successfully!");
      setIsEditDialogOpen(false);
      setEditingLecturer(null);
    } catch (err: any) {
      console.error("Update lecturer error:", err);
      toast.error("Failed to update lecturer");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            Lecturer Registration
          </h1>
          <p className="text-gray-600 mt-1">
            Register and manage lecturers in your department
          </p>
        </div>

        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Register New Lecturer
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Register New Lecturer</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    placeholder="Enter first name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    placeholder="Enter last name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, email: e.target.value }))
                    }
                    placeholder="lecturer@university.edu"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, phone: e.target.value }))
                    }
                    placeholder="+250788123456"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, department: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Select
                    value={formData.title}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, title: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Assistant Lecturer">Assistant Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qualification">Highest Qualification</Label>
                  <Input
                    id="qualification"
                    value={formData.qualification}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, qualification: e.target.value }))
                    }
                    placeholder="e.g., PhD in Computer Science"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={formData.specialization}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, specialization: e.target.value }))
                    }
                    placeholder="e.g., Artificial Intelligence"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type</Label>
                  <Select
                    value={formData.employmentType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, employmentType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Visiting">Visiting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment Status</Label>
                  <Select
                    value={formData.employmentStatus}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, employmentStatus: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, gender: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    value={formData.nationality}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nationality: e.target.value }))
                    }
                    placeholder="e.g., Rwandan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">National ID</Label>
                  <Input
                    id="nationalId"
                    value={formData.nationalId}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, nationalId: e.target.value }))
                    }
                    placeholder="Enter national ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, dateOfBirth: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeLocation">Office Location</Label>
                  <Input
                    id="officeLocation"
                    value={formData.officeLocation}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, officeLocation: e.target.value }))
                    }
                    placeholder="e.g., Block A, Room 201"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officeHours">Office Hours</Label>
                  <Input
                    id="officeHours"
                    value={formData.officeHours}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, officeHours: e.target.value }))
                    }
                    placeholder="e.g., Mon-Fri 9:00-17:00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, address: e.target.value }))
                  }
                  placeholder="Enter full address"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, emergencyContact: e.target.value }))
                    }
                    placeholder="Enter emergency contact name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyPhone">Emergency Contact Phone</Label>
                  <Input
                    id="emergencyPhone"
                    value={formData.emergencyPhone}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, emergencyPhone: e.target.value }))
                    }
                    placeholder="+250788123456"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="researchInterests">Research Interests</Label>
                <Textarea
                  id="researchInterests"
                  value={formData.researchInterests}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, researchInterests: e.target.value }))
                  }
                  placeholder="Enter research interests and areas of expertise"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, bio: e.target.value }))
                  }
                  placeholder="Enter brief biography"
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
                  onClick={handleCreateLecturer}
                  disabled={isCreating}
                  className="bg-[#026892] hover:bg-[#026892]/90"
                >
                  {isCreating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Register Lecturer
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Total Lecturers</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  statistics.totalLecturers.toLocaleString()
                )}
              </h3>
              <p className="text-[11px] font-medium text-green-600 truncate">↑ +5% from last semester</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-[#026892]" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Active Lecturers</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  `${((statistics.activeLecturers / statistics.totalLecturers) * 100).toFixed(1)}%`
                )}
              </h3>
              <p className="text-[11px] font-medium text-green-600 truncate">↑ +3.2% from last week</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <UserCheck className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Full-Time Staff</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  statistics.fullTimeLecturers
                )}
              </h3>
              <p className="text-[11px] font-medium text-orange-600 truncate">{statistics.totalLecturers - statistics.fullTimeLecturers} part-time</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Departments</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  statistics.uniqueDepartments
                )}
              </h3>
              <p className="text-[11px] font-medium text-purple-600 truncate">↑ +1 from last month</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Lecturers Table with Filters */}
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search lecturers by name, email, or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Departments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Loading lecturers...</span>
            </div>
          ) : (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-gray-700">Lecturer</TableHead>
                    <TableHead className="text-gray-700">Contact</TableHead>
                    <TableHead className="text-gray-700">Department</TableHead>
                    <TableHead className="text-gray-700">Specialization</TableHead>
                    <TableHead className="text-gray-700">Employment</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                    <TableHead className="text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLecturers
                    .slice(
                      (currentPage - 1) * itemsPerPage,
                      currentPage * itemsPerPage
                    )
                    .map((lecturer) => (
                      <TableRow
                        key={lecturer.id}
                        className="hover:bg-gray-50"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-[#026892] text-white rounded-full w-10 h-10 flex items-center justify-center font-semibold">
                              {lecturer.firstName[0]}{lecturer.lastName[0]}
                            </div>
                            <div>
                              <div className="font-medium">
                                {lecturer.firstName} {lecturer.lastName}
                              </div>
                              <div className="text-sm text-gray-600">
                                {lecturer.title}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{lecturer.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{lecturer.phone}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{lecturer.department}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">{lecturer.specialization}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {lecturer.employmentType}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              lecturer.employmentStatus === "ACTIVE"
                                ? "bg-green-100 text-green-800"
                                : lecturer.employmentStatus === "ON_LEAVE"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {lecturer.employmentStatus.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-[#026892] hover:text-[#026892]/90 hover:bg-[#026892]/10"
                            onClick={() => handleEditClick(lecturer)}
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

          {!isLoading && filteredLecturers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No lecturers found matching your search criteria.</p>
              <p className="text-sm mt-2">
                Try creating a new lecturer using the button above.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Lecturer Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-[#026892]">
              Edit Lecturer Information
            </DialogTitle>
            <p className="text-gray-600 mt-2">
              Update the lecturer's details and information
            </p>
          </DialogHeader>

          {editingLecturer && (
            <div className="space-y-6 py-4">
              {/* Lecturer Info Card */}
              <div className="bg-gradient-to-br from-[#026892]/5 to-[#026892]/10 border border-[#026892]/20 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-[#026892] text-white rounded-full w-16 h-16 flex items-center justify-center font-semibold text-xl">
                    {editingLecturer.firstName[0]}{editingLecturer.lastName[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900 mb-1">
                      {editingLecturer.firstName} {editingLecturer.lastName}
                    </h3>
                    <p className="text-gray-700 mb-3">
                      {editingLecturer.title} - {editingLecturer.department}
                    </p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#026892]" />
                        <span className="text-gray-600">
                          {editingLecturer.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-[#026892]" />
                        <span className="text-gray-600">
                          {editingLecturer.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-firstName">First Name *</Label>
                  <Input
                    id="edit-firstName"
                    value={editingLecturer.firstName}
                    onChange={(e) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        firstName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-lastName">Last Name *</Label>
                  <Input
                    id="edit-lastName"
                    value={editingLecturer.lastName}
                    onChange={(e) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        lastName: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editingLecturer.email}
                    onChange={(e) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        email: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-phone">Phone Number</Label>
                  <Input
                    id="edit-phone"
                    value={editingLecturer.phone}
                    onChange={(e) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Select
                    value={editingLecturer.title}
                    onValueChange={(value) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        title: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select title" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Professor">Professor</SelectItem>
                      <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                      <SelectItem value="Senior Lecturer">Senior Lecturer</SelectItem>
                      <SelectItem value="Lecturer">Lecturer</SelectItem>
                      <SelectItem value="Assistant Lecturer">Assistant Lecturer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-employmentType">Employment Type</Label>
                  <Select
                    value={editingLecturer.employmentType}
                    onValueChange={(value) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        employmentType: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Visiting">Visiting</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-employmentStatus">Employment Status</Label>
                  <Select
                    value={editingLecturer.employmentStatus}
                    onValueChange={(value) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        employmentStatus: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ACTIVE">Active</SelectItem>
                      <SelectItem value="ON_LEAVE">On Leave</SelectItem>
                      <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-officeLocation">Office Location</Label>
                  <Input
                    id="edit-officeLocation"
                    value={editingLecturer.officeLocation}
                    onChange={(e) =>
                      setEditingLecturer({
                        ...editingLecturer,
                        officeLocation: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-specialization">Specialization</Label>
                <Input
                  id="edit-specialization"
                  value={editingLecturer.specialization}
                  onChange={(e) =>
                    setEditingLecturer({
                      ...editingLecturer,
                      specialization: e.target.value,
                    })
                  }
                />
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingLecturer(null);
                  }}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateLecturer}
                  className="bg-[#026892] hover:bg-[#026892]/90 text-white px-6"
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <UserCheck className="w-4 h-4 mr-2" />
                  )}
                  {isUpdating ? "Updating..." : "Update Lecturer"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}