"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  Users,
  Activity,
  CheckCircle,
  Mail,
  FileText,
  UserPlus,
  CheckSquare,
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
} from "lucide-react"
import Link from "next/link"
import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts"

const analyticsData = [
  { month: "Jan", performance: 75 },
  { month: "Feb", performance: 78 },
  { month: "Mar", performance: 80 },
  { month: "Apr", performance: 82 },
  { month: "May", performance: 85 },
  { month: "Jun", performance: 83 },
]

export default function HODDashboardPage() {
  return (
    <div className="grid gap-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">HOD Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening in your department.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Total Faculty
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  45
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+5% from last semester</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <Users className="h-6 w-6 text-[#026892]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Student Enrollment
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  1,234
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+3% from last week</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Pending Approvals
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  23
                </h3>
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <span>High priority</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Active Modules
                </p>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
                  32
                </h3>
                <div className="flex items-center gap-1 text-sm text-green-600">
                  <TrendingUp className="h-3 w-3" />
                  <span>+4 from last semester</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-gray-600">Perform common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              href="/academic/teaching-plans"
              className="flex items-center gap-3 p-3 rounded-md bg-blue-50 text-[#026892] hover:bg-blue-100 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Approve Teaching Plans</span>
            </Link>
            <Link
              href="/staff/workload"
              className="flex items-center gap-3 p-3 rounded-md bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-medium">Assign Lecturers to Modules</span>
            </Link>
            <Link
              href="/academic/assessment"
              className="flex items-center gap-3 p-3 rounded-md bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
            >
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">Approve Grades</span>
            </Link>
            <Link
              href="/staff/leave"
              className="flex items-center gap-3 p-3 rounded-md bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
            >
              <CalendarCheck className="h-5 w-5" />
              <span className="font-medium">Approve Staff Leave Requests</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="grid gap-2">
              <CardTitle className="text-lg font-semibold text-gray-900">Pending Approvals</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Recent items requiring your attention.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="gap-1 bg-[#026892] hover:bg-[#026892]/90 text-white">
              <Link href="/department/overview">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="hidden md:table-cell">Submitted By</TableHead>
                    <TableHead className="hidden md:table-cell">Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium text-gray-900">Teaching Plan - Module ABC101</TableCell>
                    <TableCell>Teaching Plan</TableCell>
                    <TableCell className="hidden md:table-cell">Dr. Alice Smith</TableCell>
                    <TableCell className="hidden md:table-cell">2024-07-20</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[#026892] hover:bg-blue-50">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-900">Leave Request - John Doe</TableCell>
                    <TableCell>Leave Request</TableCell>
                    <TableCell className="hidden md:table-cell">John Doe</TableCell>
                    <TableCell className="hidden md:table-cell">2024-07-19</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[#026892] hover:bg-blue-50">
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-900">Grade Submission - CSC203</TableCell>
                    <TableCell>Grade Approval</TableCell>
                    <TableCell className="hidden md:table-cell">Prof. Bob Johnson</TableCell>
                    <TableCell className="hidden md:table-cell">2024-07-18</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[#026892] hover:bg-blue-50">
                        Approve
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium text-gray-900">New Module Proposal - AI Ethics</TableCell>
                    <TableCell>Curriculum</TableCell>
                    <TableCell className="hidden md:table-cell">Dr. Emily White</TableCell>
                    <TableCell className="hidden md:table-cell">2024-07-17</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-[#026892] hover:bg-blue-50">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Department Activity</CardTitle>
            <CardDescription className="text-sm text-gray-600">Latest updates and actions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <div className="flex items-center gap-3 p-3 rounded-md bg-blue-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-[#026892]">
                <Activity className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-900">Staff workload reviewed</p>
                <p className="text-xs text-gray-600">Department-wide - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-green-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-900">Teaching plan approved</p>
                <p className="text-xs text-gray-600">Module XYZ202 - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-orange-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                <Mail className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-900">New student appeal received</p>
                <p className="text-xs text-gray-600">Student ID 12345 - 6 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-md bg-purple-50">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                <ClipboardCheck className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-900">Module assessment completed</p>
                <p className="text-xs text-gray-600">Module COE3163 - 8 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Department Performance Analytics</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Overall performance trends for the department.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsLineChart data={analyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#ddd' }}
                  tickLine={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fontSize: 12, fill: '#666' }}
                  axisLine={{ stroke: '#ddd' }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="performance" 
                  stroke="#026892" 
                  strokeWidth={3}
                  dot={{ fill: '#026892', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#026892', strokeWidth: 2, fill: '#fff' }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}