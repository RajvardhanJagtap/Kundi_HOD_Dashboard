"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { FileText, ArrowLeft, Star, TrendingUp, Users, BookOpen, MessageSquare } from "lucide-react"
import Link from "next/link"

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
  email: string
  department: string
  yearsOfService: number
}

const lecturersData: LecturerPerformance[] = [
  {
    id: "1",
    name: "Dr. Alice Smith",
    position: "Senior Lecturer",
    email: "alice.smith@university.edu",
    department: "Computer Science",
    yearsOfService: 8,
    overallRating: 4.5,
    teachingRating: 4.6,
    researchRating: 4.3,
    serviceRating: 4.4,
    studentFeedback: 4.7,
    lastReviewDate: "2024-06-15",
    strengths: ["Excellent student engagement", "Innovative teaching methods", "Strong research output", "Mentorship skills"],
    improvementAreas: ["Committee participation", "Conference presentations"],
    coursesTeaching: 4,
    studentsImpacted: 150,
    publicationsThisYear: 3,
  },
  {
    id: "2",
    name: "Prof. Bob Johnson",
    position: "Professor",
    email: "bob.johnson@university.edu",
    department: "Computer Science",
    yearsOfService: 15,
    overallRating: 4.2,
    teachingRating: 4.1,
    researchRating: 4.5,
    serviceRating: 4.0,
    studentFeedback: 4.0,
    lastReviewDate: "2024-06-10",
    strengths: ["Research leadership", "Mentoring junior staff", "Grant acquisition", "Industry connections"],
    improvementAreas: ["Student feedback scores", "Course modernization", "Digital teaching tools"],
    coursesTeaching: 3,
    studentsImpacted: 120,
    publicationsThisYear: 5,
  },
  {
    id: "3",
    name: "Dr. Sarah Lee",
    position: "Lecturer",
    email: "sarah.lee@university.edu",
    department: "Computer Science",
    yearsOfService: 5,
    overallRating: 4.4,
    teachingRating: 4.5,
    researchRating: 4.2,
    serviceRating: 4.3,
    studentFeedback: 4.6,
    lastReviewDate: "2024-05-28",
    strengths: ["Student mentorship", "Course design", "Collaborative research", "Curriculum development"],
    improvementAreas: ["Conference presentations", "Professional networking"],
    coursesTeaching: 5,
    studentsImpacted: 180,
    publicationsThisYear: 2,
  },
  {
    id: "4",
    name: "Ms. Carol White",
    position: "Assistant Lecturer",
    email: "carol.white@university.edu",
    department: "Computer Science",
    yearsOfService: 3,
    overallRating: 3.9,
    teachingRating: 4.0,
    researchRating: 3.6,
    serviceRating: 4.1,
    studentFeedback: 4.2,
    lastReviewDate: "2024-05-20",
    strengths: ["Dedication to teaching", "Student support", "Administrative efficiency", "Team collaboration"],
    improvementAreas: ["Research development", "Professional development", "Publication record"],
    coursesTeaching: 3,
    studentsImpacted: 100,
    publicationsThisYear: 1,
  },
]

const SORT_OPTIONS = ["Name (A-Z)", "Name (Z-A)", "Rating (High-Low)", "Rating (Low-High)", "Recent Review"]
const FILTER_OPTIONS = ["All", "Excellent (4.5+)", "Good (4.0-4.4)", "Satisfactory (3.5-3.9)", "Needs Improvement (<3.5)"]

export default function IndividualPerformancePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("Rating (High-Low)")
  const [filterBy, setFilterBy] = useState("All")
  const [selectedLecturer, setSelectedLecturer] = useState<string | null>(null)

  const filteredAndSortedLecturers = useMemo(() => {
    let filtered = lecturersData.filter(lecturer => 
      lecturer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lecturer.position.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply performance filter
    if (filterBy !== "All") {
      if (filterBy === "Excellent (4.5+)") {
        filtered = filtered.filter(l => l.overallRating >= 4.5)
      } else if (filterBy === "Good (4.0-4.4)") {
        filtered = filtered.filter(l => l.overallRating >= 4.0 && l.overallRating < 4.5)
      } else if (filterBy === "Satisfactory (3.5-3.9)") {
        filtered = filtered.filter(l => l.overallRating >= 3.5 && l.overallRating < 4.0)
      } else if (filterBy === "Needs Improvement (<3.5)") {
        filtered = filtered.filter(l => l.overallRating < 3.5)
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "Name (A-Z)":
        return filtered.sort((a, b) => a.name.localeCompare(b.name))
      case "Name (Z-A)":
        return filtered.sort((a, b) => b.name.localeCompare(a.name))
      case "Rating (High-Low)":
        return filtered.sort((a, b) => b.overallRating - a.overallRating)
      case "Rating (Low-High)":
        return filtered.sort((a, b) => a.overallRating - b.overallRating)
      case "Recent Review":
        return filtered.sort((a, b) => new Date(b.lastReviewDate).getTime() - new Date(a.lastReviewDate).getTime())
      default:
        return filtered
    }
  }, [searchTerm, sortBy, filterBy])

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-green-600 bg-green-50"
    if (rating >= 4.0) return "text-blue-600 bg-blue-50"
    if (rating >= 3.5) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const getRatingLabel = (rating: number) => {
    if (rating >= 4.5) return "Excellent"
    if (rating >= 4.0) return "Good"
    if (rating >= 3.5) return "Satisfactory"
    return "Needs Improvement"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/staff/performance">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Performance Overview
              </Link>
            </Button>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Individual Performance Details</h1>
          <p className="text-gray-600 mt-1">Comprehensive performance metrics and review details for each staff member</p>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg text-gray-900">Filter and Search Staff</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Search by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Sort:</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <Select value={filterBy} onValueChange={setFilterBy}>
                <SelectTrigger className="bg-white w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FILTER_OPTIONS.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
            <span>Showing {filteredAndSortedLecturers.length} of {lecturersData.length} staff members</span>
            {filterBy !== "All" && (
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Filter: {filterBy}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Individual Performance Cards */}
      <div className="grid gap-6 lg:grid-cols-2">
        {filteredAndSortedLecturers.map(lecturer => (
          <Card key={lecturer.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={lecturer.avatar} />
                    <AvatarFallback className="bg-[#026892] text-white text-lg">
                      {lecturer.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">{lecturer.name}</h3>
                    <p className="text-sm text-gray-600">{lecturer.position}</p>
                    <p className="text-xs text-gray-500">{lecturer.email}</p>
                    <p className="text-xs text-gray-500">{lecturer.yearsOfService} years of service</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{lecturer.overallRating.toFixed(1)}</div>
                  <div className="flex text-yellow-400 justify-end">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`h-4 w-4 ${i < Math.floor(lecturer.overallRating) ? 'fill-current' : ''}`} />
                    ))}
                  </div>
                  <Badge className={`text-xs mt-1 ${getRatingColor(lecturer.overallRating)}`}>
                    {getRatingLabel(lecturer.overallRating)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Performance Metrics */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-blue-600">{lecturer.teachingRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Teaching</div>
                  <Progress value={(lecturer.teachingRating / 5) * 100} className="mt-1 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-green-600">{lecturer.researchRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Research</div>
                  <Progress value={(lecturer.researchRating / 5) * 100} className="mt-1 h-2" />
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-purple-600">{lecturer.serviceRating.toFixed(1)}</div>
                  <div className="text-sm text-gray-600">Service</div>
                  <Progress value={(lecturer.serviceRating / 5) * 100} className="mt-1 h-2" />
                </div>
              </div>

              {/* Key Statistics */}
              <div className="grid grid-cols-4 gap-4 text-center p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-lg font-bold text-gray-900">{lecturer.coursesTeaching}</div>
                  <div className="text-xs text-gray-600">Courses</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{lecturer.studentsImpacted}</div>
                  <div className="text-xs text-gray-600">Students</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{lecturer.publicationsThisYear}</div>
                  <div className="text-xs text-gray-600">Publications</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-gray-900">{lecturer.studentFeedback.toFixed(1)}</div>
                  <div className="text-xs text-gray-600">Student Rating</div>
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                  Key Strengths
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lecturer.strengths.map((strength, index) => (
                    <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                      {strength}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Improvement Areas */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <BookOpen className="h-4 w-4 mr-2 text-orange-600" />
                  Areas for Improvement
                </h4>
                <div className="flex flex-wrap gap-2">
                  {lecturer.improvementAreas.map((area, index) => (
                    <Badge key={index} variant="outline" className="border-orange-200 text-orange-700">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t">
                <div className="text-sm text-gray-500">
                  Last review: {new Date(lecturer.lastReviewDate).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <FileText className="h-3 w-3 mr-1" />
                    View Full Report
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Send Feedback
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAndSortedLecturers.length === 0 && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No staff members found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
