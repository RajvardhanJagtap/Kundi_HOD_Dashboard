"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, BookOpen, Users, Award, TrendingUp, Calendar, Target } from "lucide-react"
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface DevelopmentProgram {
  id: string
  name: string
  type: 'Workshop' | 'Course' | 'Conference' | 'Certification' | 'Mentorship'
  status: 'Planning' | 'Ongoing' | 'Completed' | 'Cancelled'
  participants: number
  startDate: string
  endDate?: string
  budget: number
  provider: string
  completion?: number
}

const developmentPrograms: DevelopmentProgram[] = [
  {
    id: '1',
    name: 'Advanced Research Methods',
    type: 'Course',
    status: 'Ongoing',
    participants: 5,
    startDate: '2024-07-01',
    endDate: '2024-09-30',
    budget: 2500,
    provider: 'University Professional Development',
    completion: 65
  },
  {
    id: '2',
    name: 'Teaching Excellence Workshop',
    type: 'Workshop',
    status: 'Planning',
    participants: 10,
    startDate: '2024-09-15',
    endDate: '2024-09-16',
    budget: 1200,
    provider: 'Educational Excellence Center'
  },
  {
    id: '3',
    name: 'Leadership in Higher Education',
    type: 'Certification',
    status: 'Completed',
    participants: 3,
    startDate: '2024-06-01',
    endDate: '2024-07-15',
    budget: 4000,
    provider: 'Leadership Institute',
    completion: 100
  },
  {
    id: '4',
    name: 'Digital Transformation Conference',
    type: 'Conference',
    status: 'Planning',
    participants: 8,
    startDate: '2024-10-20',
    endDate: '2024-10-22',
    budget: 3200,
    provider: 'Tech Education Summit'
  },
  {
    id: '5',
    name: 'Junior Faculty Mentorship',
    type: 'Mentorship',
    status: 'Ongoing',
    participants: 4,
    startDate: '2024-08-01',
    endDate: '2024-12-31',
    budget: 800,
    provider: 'Internal Program',
    completion: 30
  }
]

const developmentByCategory = [
  { category: 'Teaching Skills', participants: 18, programs: 4 },
  { category: 'Research Methods', participants: 12, programs: 3 },
  { category: 'Leadership', participants: 8, programs: 2 },
  { category: 'Technology', participants: 15, programs: 3 },
  { category: 'Professional Skills', participants: 10, programs: 2 }
]

const PROGRAM_TYPE_COLORS = {
  Workshop: 'bg-blue-50 text-blue-700 border-blue-200',
  Course: 'bg-green-50 text-green-700 border-green-200',
  Conference: 'bg-purple-50 text-purple-700 border-purple-200',
  Certification: 'bg-orange-50 text-orange-700 border-orange-200',
  Mentorship: 'bg-pink-50 text-pink-700 border-pink-200'
}

const STATUS_COLORS = {
  Planning: 'bg-gray-50 text-gray-700',
  Ongoing: 'bg-blue-50 text-blue-700',
  Completed: 'bg-green-50 text-green-700',
  Cancelled: 'bg-red-50 text-red-700'
}

export default function DevelopmentPage() {
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterType, setFilterType] = useState<string>('All')

  const filteredPrograms = useMemo(() => {
    return developmentPrograms.filter(program => {
      const statusMatch = filterStatus === 'All' || program.status === filterStatus
      const typeMatch = filterType === 'All' || program.type === filterType
      return statusMatch && typeMatch
    })
  }, [filterStatus, filterType])

  const ongoingCount = developmentPrograms.filter(p => p.status === 'Ongoing').length
  const totalParticipants = developmentPrograms.reduce((sum, p) => sum + p.participants, 0)
  const totalBudget = developmentPrograms.reduce((sum, p) => sum + p.budget, 0)
  const completedPrograms = developmentPrograms.filter(p => p.status === 'Completed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Staff Development</h1>
          <p className="text-gray-600 mt-1">Manage and track professional development programs and activities</p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90">
          <PlusCircle className="h-4 w-4 mr-2" />
          Create New Program
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Active Programs</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{ongoingCount}</div>
            <p className="text-xs text-blue-600">Currently running</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalParticipants}</div>
            <p className="text-xs text-gray-500">Across all programs</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Budget Allocated</CardTitle>
            <Award className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">${totalBudget.toLocaleString()}</div>
            <p className="text-xs text-gray-500">This fiscal year</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{completedPrograms}</div>
            <p className="text-xs text-green-600">Successfully finished</p>
          </CardContent>
        </Card>
      </div>

      {/* Programs Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Development Programs</CardTitle>
              <CardDescription className="text-gray-600">
                Professional development programs and training initiatives
              </CardDescription>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Status:</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="bg-white w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Ongoing">Ongoing</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">Type:</label>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-white w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Types</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Course">Course</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Certification">Certification</SelectItem>
                    <SelectItem value="Mentorship">Mentorship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPrograms.length} of {developmentPrograms.length} programs
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Program Details</TableHead>
                <TableHead className="text-gray-700">Type & Status</TableHead>
                <TableHead className="text-gray-700">Participants</TableHead>
                <TableHead className="text-gray-700">Timeline</TableHead>
                <TableHead className="text-gray-700">Progress</TableHead>
                <TableHead className="text-right text-gray-700">Budget</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrograms.map((program) => (
                <TableRow key={program.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{program.name}</div>
                      <div className="text-sm text-gray-600">{program.provider}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={`text-xs ${PROGRAM_TYPE_COLORS[program.type]}`}>
                        {program.type}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${STATUS_COLORS[program.status]}`}>
                        {program.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{program.participants}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{new Date(program.startDate).toLocaleDateString()}</div>
                      {program.endDate && (
                        <div className="text-gray-600">to {new Date(program.endDate).toLocaleDateString()}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {program.completion !== undefined ? (
                      <div className="space-y-1">
                        <Progress value={program.completion} className="w-16" />
                        <div className="text-xs text-gray-600">{program.completion}%</div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-500">Not started</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">${program.budget.toLocaleString()}</div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPrograms.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No development programs match the current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Development Categories Chart */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Development Focus Areas</CardTitle>
          <CardDescription className="text-gray-600">
            Number of participants by development category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={developmentByCategory} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="category" 
                tick={{ fontSize: 12, fill: '#666' }} 
                axisLine={{ stroke: '#ddd' }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd', 
                  borderRadius: 8 
                }}
                formatter={(value, name) => [
                  `${value} ${name === 'participants' ? 'participants' : 'programs'}`,
                  name === 'participants' ? 'Participants' : 'Programs'
                ]}
              />
              <Bar dataKey="participants" fill="#026892" radius={[4, 4, 0, 0]} name="participants" />
            </RechartsBarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
