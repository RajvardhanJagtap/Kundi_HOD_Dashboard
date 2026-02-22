"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, XSquare, Calendar, Clock, Users, AlertTriangle, FileText } from "lucide-react"

interface LeaveRequest {
  id: string
  staffName: string
  position: string
  leaveType: 'Annual' | 'Sick' | 'Emergency' | 'Conference' | 'Maternity' | 'Study'
  startDate: string
  endDate: string
  days: number
  reason: string
  status: 'Pending' | 'Approved' | 'Rejected'
  submittedDate: string
  priority: 'Low' | 'Medium' | 'High'
}

const leaveRequests: LeaveRequest[] = [
  {
    id: '1',
    staffName: 'Dr. Alice Iradukunda',
    position: 'Senior Lecturer',
    leaveType: 'Annual',
    startDate: '2024-09-20',
    endDate: '2024-09-27',
    days: 6,
    reason: 'Family vacation - pre-planned summer holiday',
    status: 'Pending',
    submittedDate: '2024-08-15',
    priority: 'Low'
  },
  {
    id: '2',
    staffName: 'Prof. Bob Johnson',
    position: 'Professor',
    leaveType: 'Conference',
    startDate: '2024-09-15',
    endDate: '2024-09-18',
    days: 4,
    reason: 'IEEE International Conference on AI - presenting research paper',
    status: 'Pending',
    submittedDate: '2024-08-10',
    priority: 'Medium'
  },
  {
    id: '3',
    staffName: 'Dr. Sarah Lee',
    position: 'Lecturer',
    leaveType: 'Sick',
    startDate: '2024-09-12',
    endDate: '2024-09-13',
    days: 2,
    reason: 'Medical appointment and recovery',
    status: 'Pending',
    submittedDate: '2024-09-10',
    priority: 'High'
  },
  {
    id: '4',
    staffName: 'Ms. Carol White',
    position: 'Assistant Lecturer',
    leaveType: 'Study',
    startDate: '2024-09-25',
    endDate: '2024-09-25',
    days: 1,
    reason: 'PhD thesis defense preparation meeting',
    status: 'Pending',
    submittedDate: '2024-09-08',
    priority: 'Medium'
  },
  {
    id: '5',
    staffName: 'Dr. Michael Brown',
    position: 'Senior Lecturer',
    leaveType: 'Emergency',
    startDate: '2024-09-11',
    endDate: '2024-09-11',
    days: 1,
    reason: 'Family emergency - hospital visit',
    status: 'Approved',
    submittedDate: '2024-09-11',
    priority: 'High'
  }
]

const LEAVE_TYPE_COLORS = {
  Annual: 'bg-blue-50 text-[#026892]/90 border-blue-200',
  Sick: 'bg-red-50 text-red-700 border-red-200',
  Emergency: 'bg-orange-50 text-orange-700 border-orange-200',
  Conference: 'bg-purple-50 text-purple-700 border-purple-200',
  Maternity: 'bg-pink-50 text-pink-700 border-pink-200',
  Study: 'bg-green-50 text-green-700 border-green-200'
}

const PRIORITY_COLORS = {
  Low: 'bg-gray-50 text-gray-600',
  Medium: 'bg-yellow-50 text-yellow-700',
  High: 'bg-red-50 text-red-700'
}

export default function LeavePage() {
  const [filterStatus, setFilterStatus] = useState<string>('All')
  const [filterType, setFilterType] = useState<string>('All')

  const filteredRequests = useMemo(() => {
    return leaveRequests.filter(request => {
      const statusMatch = filterStatus === 'All' || request.status === filterStatus
      const typeMatch = filterType === 'All' || request.leaveType === filterType
      return statusMatch && typeMatch
    })
  }, [filterStatus, filterType])

  const pendingCount = leaveRequests.filter(r => r.status === 'Pending').length
  const upcomingLeave = leaveRequests.filter(r => 
    r.status === 'Approved' && new Date(r.startDate) > new Date()
  ).length
  const totalDaysThisMonth = leaveRequests
    .filter(r => r.status === 'Approved' && new Date(r.startDate).getMonth() === new Date().getMonth())
    .reduce((sum, r) => sum + r.days, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Staff Leave Management</h1>
          <p className="text-gray-600 mt-1">Review, approve, and track leave requests for department staff</p>
        </div>
        <Button className="bg-[#026892] hover:bg-[#026892]/90">
          <FileText className="h-4 w-4 mr-2" />
          Leave Policy Guide
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Pending Requests</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{pendingCount}</h3>
              <p className="text-[11px] font-medium text-orange-600 truncate">Require your approval</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Upcoming Leave</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{upcomingLeave}</h3>
              <p className="text-[11px] font-medium text-gray-600 truncate">Approved future leave</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#026892]" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Days This Month</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">{totalDaysThisMonth}</h3>
              <p className="text-[11px] font-medium text-gray-600 truncate">Total approved days</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">Staff Coverage</p>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">85%</h3>
              <p className="text-[11px] font-medium text-green-600 truncate">Available this week</p>
            </div>
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-purple-50 flex items-center justify-center flex-shrink-0">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Leave Requests */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-xl text-gray-900">Leave Requests</CardTitle>
              <CardDescription className="text-gray-600">
                Review and manage staff leave requests
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
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
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
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Sick">Sick</SelectItem>
                    <SelectItem value="Emergency">Emergency</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Study">Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredRequests.length} of {leaveRequests.length} requests
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Staff Member</TableHead>
                <TableHead className="text-gray-700">Type & Priority</TableHead>
                <TableHead className="text-gray-700">Duration</TableHead>
                <TableHead className="text-gray-700">Reason</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-[#026892] text-white text-xs">
                          {request.staffName.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{request.staffName}</div>
                        <div className="text-sm text-gray-600">{request.position}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={`text-xs ${LEAVE_TYPE_COLORS[request.leaveType]}`}>
                        {request.leaveType} Leave
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${PRIORITY_COLORS[request.priority]}`}>
                        {request.priority} Priority
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="font-medium">{new Date(request.startDate).toLocaleDateString()}</div>
                      <div className="text-gray-600">
                        {request.startDate === request.endDate ? 
                          '1 day' : 
                          `to ${new Date(request.endDate).toLocaleDateString()} (${request.days} days)`
                        }
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="text-sm text-gray-900 truncate" title={request.reason}>
                        {request.reason}
                      </div>
                      <div className="text-xs text-gray-500">
                        Submitted {new Date(request.submittedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}
                           className={`${
                             request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                             request.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                             'bg-red-100 text-red-800'
                           }`}>
                      {request.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {request.status === 'Pending' ? (
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50">
                          <CheckSquare className="h-3 w-3 mr-1" /> Approve
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                          <XSquare className="h-3 w-3 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="text-gray-500">
                        <FileText className="h-3 w-3 mr-1" /> View Details
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRequests.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p>No leave requests match the current filters.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Summary */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Leave Balance Overview</CardTitle>
            <CardDescription className="text-gray-600">
              Current leave balances for key staff members
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveRequests.slice(0, 4).map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#026892] text-white text-xs">
                      {request.staffName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{request.staffName}</div>
                    <div className="text-xs text-gray-600">{request.position}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">18 days</div>
                  <div className="text-xs text-gray-600">remaining</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg text-gray-900">Upcoming Leave Schedule</CardTitle>
            <CardDescription className="text-gray-600">
              Approved leave in the next 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {leaveRequests.filter(r => r.status === 'Approved').map(request => (
              <div key={request.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <div>
                  <div className="font-medium text-sm">{request.staffName}</div>
                  <div className="text-xs text-gray-600">{request.leaveType} Leave</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{new Date(request.startDate).toLocaleDateString()}</div>
                  <div className="text-xs text-gray-600">{request.days} day{request.days > 1 ? 's' : ''}</div>
                </div>
              </div>
            ))}
            {leaveRequests.filter(r => r.status === 'Approved').length === 0 && (
              <div className="text-center py-4 text-gray-500">
                <p>No approved leave scheduled</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
