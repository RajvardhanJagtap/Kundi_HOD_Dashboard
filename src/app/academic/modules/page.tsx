"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookOpen, Users, Clock, Search, Eye, FileText, Calendar } from "lucide-react"

interface Module {
  id: string
  code: string
  name: string
  yearOfStudy: number
  semester: string
  credits: number
  lecturer: string
  students: number
  department: string
}

const modules: Module[] = [
  // Year 1 - Semester 1
  { id: "1", code: "CSC101", name: "Introduction to Computer Science", yearOfStudy: 1, semester: "Semester 1", credits: 12, lecturer: "Dr. Alice Smith", students: 45, department: "Computer Science" },
  { id: "2", code: "MTH101", name: "Mathematics for Computing", yearOfStudy: 1, semester: "Semester 1", credits: 12, lecturer: "Prof. Bob Johnson", students: 45, department: "Mathematics" },
  { id: "3", code: "PHY101", name: "Physics for Engineers", yearOfStudy: 1, semester: "Semester 1", credits: 12, lecturer: "Dr. Sarah Lee", students: 45, department: "Physics" },
  { id: "4", code: "ENG101", name: "English Communication", yearOfStudy: 1, semester: "Semester 1", credits: 6, lecturer: "Ms. Carol White", students: 45, department: "English" },
  
  // Year 1 - Semester 2
  { id: "5", code: "CSC102", name: "Programming Fundamentals", yearOfStudy: 1, semester: "Semester 2", credits: 12, lecturer: "Dr. Michael Brown", students: 42, department: "Computer Science" },
  { id: "6", code: "MTH102", name: "Discrete Mathematics", yearOfStudy: 1, semester: "Semester 2", credits: 12, lecturer: "Prof. Bob Johnson", students: 42, department: "Mathematics" },
  { id: "7", code: "CSC103", name: "Computer Systems Architecture", yearOfStudy: 1, semester: "Semester 2", credits: 12, lecturer: "Dr. Alice Smith", students: 42, department: "Computer Science" },
  
  // Year 2 - Semester 1
  { id: "8", code: "CSC201", name: "Object Oriented Programming", yearOfStudy: 2, semester: "Semester 1", credits: 12, lecturer: "Dr. Alice Smith", students: 38, department: "Computer Science" },
  { id: "9", code: "CSC203", name: "Data Structures & Algorithms", yearOfStudy: 2, semester: "Semester 1", credits: 12, lecturer: "Dr. Michael Brown", students: 38, department: "Computer Science" },
  { id: "10", code: "CSC204", name: "Computer Networks", yearOfStudy: 2, semester: "Semester 1", credits: 12, lecturer: "Prof. David Wilson", students: 38, department: "Computer Science" },
  { id: "11", code: "MTH201", name: "Statistics for Computing", yearOfStudy: 2, semester: "Semester 1", credits: 12, lecturer: "Dr. Sarah Lee", students: 38, department: "Mathematics" },
  
  // Year 2 - Semester 2
  { id: "12", code: "CSC205", name: "Database Systems", yearOfStudy: 2, semester: "Semester 2", credits: 12, lecturer: "Prof. Bob Johnson", students: 35, department: "Computer Science" },
  { id: "13", code: "CSC206", name: "Software Engineering Principles", yearOfStudy: 2, semester: "Semester 2", credits: 12, lecturer: "Dr. Alice Smith", students: 35, department: "Computer Science" },
  { id: "14", code: "CSC207", name: "Operating Systems", yearOfStudy: 2, semester: "Semester 2", credits: 12, lecturer: "Dr. Michael Brown", students: 35, department: "Computer Science" },
  
  // Year 3 - Semester 1
  { id: "15", code: "CSC301", name: "Software Engineering", yearOfStudy: 3, semester: "Semester 1", credits: 12, lecturer: "Dr. Alice Smith", students: 32, department: "Computer Science" },
  { id: "16", code: "CSC302", name: "Web Development", yearOfStudy: 3, semester: "Semester 1", credits: 12, lecturer: "Ms. Carol White", students: 32, department: "Computer Science" },
  { id: "17", code: "CSC303", name: "Mobile App Development", yearOfStudy: 3, semester: "Semester 1", credits: 12, lecturer: "Dr. Michael Brown", students: 32, department: "Computer Science" },
  
  // Year 3 - Semester 2
  { id: "18", code: "CSC304", name: "Machine Learning", yearOfStudy: 3, semester: "Semester 2", credits: 12, lecturer: "Dr. David Wilson", students: 30, department: "Computer Science" },
  { id: "19", code: "CSC305", name: "Artificial Intelligence", yearOfStudy: 3, semester: "Semester 2", credits: 12, lecturer: "Prof. Bob Johnson", students: 30, department: "Computer Science" },
  { id: "20", code: "CSC306", name: "Cybersecurity", yearOfStudy: 3, semester: "Semester 2", credits: 12, lecturer: "Dr. Sarah Lee", students: 30, department: "Computer Science" },
  
  // Year 4 - Semester 1
  { id: "21", code: "CSC401", name: "Final Year Project I", yearOfStudy: 4, semester: "Semester 1", credits: 15, lecturer: "Various", students: 28, department: "Computer Science" },
  { id: "22", code: "CSC402", name: "Advanced Software Engineering", yearOfStudy: 4, semester: "Semester 1", credits: 12, lecturer: "Dr. Alice Smith", students: 28, department: "Computer Science" },
  { id: "23", code: "CSC403", name: "Distributed Systems", yearOfStudy: 4, semester: "Semester 1", credits: 12, lecturer: "Prof. David Wilson", students: 28, department: "Computer Science" },
  
  // Year 4 - Semester 2
  { id: "24", code: "CSC404", name: "Final Year Project II", yearOfStudy: 4, semester: "Semester 2", credits: 15, lecturer: "Various", students: 25, department: "Computer Science" },
  { id: "25", code: "CSC405", name: "Professional Development", yearOfStudy: 4, semester: "Semester 2", credits: 6, lecturer: "Ms. Carol White", students: 25, department: "Computer Science" },
]

const SEMESTERS = ["Semester 1", "Semester 2"]
const YEARS_OF_STUDY = [1, 2, 3, 4]

export default function AcademicModulesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedYear, setSelectedYear] = useState<number>(1)
  const [selectedSemester, setSelectedSemester] = useState<string>("Semester 1")
  const [searchTerm, setSearchTerm] = useState("")
  
  // Determine which action we came from (attendance or marks-submitted)
  const returnTo = searchParams.get('return') || 'marks-submitted'

  const filteredModules = useMemo(() => {
    return modules.filter(module => 
      module.yearOfStudy === selectedYear && 
      module.semester === selectedSemester &&
      (module.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        module.lecturer.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [selectedYear, selectedSemester, searchTerm])

  const totalCredits = filteredModules.reduce((sum, module) => sum + module.credits, 0)
  const totalStudents = filteredModules.length > 0 ? filteredModules[0].students : 0

  const handleModuleClick = (module: Module, action: 'marks' | 'attendance') => {
    if (action === 'marks') {
      router.push(`/academic/marks-submitted`)
    } else {
      router.push(`/academic/attendance`)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Academic Module Selection</h1>
          <p className="text-gray-600 mt-1">Select a module to view {returnTo === 'attendance' ? 'attendance records' : 'submitted marks'}</p>
        </div>
      </div>

      {/* Year and Semester Selection */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Select Academic Period</CardTitle>
          <CardDescription className="text-gray-600">
            Choose the year of study and semester to view available modules
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Year of Study</label>
              <Select value={selectedYear.toString()} onValueChange={(v) => setSelectedYear(Number(v))}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {YEARS_OF_STUDY.map(year => (
                    <SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Semester</label>
              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map(semester => (
                    <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Modules</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search modules..." 
                  className="bg-white pl-10" 
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 pt-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Showing {filteredModules.length} modules</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>{totalStudents} students per module</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{totalCredits} total credits</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredModules.map((module) => (
          <Card key={module.id} className="bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg text-gray-900">{module.code}</CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    {module.name}
                  </CardDescription>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {module.credits} credits
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>Lecturer: {module.lecturer}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{module.students} students enrolled</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Year {module.yearOfStudy} • {module.semester}</span>
                </div>
              </div>
              
              <div className="flex gap-2 pt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-blue-600 border-blue-200 hover:bg-blue-50"
                  onClick={() => handleModuleClick(module, 'marks')}
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View Marks
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1 text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleModuleClick(module, 'attendance')}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Attendance
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModules.length === 0 && (
        <Card className="bg-white border border-gray-200">
          <CardContent className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No modules found</h3>
            <p className="text-gray-600">No modules match your search criteria for Year {selectedYear}, {selectedSemester}.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
