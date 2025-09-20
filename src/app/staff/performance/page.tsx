"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, TrendingUp, Users, Award, BookOpen, MessageSquare, Star } from "lucide-react"
import {
  Line,
  Bar,
  Pie,
  Cell,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

// Performance data
const performanceTrendsData = [
  { month: "Jan", overall: 4.1, teaching: 4.0, research: 4.2, service: 3.9 },
  { month: "Feb", overall: 4.2, teaching: 4.1, research: 4.3, service: 4.0 },
  { month: "Mar", overall: 4.0, teaching: 3.9, research: 4.1, service: 4.0 },
  { month: "Apr", overall: 4.3, teaching: 4.2, research: 4.4, service: 4.1 },
  { month: "May", overall: 4.4, teaching: 4.3, research: 4.5, service: 4.2 },
  { month: "Jun", overall: 4.2, teaching: 4.1, research: 4.3, service: 4.0 },
]

const departmentPerformanceData = [
  { category: "Teaching Quality", score: 4.3 },
  { category: "Research Output", score: 3.8 },
  { category: "Student Engagement", score: 4.1 },
  { category: "Professional Development", score: 3.9 },
  { category: "Administrative Tasks", score: 4.0 },
]

// Calculate actual performance distribution from lecturer data
const calculatePerformanceDistribution = (lecturers: LecturerPerformance[]) => {
  const total = lecturers.length
  const excellent = lecturers.filter(l => l.overallRating >= 4.5).length
  const good = lecturers.filter(l => l.overallRating >= 4.0 && l.overallRating < 4.5).length
  const satisfactory = lecturers.filter(l => l.overallRating >= 3.5 && l.overallRating < 4.0).length
  const needsImprovement = lecturers.filter(l => l.overallRating < 3.5).length
  
  return [
    { name: "Excellent", range: "4.5-5.0", value: excellent, percentage: Math.round((excellent/total) * 100), color: "#10B981" },
    { name: "Good", range: "4.0-4.4", value: good, percentage: Math.round((good/total) * 100), color: "#3B82F6" },
    { name: "Satisfactory", range: "3.5-3.9", value: satisfactory, percentage: Math.round((satisfactory/total) * 100), color: "#F59E0B" },
    { name: "Needs Improvement", range: "3.0-3.4", value: needsImprovement, percentage: Math.round((needsImprovement/total) * 100), color: "#EF4444" },
  ].filter(item => item.value > 0) // Only show categories that have staff
}

interface LecturerPerformance {
  id: string
  name: string
  position: string
  avatar?: string
  overallRating: number
  teachingRating: number
  researchRating: number
  serviceRating: number
  studentFeedback: number
  lastReviewDate: string
  strengths: string[]
  improvementAreas: string[]
  coursesTeaching: number
  studentsImpacted: number
  publicationsThisYear: number
}

const lecturersData: LecturerPerformance[] = [
  {
    id: "1",
    name: "Dr. Alice Smith",
    position: "Senior Lecturer",
    overallRating: 4.5,
    teachingRating: 4.6,
    researchRating: 4.3,
    serviceRating: 4.4,
    studentFeedback: 4.7,
    lastReviewDate: "2024-06-15",
    strengths: ["Excellent student engagement", "Innovative teaching methods", "Strong research output"],
    improvementAreas: ["Committee participation"],
    coursesTeaching: 4,
    studentsImpacted: 150,
    publicationsThisYear: 3,
  },
  {
    id: "2",
    name: "Prof. Bob Johnson",
    position: "Professor",
    overallRating: 4.2,
    teachingRating: 4.1,
    researchRating: 4.5,
    serviceRating: 4.0,
    studentFeedback: 4.0,
    lastReviewDate: "2024-06-10",
    strengths: ["Research leadership", "Mentoring junior staff", "Grant acquisition"],
    improvementAreas: ["Student feedback scores", "Course modernization"],
    coursesTeaching: 3,
    studentsImpacted: 120,
    publicationsThisYear: 5,
  },
  {
    id: "3",
    name: "Dr. Sarah Lee",
    position: "Lecturer",
    overallRating: 4.4,
    teachingRating: 4.5,
    researchRating: 4.2,
    serviceRating: 4.3,
    studentFeedback: 4.6,
    lastReviewDate: "2024-05-28",
    strengths: ["Student mentorship", "Course design", "Collaborative research"],
    improvementAreas: ["Conference presentations"],
    coursesTeaching: 5,
    studentsImpacted: 180,
    publicationsThisYear: 2,
  },
  {
    id: "4",
    name: "Ms. Carol White",
    position: "Assistant Lecturer",
    overallRating: 3.9,
    teachingRating: 4.0,
    researchRating: 3.6,
    serviceRating: 4.1,
    studentFeedback: 4.2,
    lastReviewDate: "2024-05-20",
    strengths: ["Dedication to teaching", "Student support", "Administrative efficiency"],
    improvementAreas: ["Research development", "Professional development"],
    coursesTeaching: 3,
    studentsImpacted: 100,
    publicationsThisYear: 1,
  },
]

const TIME_PERIODS = ["Last 6 Months", "Last Year", "Last 2 Years"]
const PERFORMANCE_CATEGORIES = ["All", "Teaching", "Research", "Service"]

export default function StaffPerformancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState("Last 6 Months")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLecturer, setSelectedLecturer] = useState<string | null>(null)

  const avgOverallRating = useMemo(() => {
    return lecturersData.reduce((sum, lecturer) => sum + lecturer.overallRating, 0) / lecturersData.length
  }, [])

  const totalStudentsImpacted = useMemo(() => {
    return lecturersData.reduce((sum, lecturer) => sum + lecturer.studentsImpacted, 0)
  }, [])

  const totalPublications = useMemo(() => {
    return lecturersData.reduce((sum, lecturer) => sum + lecturer.publicationsThisYear, 0)
  }, [])

  const performanceDistribution = useMemo(() => {
    return calculatePerformanceDistribution(lecturersData)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Staff Performance</h1>
          <p className="text-gray-600 mt-1">Comprehensive performance analytics and review management</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Period:</label>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="bg-white w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIME_PERIODS.map(period => (
                  <SelectItem key={period} value={period}>{period}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Category:</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="bg-white w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERFORMANCE_CATEGORIES.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button className="bg-[#026892] hover:bg-[#026892]/90">
            <FileText className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{avgOverallRating.toFixed(1)}/5.0</div>
            <p className="text-xs text-green-600">+0.2 from last period</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{lecturersData.length}</div>
            <p className="text-xs text-gray-500">Active department members</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Students Impacted</CardTitle>
            <BookOpen className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalStudentsImpacted}</div>
            <p className="text-xs text-gray-500">Across all courses</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Publications</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalPublications}</div>
            <p className="text-xs text-green-600">This academic year</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Performance Trends */}
        <Card className="lg:col-span-2 bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Performance Trends</CardTitle>
            <CardDescription className="text-gray-600">
              Monthly performance metrics across different categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <RechartsLineChart data={performanceTrendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
                <YAxis domain={[3.5, 5.0]} tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
                <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" dataKey="overall" stroke="#026892" strokeWidth={3} name="Overall" dot={{ fill: '#026892', strokeWidth: 2, r: 4 }} />
                <Line type="monotone" dataKey="teaching" stroke="#10B981" strokeWidth={2} name="Teaching" dot={{ fill: '#10B981', strokeWidth: 2, r: 3 }} />
                <Line type="monotone" dataKey="research" stroke="#3B82F6" strokeWidth={2} name="Research" dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }} />
                <Line type="monotone" dataKey="service" stroke="#F59E0B" strokeWidth={2} name="Service" dot={{ fill: '#F59E0B', strokeWidth: 2, r: 3 }} />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Performance Distribution */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Staff Performance Distribution</CardTitle>
            <CardDescription className="text-gray-600">
              How many staff members fall into each performance category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RechartsPieChart>
                <Pie
                  data={performanceDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={110}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value} staff members (${props.payload.percentage}%)`, 
                  `${props.payload.name} (${props.payload.range})`
                ]} />
              </RechartsPieChart>
            </ResponsiveContainer>
            
            {/* Legend with detailed info */}
            <div className="mt-4 space-y-3">
              <div className="text-sm font-medium text-gray-700 border-b pb-2">
                Performance Categories ({lecturersData.length} total staff)
              </div>
              {performanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 rounded bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: item.color }} />
                    <div>
                      <span className="text-sm font-medium text-gray-900">{item.name}</span>
                      <div className="text-xs text-gray-600">Rating: {item.range}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-gray-900">{item.value} staff</div>
                    <div className="text-xs text-gray-600">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Categories Performance */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Department Performance by Category</CardTitle>
          <CardDescription className="text-gray-600">
            Average scores across different performance areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={departmentPerformanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <YAxis domain={[3.0, 5.0]} tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <Tooltip contentStyle={{ backgroundColor: 'white', border: '1px solid #ddd', borderRadius: 8 }} />
              <Bar dataKey="score" fill="#026892" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Actions and Navigation */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-gray-600">
              Common performance management tasks
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start bg-[#026892] hover:bg-[#026892]/90" asChild>
              <a href="/staff/performance/individual">
                <Users className="h-4 w-4 mr-2" />
                View Individual Performance Details
              </a>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Conduct New Performance Review
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <TrendingUp className="h-4 w-4 mr-2" />
              Generate Performance Report
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Feedback Requests
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl text-gray-900">Recent Reviews Summary</CardTitle>
            <CardDescription className="text-gray-600">
              Latest performance review activity
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lecturersData.slice(0, 4).map(lecturer => (
                <div key={lecturer.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-[#026892] text-white text-xs">
                        {lecturer.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-sm">{lecturer.name}</div>
                      <div className="text-xs text-gray-500">{new Date(lecturer.lastReviewDate).toLocaleDateString()}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">{lecturer.overallRating.toFixed(1)}</div>
                    <Badge variant={lecturer.overallRating >= 4.5 ? 'default' : lecturer.overallRating >= 4.0 ? 'secondary' : 'outline'} className={`text-xs ${
                      lecturer.overallRating >= 4.5 ? 'bg-green-100 text-green-800' :
                      lecturer.overallRating >= 4.0 ? 'bg-blue-100 text-blue-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {lecturer.overallRating >= 4.5 ? 'Excellent' :
                       lecturer.overallRating >= 4.0 ? 'Good' :
                       lecturer.overallRating >= 3.5 ? 'Satisfactory' : 'Needs Improvement'}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full mt-2" asChild>
                <a href="/staff/performance/individual">
                  View All Individual Details →
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
