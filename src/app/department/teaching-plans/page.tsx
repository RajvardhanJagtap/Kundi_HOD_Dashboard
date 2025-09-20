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
  CheckSquare,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  Calendar,
  User,
  BookOpen,
  Target,
  TrendingUp,
  BarChart3,
  Download,
  Upload,
  Filter,
  Search,
} from "lucide-react"

interface TeachingPlan {
  id: number
  moduleCode: string
  moduleName: string
  lecturer: string
  semester: string
  submissionDate: string
  status: string
  reviewDate?: string
  reviewer?: string
  qualityScore?: number
  feedback?: string
  learningOutcomes: string[]
  assessmentMethods: string[]
  resources: string[]
  schedule: string
  room: string
  maxStudents: number
  prerequisites: string[]
}

export default function TeachingPlansPage() {
  const [selectedView, setSelectedView] = useState("overview")
  const [selectedPlan, setSelectedPlan] = useState<TeachingPlan | null>(null)
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const teachingPlans: TeachingPlan[] = [
    {
      id: 1,
      moduleCode: "CS101",
      moduleName: "Introduction to Programming",
      lecturer: "Dr. Sarah Johnson",
      semester: "Fall 2024",
      submissionDate: "2024-08-15",
      status: "Approved",
      reviewDate: "2024-08-20",
      reviewer: "Prof. Michael Chen",
      qualityScore: 85,
      feedback: "Excellent plan with clear learning outcomes and assessment methods. Well-structured content.",
      learningOutcomes: ["LO1", "LO2", "LO3"],
      assessmentMethods: ["Assignments", "Exams", "Projects"],
      resources: ["Textbook", "Online Materials", "Lab Equipment"],
      schedule: "Mon/Wed/Fri 09:00-10:30",
      room: "Lab A-101",
      maxStudents: 100,
      prerequisites: [],
    },
    {
      id: 2,
      moduleCode: "CS202",
      moduleName: "Data Structures & Algorithms",
      lecturer: "Prof. Michael Chen",
      semester: "Fall 2024",
      submissionDate: "2024-08-10",
      status: "Under Review",
      learningOutcomes: ["LO2", "LO4", "LO5"],
      assessmentMethods: ["Projects", "Exams", "Code Reviews"],
      resources: ["Textbook", "Programming Tools", "Online Platform"],
      schedule: "Tue/Thu 11:00-12:30",
      room: "Room B-205",
      maxStudents: 80,
      prerequisites: ["CS101"],
    },
    {
      id: 3,
      moduleCode: "CS303",
      moduleName: "Database Systems",
      lecturer: "Ms. Lisa Wang",
      semester: "Spring 2025",
      submissionDate: "2024-08-05",
      status: "Pending",
      learningOutcomes: ["LO1", "LO3", "LO4"],
      assessmentMethods: ["Assignments", "Database Projects", "Presentations"],
      resources: ["Database Software", "Case Studies", "Online Resources"],
      schedule: "Mon/Wed 14:00-15:30",
      room: "Lab C-301",
      maxStudents: 70,
      prerequisites: ["CS101", "CS202"],
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800"
      case "Under Review":
        return "bg-yellow-100 text-yellow-800"
      case "Pending":
        return "bg-blue-100 text-blue-800"
      case "Rejected":
        return "bg-red-100 text-red-800"
      case "Draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="h-4 w-4" />
      case "Under Review":
        return <Clock className="h-4 w-4" />
      case "Pending":
        return <AlertTriangle className="h-4 w-4" />
      case "Rejected":
        return <XCircle className="h-4 w-4" />
      case "Draft":
        return <FileText className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredPlans = teachingPlans.filter((plan) => {
    const matchesStatus = selectedStatus === "all" || plan.status === selectedStatus
    const matchesSearch = 
      plan.moduleCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.moduleName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.lecturer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="flex-1 p-1 md:p-2 grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Teaching Plans</h1>
          <p className="text-sm text-gray-600 mt-1">Review and approve teaching plans submitted by lecturers</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Plans
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-samps-blue-600 hover:bg-[#026892]/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Teaching Plan</DialogTitle>
                <DialogDescription>Create a new teaching plan for a module</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="moduleCode">Module Code</Label>
                    <Input id="moduleCode" placeholder="e.g., CS101" />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select semester" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fall-2024">Fall 2024</SelectItem>
                        <SelectItem value="spring-2025">Spring 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="moduleName">Module Name</Label>
                  <Input id="moduleName" placeholder="e.g., Introduction to Programming" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Module description and objectives..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="schedule">Schedule</Label>
                    <Input id="schedule" placeholder="e.g., Mon/Wed/Fri 09:00-10:30" />
                  </div>
                  <div>
                    <Label htmlFor="room">Room</Label>
                    <Input id="room" placeholder="e.g., Lab A-101" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="maxStudents">Maximum Students</Label>
                  <Input id="maxStudents" type="number" placeholder="100" />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancel</Button>
                <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Create Plan</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={selectedView} onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="plans">Teaching Plans</TabsTrigger>
          <TabsTrigger value="review">Review Process</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">Total Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-blue-600">{teachingPlans.length}</div>
                <div className="flex items-center gap-2 mt-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Submitted plans</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">Approved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-green-600">
                  {teachingPlans.filter(p => p.status === "Approved").length}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <CheckCircle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Plans approved</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">Under Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-yellow-600">
                  {teachingPlans.filter(p => p.status === "Under Review").length}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Pending review</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-gray-700">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-samps-blue-600">
                  {teachingPlans.filter(p => p.status === "Pending").length}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <AlertTriangle className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Awaiting submission</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-2 text-lg">Recent Activity</CardTitle>
              <CardDescription>Latest teaching plan updates and reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachingPlans
                  .sort((a, b) => new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime())
                  .slice(0, 5)
                  .map((plan) => (
                    <div key={plan.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-samps-blue-600 rounded-full"></div>
                        <div>
                          <p className="font-medium">{plan.moduleCode} - {plan.moduleName}</p>
                          <p className="text-sm text-gray-600">Submitted by {plan.lecturer} on {plan.submissionDate}</p>
                        </div>
                      </div>
                      <Badge className={getStatusColor(plan.status)}>
                        {plan.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-2 text-lg">Teaching Plans Overview</CardTitle>
              <CardDescription>Manage and review all submitted teaching plans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search plans..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Under Review">Under Review</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                    <SelectItem value="Draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  <Filter className="mr-2 h-4 w-4" />
                  Advanced
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Lecturer</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Quality Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan) => (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{plan.moduleCode}</div>
                          <div className="text-sm text-gray-600">{plan.moduleName}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{plan.lecturer}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{plan.semester}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{plan.submissionDate}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(plan.status)}>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(plan.status)}
                            {plan.status}
                          </div>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {plan.qualityScore ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">{plan.qualityScore}%</span>
                            <Progress value={plan.qualityScore} className="w-16 h-2" />
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not scored</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-3 w-3" />
                          </Button>
                          {plan.status === "Pending" && (
                            <Button variant="outline" size="sm" className="text-green-600">
                              <CheckSquare className="h-3 w-3" />
                            </Button>
                          )}
                          <Button variant="outline" size="sm">
                            <Edit className="h-3 w-3" />
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

        <TabsContent value="review" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-2 text-lg">Review Workflow</CardTitle>
              <CardDescription>Current plans under review process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {teachingPlans
                  .filter(p => p.status === "Under Review")
                  .map((plan) => (
                    <div key={plan.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{plan.moduleCode} - {plan.moduleName}</h3>
                          <p className="text-sm text-gray-600">Lecturer: {plan.lecturer}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">Under Review</Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label className="text-sm font-medium">Learning Outcomes</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plan.learningOutcomes.map((outcome) => (
                              <Badge key={outcome} variant="outline" className="text-xs">
                                {outcome}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Assessment Methods</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plan.assessmentMethods.map((method) => (
                              <Badge key={method} variant="outline" className="text-xs">
                                {method}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Resources</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plan.resources.map((resource) => (
                              <Badge key={resource} variant="outline" className="text-xs">
                                {resource}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="bg-[#026892] hover:bg-[#026892]/90 text-white">
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button variant="outline" className="text-red-600">
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                        <Button variant="outline">
                          <Edit className="mr-2 h-4 w-4" />
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-2 text-lg">Quality Insights</CardTitle>
              <CardDescription>Key findings and recommendations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Strengths</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Clear learning outcomes in 85% of plans</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Diverse assessment methods being used</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                      <span>Good resource allocation planning</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Areas for Improvement</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Some plans lack measurable outcomes</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Assessment methods could be more varied</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
                      <span>Resource planning needs standardization</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Teaching Plan Detail Dialog */}
      {selectedPlan && (
        <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPlan.moduleCode} - {selectedPlan.moduleName}
              </DialogTitle>
              <DialogDescription>Teaching plan details and review options</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Lecturer</Label>
                  <p className="text-sm">{selectedPlan.lecturer}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Semester</Label>
                  <p className="text-sm">{selectedPlan.semester}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Schedule</Label>
                  <p className="text-sm">{selectedPlan.schedule}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Room</Label>
                  <p className="text-sm">{selectedPlan.room}</p>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Learning Outcomes</Label>
                <div className="flex gap-2 mt-1">
                  {selectedPlan.learningOutcomes.map((outcome) => (
                    <Badge key={outcome} variant="outline" className="text-xs">
                      {outcome}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Assessment Methods</Label>
                <div className="flex gap-2 mt-1">
                  {selectedPlan.assessmentMethods.map((method) => (
                    <Badge key={method} variant="outline" className="text-xs">
                      {method}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium">Resources</Label>
                <div className="flex gap-2 mt-1">
                  {selectedPlan.resources.map((resource) => (
                    <Badge key={resource} variant="outline" className="text-xs">
                      {resource}
                    </Badge>
                  ))}
                </div>
              </div>
              {selectedPlan.prerequisites.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Prerequisites</Label>
                  <div className="flex gap-2 mt-1">
                    {selectedPlan.prerequisites.map((prereq) => (
                      <Badge key={prereq} variant="outline" className="text-xs">
                        {prereq}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {selectedPlan.feedback && (
                <div>
                  <Label className="text-sm font-medium">Review Feedback</Label>
                  <p className="text-sm text-gray-600 mt-1">{selectedPlan.feedback}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedPlan(null)}>
                Close
              </Button>
              {selectedPlan.status === "Pending" && (
                <Button className="bg-green-600 hover:bg-green-700">Approve Plan</Button>
              )}
              <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Edit Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
