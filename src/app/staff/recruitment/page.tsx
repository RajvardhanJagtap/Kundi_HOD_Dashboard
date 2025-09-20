"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PlusCircle, FileText, Users, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"

interface Position {
  id: string
  title: string
  department: string
  type: 'Academic' | 'Research' | 'Administrative' | 'Technical'
  level: 'Junior' | 'Mid' | 'Senior' | 'Director'
  status: 'Open' | 'Screening' | 'Interviewing' | 'Offer' | 'Closed' | 'On Hold'
  applicants: number
  posted: string
  deadline: string
  salary?: string
  description: string
}

const positions: Position[] = [
  {
    id: '1',
    title: 'Senior Lecturer in Artificial Intelligence',
    department: 'Computer Science',
    type: 'Academic',
    level: 'Senior',
    status: 'Interviewing',
    applicants: 25,
    posted: '2024-07-15',
    deadline: '2024-09-30',
    salary: '$75,000 - $85,000',
    description: 'Teaching AI courses and conducting research in machine learning'
  },
  {
    id: '2',
    title: 'Research Assistant in Data Science',
    department: 'Computer Science',
    type: 'Research',
    level: 'Junior',
    status: 'Open',
    applicants: 42,
    posted: '2024-08-01',
    deadline: '2024-10-15',
    salary: '$35,000 - $42,000',
    description: 'Supporting research projects in big data analytics and visualization'
  },
  {
    id: '3',
    title: 'Department Administrator',
    department: 'Administration',
    type: 'Administrative',
    level: 'Mid',
    status: 'Screening',
    applicants: 18,
    posted: '2024-08-10',
    deadline: '2024-09-20',
    salary: '$45,000 - $55,000',
    description: 'Managing departmental operations and student services'
  },
  {
    id: '4',
    title: 'IT Systems Analyst',
    department: 'IT Services',
    type: 'Technical',
    level: 'Mid',
    status: 'Offer',
    applicants: 12,
    posted: '2024-07-20',
    deadline: '2024-08-30',
    salary: '$55,000 - $65,000',
    description: 'Maintaining and upgrading departmental technology infrastructure'
  },
  {
    id: '5',
    title: 'Lecturer in Software Engineering',
    department: 'Computer Science',
    type: 'Academic',
    level: 'Mid',
    status: 'Closed',
    applicants: 31,
    posted: '2024-06-01',
    deadline: '2024-07-31',
    salary: '$60,000 - $70,000',
    description: 'Teaching undergraduate and graduate software engineering courses'
  }
]

const recruitmentPipelineData = [
  { stage: "Applications", count: 128, color: "#3B82F6" },
  { stage: "Initial Screening", count: 45, color: "#10B981" },
  { stage: "Interview Round 1", count: 18, color: "#F59E0B" },
  { stage: "Interview Round 2", count: 8, color: "#EF4444" },
  { stage: "Final Decision", count: 3, color: "#8B5CF6" },
]

const POSITION_TYPE_COLORS = {
  Academic: 'bg-blue-50 text-blue-700 border-blue-200',
  Research: 'bg-green-50 text-green-700 border-green-200',
  Administrative: 'bg-purple-50 text-purple-700 border-purple-200',
  Technical: 'bg-orange-50 text-orange-700 border-orange-200'
}

const STATUS_COLORS = {
  Open: 'bg-green-50 text-green-700',
  Screening: 'bg-blue-50 text-blue-700',
  Interviewing: 'bg-yellow-50 text-yellow-700',
  Offer: 'bg-purple-50 text-purple-700',
  Closed: 'bg-gray-50 text-gray-700',
  'On Hold': 'bg-red-50 text-red-700'
}

export default function RecruitmentPage() {
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterType, setFilterType] = useState<string>('All')

  const filteredPositions = useMemo(() => {
    return positions.filter(position => {
      const statusMatch = filterStatus === 'All' || position.status === filterStatus
      const typeMatch = filterType === 'All' || position.type === filterType
      return statusMatch && typeMatch
    })
  }, [filterStatus, filterType])

  const openPositions = positions.filter(p => p.status === 'Open').length
  const totalApplicants = positions.reduce((sum, p) => sum + p.applicants, 0)
  const interviewingPositions = positions.filter(p => p.status === 'Interviewing').length
  const filledPositions = positions.filter(p => p.status === 'Closed').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Staff Recruitment</h1>
          <p className="text-gray-600 mt-1">Manage hiring processes and track recruitment activities</p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90">
          <PlusCircle className="h-4 w-4 mr-2" />
          Post New Position
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Open Positions</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{openPositions}</div>
            <p className="text-xs text-blue-600">Currently recruiting</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Total Applicants</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{totalApplicants}</div>
            <p className="text-xs text-gray-500">Across all positions</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">In Interview Stage</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{interviewingPositions}</div>
            <p className="text-xs text-orange-600">Active interviews</p>
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Positions Filled</CardTitle>
            <CheckCircle className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{filledPositions}</div>
            <p className="text-xs text-green-600">Successfully hired</p>
          </CardContent>
        </Card>
      </div>

      {/* Positions Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Current Positions</CardTitle>
              <CardDescription className="text-gray-600">
                Track all recruitment activities and position statuses
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
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Screening">Screening</SelectItem>
                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
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
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredPositions.length} of {positions.length} positions
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Position Details</TableHead>
                <TableHead className="text-gray-700">Type & Level</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Applicants</TableHead>
                <TableHead className="text-gray-700">Timeline</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPositions.map((position) => (
                <TableRow key={position.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div>
                      <div className="font-medium text-gray-900">{position.title}</div>
                      <div className="text-sm text-gray-600">{position.department}</div>
                      {position.salary && (
                        <div className="text-xs text-gray-500">{position.salary}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={`text-xs ${POSITION_TYPE_COLORS[position.type]}`}>
                        {position.type}
                      </Badge>
                      <div className="text-xs text-gray-600">{position.level} Level</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`text-xs ${STATUS_COLORS[position.status]}`}>
                      {position.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{position.applicants}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-600">Posted: {new Date(position.posted).toLocaleDateString()}</div>
                      <div className="font-medium">Deadline: {new Date(position.deadline).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <FileText className="h-3 w-3 mr-1" />
                        {position.status === 'Closed' ? 'View Details' : 'Manage'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredPositions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No positions match the current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Recruitment Pipeline Chart */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl text-gray-900">Recruitment Pipeline</CardTitle>
          <CardDescription className="text-gray-600">
            Current status of all candidates across the hiring process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <RechartsBarChart data={recruitmentPipelineData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="stage" 
                tick={{ fontSize: 12, fill: '#666' }} 
                axisLine={{ stroke: '#ddd' }}
              />
              <YAxis tick={{ fontSize: 12, fill: '#666' }} axisLine={{ stroke: '#ddd' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd', 
                  borderRadius: 8 
                }}
                formatter={(value) => [`${value} candidates`, 'Count']}
              />
              <Bar 
                dataKey="count" 
                radius={[4, 4, 0, 0]}
                fill={(entry) => entry.color || '#026892'}
              />
            </RechartsBarChart>
          </ResponsiveContainer>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
            {recruitmentPipelineData.map((stage, index) => (
              <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold" style={{ color: stage.color }}>{stage.count}</div>
                <div className="text-xs text-gray-600">{stage.stage}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
