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
  Edit,
  Trash2,
  Eye,
  BookOpen,
  GraduationCap,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Users,
  Calendar,
  Award,
  FileText,
  BarChart3,
} from "lucide-react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

interface Program {
  id: number
  name: string
  code: string
  level: string
  totalModules: number
  totalCredits: number
  duration: string
  accreditationStatus: string
  lastReview: string
  nextReview: string
  coordinator: string
  description: string
  learningOutcomes: string[]
  modules: string[]
}

interface LearningOutcome {
  id: number
  code: string
  description: string
  category: string
  assessmentMethods: string[]
  mappedModules: string[]
}

const COLORS = ["#026892", "#38A06C", "#C2410C", "#DC3545", "#6C757D"]

export default function CurriculumPage() {
  const [selectedView, setSelectedView] = useState("overview")
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null)
  const [selectedOutcome, setSelectedOutcome] = useState<LearningOutcome | null>(null)

  const programs: Program[] = [
    {
      id: 1,
      name: "Bachelor of Computer Science",
      code: "BSc-CS",
      level: "Undergraduate",
      totalModules: 24,
      totalCredits: 120,
      duration: "4 Years",
      accreditationStatus: "Accredited",
      lastReview: "2023-06-15",
      nextReview: "2026-06-15",
      coordinator: "Dr. Sarah Johnson",
      description: "Comprehensive computer science program covering programming, algorithms, and software engineering",
      learningOutcomes: ["LO1", "LO2", "LO3", "LO4", "LO5"],
      modules: ["CS101", "CS202", "CS303", "CS404", "CS505"],
    },
    {
      id: 2,
      name: "Master of Data Science",
      code: "MSc-DS",
      level: "Postgraduate",
      totalModules: 16,
      totalCredits: 90,
      duration: "2 Years",
      accreditationStatus: "Under Review",
      lastReview: "2022-12-10",
      nextReview: "2025-12-10",
      coordinator: "Prof. Michael Chen",
      description: "Advanced data science program focusing on machine learning and analytics",
      learningOutcomes: ["LO1", "LO2", "LO3", "LO4"],
      modules: ["DS501", "DS502", "DS503", "DS504"],
    },
    {
      id: 3,
      name: "Diploma in Information Technology",
      code: "Dip-IT",
      level: "Diploma",
      totalModules: 12,
      totalCredits: 60,
      duration: "2 Years",
      accreditationStatus: "Pending",
      lastReview: "2021-08-20",
      nextReview: "2024-08-20",
      coordinator: "Ms. Lisa Wang",
      description: "Foundation IT program for entry-level positions",
      learningOutcomes: ["LO1", "LO2", "LO3"],
      modules: ["IT101", "IT102", "IT103", "IT104"],
    },
  ]

  const learningOutcomes: LearningOutcome[] = [
    {
      id: 1,
      code: "LO1",
      description: "Demonstrate knowledge and understanding of fundamental computer science concepts",
      category: "Knowledge",
      assessmentMethods: ["Examinations", "Assignments", "Projects"],
      mappedModules: ["CS101", "CS202", "CS303"],
    },
    {
      id: 2,
      code: "LO2",
      description: "Apply problem-solving skills to design and implement software solutions",
      category: "Skills",
      assessmentMethods: ["Projects", "Lab Work", "Code Reviews"],
      mappedModules: ["CS202", "CS404", "CS505"],
    },
    {
      id: 3,
      code: "LO3",
      description: "Communicate effectively in technical and non-technical contexts",
      category: "Communication",
      assessmentMethods: ["Presentations", "Reports", "Group Work"],
      mappedModules: ["CS303", "CS505"],
    },
    {
      id: 4,
      code: "LO4",
      description: "Work collaboratively in multidisciplinary teams",
      category: "Teamwork",
      assessmentMethods: ["Group Projects", "Peer Assessment", "Team Presentations"],
      mappedModules: ["CS404", "CS505"],
    },
    {
      id: 5,
      code: "LO5",
      description: "Demonstrate professional and ethical responsibility",
      category: "Professionalism",
      assessmentMethods: ["Case Studies", "Reflections", "Ethics Discussions"],
      mappedModules: ["CS101", "CS303"],
    },
  ]

  const accreditationData = [
    { name: "Accredited", value: 1, color: "#38A06C" },
    { name: "Under Review", value: 1, color: "#C2410C" },
    { name: "Pending", value: 1, color: "#DC3545" },
  ]

  const programLevelData = [
    { name: "Undergraduate", value: 1 },
    { name: "Postgraduate", value: 1 },
    { name: "Diploma", value: 1 },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Accredited":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Accredited":
        return <CheckCircle className="h-4 w-4" />
      case "Under Review":
        return <Clock className="h-4 w-4" />
      case "Pending":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Undergraduate":
        return "bg-blue-100 text-blue-800"
      case "Postgraduate":
        return "bg-purple-100 text-purple-800"
      case "Diploma":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex-1 p-1 md:p-2 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-700">Curriculum Management</h1>
          <p className="text-sm text-gray-600 mt-1">Oversee and update the department's academic curriculum</p>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Program
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add New Program</DialogTitle>
                <DialogDescription>Create a new academic program</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="code">Program Code</Label>
                    <Input id="code" placeholder="e.g., BSc-CS" />
                  </div>
                  <div>
                    <Label htmlFor="level">Level</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="undergraduate">Undergraduate</SelectItem>
                        <SelectItem value="postgraduate">Postgraduate</SelectItem>
                        <SelectItem value="diploma">Diploma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="name">Program Name</Label>
                  <Input id="name" placeholder="e.g., Bachelor of Computer Science" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Program description..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input id="duration" placeholder="e.g., 4 Years" />
                  </div>
                  <div>
                    <Label htmlFor="credits">Total Credits</Label>
                    <Input id="credits" type="number" placeholder="120" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="coordinator">Program Coordinator</Label>
                  <Input id="coordinator" placeholder="e.g., Dr. Sarah Johnson" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Create Program</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="programs">Programs</TabsTrigger>
          <TabsTrigger value="outcomes">Learning Outcomes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-samps-blue-800">Total Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-blue-600">{programs.length}</div>
                <div className="flex items-center gap-2 mt-2">
                  <GraduationCap className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Active programs</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-samps-blue-800">Total Modules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-green-600">
                  {programs.reduce((sum, p) => sum + p.totalModules, 0)}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <BookOpen className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Across all programs</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">Learning Outcomes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-yellow-600">{learningOutcomes.length}</div>
                <div className="flex items-center gap-2 mt-2">
                  <Target className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Defined outcomes</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-samps-blue-800">Accreditation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-green-600">
                  {programs.filter(p => p.accreditationStatus === "Accredited").length}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Award className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Accredited programs</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-samps-gray-700">Accreditation Status</CardTitle>
                <CardDescription>Distribution of program accreditation status</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={accreditationData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {accreditationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-gray-700">Program Levels</CardTitle>
                <CardDescription>Distribution of programs by academic level</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={programLevelData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#026892" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700">Upcoming Reviews</CardTitle>
              <CardDescription>Programs requiring accreditation review</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {programs
                  .filter(p => p.accreditationStatus !== "Accredited")
                  .map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{program.name}</h3>
                        <p className="text-sm text-gray-600">Next review: {program.nextReview}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(program.accreditationStatus)}>
                          {program.accreditationStatus}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 ">Academic Programs</CardTitle>
              <CardDescription>Manage and monitor all academic programs</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Program</TableHead>
                    <TableHead>Level</TableHead>
                    <TableHead>Modules</TableHead>
                    <TableHead>Credits</TableHead>
                    <TableHead>Accreditation</TableHead>
                    <TableHead>Next Review</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {programs.map((program) => (
                    <TableRow key={program.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{program.code}</div>
                          <div className="text-sm text-gray-600">{program.name}</div>
                          <div className="text-xs text-gray-500">{program.coordinator}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getLevelColor(program.level)}>{program.level}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{program.totalModules}</div>
                          <div className="text-xs text-gray-500">modules</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-center">
                          <div className="font-medium">{program.totalCredits}</div>
                          <div className="text-xs text-gray-500">credits</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(program.accreditationStatus)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(program.accreditationStatus)}
                            {program.accreditationStatus}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{program.nextReview}</div>
                        <div className="text-xs text-gray-500">
                          {Math.ceil((new Date(program.nextReview).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
                        </div>
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

        <TabsContent value="outcomes" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700">Learning Outcomes</CardTitle>
              <CardDescription>Define and map learning outcomes across programs</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {learningOutcomes.map((outcome) => (
                  <div key={outcome.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{outcome.code}</h3>
                        <p className="text-sm text-gray-600">{outcome.description}</p>
                        <Badge variant="outline" className="mt-2">
                          {outcome.category}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Assessment Methods</h4>
                        <div className="flex flex-wrap gap-2">
                          {outcome.assessmentMethods.map((method) => (
                            <Badge key={method} variant="secondary" className="text-xs">
                              {method}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm mb-2">Mapped Modules</h4>
                        <div className="flex flex-wrap gap-2">
                          {outcome.mappedModules.map((module) => (
                            <Badge key={module} variant="outline" className="text-xs">
                              {module}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>

      {/* Program Detail Dialog */}
      {selectedProgram && (
        <Dialog open={!!selectedProgram} onOpenChange={() => setSelectedProgram(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedProgram.code} - {selectedProgram.name}
              </DialogTitle>
              <DialogDescription>Program details and management options</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Level</Label>
                  <Badge className={getLevelColor(selectedProgram.level)}>{selectedProgram.level}</Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium">Duration</Label>
                  <p className="text-sm">{selectedProgram.duration}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-sm text-gray-600">{selectedProgram.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Total Modules</Label>
                  <p className="text-sm">{selectedProgram.totalModules}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Total Credits</Label>
                  <p className="text-sm">{selectedProgram.totalCredits}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Coordinator</Label>
                  <p className="text-sm">{selectedProgram.coordinator}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Accreditation Status</Label>
                  <Badge className={getStatusColor(selectedProgram.accreditationStatus)}>
                    {selectedProgram.accreditationStatus}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Modules</Label>
                <div className="flex gap-2 mt-1">
                  {selectedProgram.modules.map((module) => (
                    <Badge key={module} variant="outline" className="text-xs">
                      {module}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedProgram(null)}>
                Close
              </Button>
              <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Edit Program</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
