"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  PlusCircle,
  CalendarIcon,
  Users,
  BookOpen,
  Clock,
  AlertTriangle,
  CheckCircle,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Module {
  id: number
  code: string
  name: string
  semester: string
  lecturer: string
  capacity: number
  enrolled: number
  status: string
  startDate: string
  endDate: string
  schedule: string
  room: string
  credits: number
  prerequisites: string[]
  description: string
}

interface Lecturer {
  id: number
  name: string
  department: string
  maxLoad: number
  currentLoad: number
}

export default function ModulePlanningPage() {
  const [selectedView, setSelectedView] = useState("calendar")
  const [selectedSemester, setSelectedSemester] = useState("fall-2024")
  const [currentMonth, setCurrentMonth] = useState(new Date(2024, 8)) // September 2024
  const [selectedModule, setSelectedModule] = useState<Module | null>(null)

  const modules: Module[] = [
    {
      id: 1,
      code: "CS101",
      name: "Introduction to Programming",
      semester: "Fall 2024",
      lecturer: "Dr. Smith",
      capacity: 100,
      enrolled: 95,
      status: "active",
      startDate: "2024-09-02",
      endDate: "2024-12-15",
      schedule: "Mon/Wed/Fri 09:00-10:30",
      room: "Lab A-101",
      credits: 3,
      prerequisites: [],
      description: "Fundamental programming concepts using Python",
    },
    {
      id: 2,
      code: "CS202",
      name: "Data Structures & Algorithms",
      semester: "Fall 2024",
      lecturer: "Prof. Johnson",
      capacity: 80,
      enrolled: 78,
      status: "active",
      startDate: "2024-09-02",
      endDate: "2024-12-15",
      schedule: "Tue/Thu 11:00-12:30",
      room: "Room B-205",
      credits: 4,
      prerequisites: ["CS101"],
      description: "Advanced data structures and algorithmic problem solving",
    },
    {
      id: 3,
      code: "CS303",
      name: "Database Systems",
      semester: "Spring 2025",
      lecturer: "Ms. Davis",
      capacity: 70,
      enrolled: 65,
      status: "planned",
      startDate: "2025-01-15",
      endDate: "2025-05-10",
      schedule: "Mon/Wed 14:00-15:30",
      room: "Lab C-301",
      credits: 3,
      prerequisites: ["CS101", "CS202"],
      description: "Database design, SQL, and database management systems",
    },
    {
      id: 4,
      code: "CS404",
      name: "Artificial Intelligence",
      semester: "Spring 2025",
      lecturer: "Dr. Brown",
      capacity: 60,
      enrolled: 58,
      status: "planned",
      startDate: "2025-01-15",
      endDate: "2025-05-10",
      schedule: "Tue/Thu 16:00-17:30",
      room: "Room A-401",
      credits: 4,
      prerequisites: ["CS202", "CS303"],
      description: "Machine learning, neural networks, and AI applications",
    },
    {
      id: 5,
      code: "CS105",
      name: "Web Development",
      semester: "Fall 2024",
      lecturer: "Unassigned",
      capacity: 90,
      enrolled: 0,
      status: "pending",
      startDate: "2024-09-02",
      endDate: "2024-12-15",
      schedule: "TBD",
      room: "TBD",
      credits: 3,
      prerequisites: ["CS101"],
      description: "HTML, CSS, JavaScript, and modern web frameworks",
    },
  ]

  const lecturers: Lecturer[] = [
    { id: 1, name: "Dr. Smith", department: "Computer Science", maxLoad: 12, currentLoad: 9 },
    { id: 2, name: "Prof. Johnson", department: "Computer Science", maxLoad: 15, currentLoad: 12 },
    { id: 3, name: "Ms. Davis", department: "Computer Science", maxLoad: 12, currentLoad: 6 },
    { id: 4, name: "Dr. Brown", department: "Computer Science", maxLoad: 12, currentLoad: 8 },
    { id: 5, name: "Dr. Wilson", department: "Computer Science", maxLoad: 12, currentLoad: 3 },
  ]

  const semesters = [
    { value: "fall-2024", label: "Fall 2024", startDate: "2024-09-02", endDate: "2024-12-15" },
    { value: "spring-2025", label: "Spring 2025", startDate: "2025-01-15", endDate: "2025-05-10" },
    { value: "summer-2025", label: "Summer 2025", startDate: "2025-06-01", endDate: "2025-08-15" },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "planned":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4" />
      case "planned":
        return <CalendarIcon className="h-4 w-4" />
      case "pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())

    const days = []
    const currentDate = new Date(startDate)

    for (let i = 0; i < 42; i++) {
      const dayModules = modules.filter((module) => {
        const moduleStart = new Date(module.startDate)
        const moduleEnd = new Date(module.endDate)
        return (
          currentDate >= moduleStart &&
          currentDate <= moduleEnd &&
          module.semester.toLowerCase().includes(selectedSemester.split("-")[0])
        )
      })

      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        modules: dayModules,
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }

    return days
  }

  const calendarDays = generateCalendarDays()
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const navigateMonth = (direction: number) => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev)
      newMonth.setMonth(prev.getMonth() + direction)
      return newMonth
    })
  }

  const filteredModules = modules.filter(
    (module) => selectedSemester === "all" || module.semester.toLowerCase().replace(" ", "-") === selectedSemester,
  )

  return (
    <div className="flex-1 p-1 md:p-2 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Module Planning</h1>
          <p className="text-sm text-gray-600 mt-1">Manage module schedules, assignments, and academic planning</p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Semesters</SelectItem>
              {semesters.map((semester) => (
                <SelectItem key={semester.value} value={semester.value}>
                  {semester.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Module
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Module</DialogTitle>
                <DialogDescription>Create a new module for the academic schedule</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Module Code</Label>
                    <Input id="code" placeholder="e.g., CS105" />
                  </div>
                  <div>
                    <Label htmlFor="credits">Credits</Label>
                    <Input id="credits" type="number" placeholder="3" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Module Name</Label>
                  <Input id="name" placeholder="e.g., Web Development" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Module description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        {semesters.map((semester) => (
                          <SelectItem key={semester.value} value={semester.value}>
                            {semester.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="lecturer">Assign Lecturer</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select lecturer" />
                      </SelectTrigger>
                      <SelectContent>
                        {lecturers.map((lecturer) => (
                          <SelectItem key={lecturer.id} value={lecturer.name}>
                            {lecturer.name} ({lecturer.currentLoad}/{lecturer.maxLoad} credits)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="capacity">Capacity</Label>
                    <Input id="capacity" type="number" placeholder="100" />
                  </div>
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Input id="room" placeholder="e.g., Lab A-101" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Create Module</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
          <TabsTrigger value="modules">Module List</TabsTrigger>
          <TabsTrigger value="lecturers">Lecturer Load</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-black mb-2">Academic Calendar</CardTitle>
                  <CardDescription>Visual overview of module schedules and important dates</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[200px] text-center">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center font-semibold text-gray-600 text-sm">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`min-h-[100px] p-2 border rounded-lg ${
                      day.isCurrentMonth ? "bg-white" : "bg-gray-50"
                    } ${day.date.toDateString() === new Date().toDateString() ? "ring-2 ring-samps-blue-500" : ""}`}
                  >
                    <div
                      className={`text-sm font-medium mb-1 ${day.isCurrentMonth ? "text-gray-900" : "text-gray-400"}`}
                    >
                      {day.date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {day.modules.slice(0, 2).map((module) => (
                        <div
                          key={module.id}
                          className="text-xs p-1 rounded bg-samps-blue-100 text-samps-blue-800 cursor-pointer hover:bg-samps-blue-200"
                          onClick={() => setSelectedModule(module)}
                        >
                          {module.code}
                        </div>
                      ))}
                      {day.modules.length > 2 && (
                        <div className="text-xs text-gray-500">+{day.modules.length - 2} more</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card className="bg-white shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-samps-blue-100 rounded"></div>
                  <span className="text-sm">Active Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-samps-green-100 rounded"></div>
                  <span className="text-sm">Planned Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-samps-yellow-100 rounded"></div>
                  <span className="text-sm">Pending Assignment</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 ring-2 ring-samps-blue-500 rounded"></div>
                  <span className="text-sm">Today</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="modules" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-2">Module Overview</CardTitle>
              <CardDescription>Comprehensive list of all modules with detailed information</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-black">Module</TableHead>
                    <TableHead className="text-black">Lecturer</TableHead>
                    <TableHead className="text-black">Schedule</TableHead>
                    <TableHead className="text-black">Enrollment</TableHead>
                    <TableHead className="text-black">Status</TableHead>
                    <TableHead className="text-black">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredModules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{module.code}</div>
                          <div className="text-sm text-gray-600">{module.name}</div>
                          <div className="text-xs text-gray-500">{module.credits} credits</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{module.lecturer}</div>
                          <div className="text-sm text-gray-600">{module.room}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm">{module.schedule}</div>
                          <div className="text-xs text-gray-500">
                            {module.startDate} - {module.endDate}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">
                            {module.enrolled}/{module.capacity}
                          </span>
                          <Progress value={(module.enrolled / module.capacity) * 100} className="w-16 h-2" />
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(module.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(module.status)}
                            {module.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lecturers" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black mb-2">Lecturer Teaching Load</CardTitle>
              <CardDescription>Monitor and balance teaching assignments across faculty</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {lecturers.map((lecturer) => {
                  const loadPercentage = (lecturer.currentLoad / lecturer.maxLoad) * 100
                  const assignedModules = modules.filter((m) => m.lecturer === lecturer.name)

                  return (
                    <div key={lecturer.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{lecturer.name}</h3>
                          <p className="text-sm text-gray-600">{lecturer.department}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {lecturer.currentLoad}/{lecturer.maxLoad} credits
                          </div>
                          <div className="text-xs text-gray-500">{Math.round(loadPercentage)}% capacity</div>
                        </div>
                      </div>
                      <Progress value={loadPercentage} className="mb-3" />
                      <div className="flex flex-wrap gap-2">
                        {assignedModules.map((module) => (
                          <Badge key={module.id} variant="outline" className="text-xs">
                            {module.code} ({module.credits}cr)
                          </Badge>
                        ))}
                        {assignedModules.length === 0 && (
                          <span className="text-sm text-gray-500">No modules assigned</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-samps-blue-800">Total Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-blue-600">{modules.length}</div>
                <div className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Across all semesters</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-samps-blue-800">Total Enrollment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-green-600">
                  {modules.reduce((sum, m) => sum + m.enrolled, 0)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Students enrolled</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-samps-blue-800">Avg. Capacity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-yellow-600">
                  {Math.round((modules.reduce((sum, m) => sum + m.enrolled / m.capacity, 0) / modules.length) * 100)}%
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Utilization rate</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-black-500">Department Insights</CardTitle>
              <CardDescription>Key metrics and recommendations for module planning</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Module Status Distribution</h4>
                  <div className="space-y-2">
                    {["active", "planned", "pending"].map((status) => {
                      const count = modules.filter((m) => m.status === status).length
                      const percentage = (count / modules.length) * 100
                      return (
                        <div key={status} className="flex items-center justify-between">
                          <span className="capitalize text-sm">{status}</span>
                          <div className="flex items-center gap-2">
                            <Progress value={percentage} className="w-20 h-2" />
                            <span className="text-sm font-medium">{count}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Recommendations</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>CS105 Web Development needs lecturer assignment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Dr. Wilson has capacity for additional modules</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Prof. Johnson approaching maximum teaching load</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Module Detail Dialog */}
      {selectedModule && (
        <Dialog open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedModule.code} - {selectedModule.name}
              </DialogTitle>
              <DialogDescription>Module details and management options</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Lecturer</Label>
                  <p className="text-sm">{selectedModule.lecturer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Credits</Label>
                  <p className="text-sm">{selectedModule.credits}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedModule.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <p className="text-sm">{selectedModule.schedule}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Room</Label>
                  <p className="text-sm">{selectedModule.room}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Enrollment</Label>
                  <p className="text-sm">
                    {selectedModule.enrolled}/{selectedModule.capacity} students
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <Badge className={getStatusColor(selectedModule.status)}>{selectedModule.status}</Badge>
                </div>
              </div>
              {selectedModule.prerequisites.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Prerequisites</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedModule.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedModule(null)}>
                Close
              </Button>
              <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Edit Module</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
