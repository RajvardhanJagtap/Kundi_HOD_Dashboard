"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  ArrowUpRight,
  LineChart,
  Users,
  BookOpen,
  Award,
  Activity,
  CheckCircle,
  Mail,
  FileText,
  UserPlus,
  CheckSquare,
  CalendarCheck,
} from "lucide-react"
import Link from "next/link"
import {
  Line,
  Bar,
  Pie,
  RadialBar,
  LineChart as RechartsLineChart,
  BarChart as RechartsBarChart,
  PieChart as RechartsPieChart,
  RadialBarChart as RechartsRadialBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts"


// Dummy Data for Charts
const kpiData = [
  { semester: "S1 2023", "Pass Rate": 80 },
  { semester: "S2 2023", "Pass Rate": 82 },
  { semester: "S1 2024", "Pass Rate": 85 },
]

const workloadData = [
  { name: "Lecturers", hours: 1200 },
  { name: "Professors", hours: 800 },
  { name: "Assistants", hours: 400 },
]

const moduleCompletionData = [{ name: "Completed", value: 95 }]

const qualityAlertsData = [
  { name: "Student Feedback", value: 2 },
  { name: "Curriculum", value: 1 },
  { name: "Other", value: 0 },
]
const PIE_COLORS = ["#026892", "#38A06C", "#C2410C"]

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
    <div className="grid gap-3">
      <h1 className="text-2xl font-bold tracking-tight text-black">HOD Dashboard</h1>
      <p className="text-gray-700 text-medium mb-6">Welcome back! Here's what's happening in your department.</p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Department KPIs</CardTitle>
            <LineChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">85% Pass Rate</div>
            <p className="text-xs text-gray-500">
              <span className="text-samps-green-600">&#43;5%</span> from last semester
            </p>
            <ResponsiveContainer width="100%" height={80}>
              <RechartsLineChart data={kpiData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="semester" tickLine={false} axisLine={false} hide />
                <YAxis domain={[70, 90]} tickLine={false} axisLine={false} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  dataKey="Pass Rate"
                  type="monotone"
                  stroke="#026892"
                  strokeWidth={3}
                  dot={{ fill: '#026892', strokeWidth: 2, r: 3 }}
                  activeDot={{ r: 5, stroke: '#026892', strokeWidth: 2, fill: '#fff' }}
                />
              </RechartsLineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Staff Workload</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">1200 Teaching Hours</div>
            <p className="text-xs text-gray-500">Average 15 hours/lecturer</p>
            <ResponsiveContainer width="100%" height={80}>
              <RechartsBarChart data={workloadData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} hide />
                <YAxis tickLine={false} axisLine={false} hide />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="hours" fill="#38A06C" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Module Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">95% Completed</div>
            <p className="text-xs text-gray-500">3 modules pending finalization</p>
            <ResponsiveContainer width="100%" height={80}>
              <RechartsRadialBarChart
                cx="50%"
                cy="50%"
                innerRadius="60%"
                outerRadius="80%"
                barSize={10}
                data={moduleCompletionData}
                startAngle={90}
                endAngle={90 + (moduleCompletionData[0].value / 100) * 360}
              >
                <RadialBar dataKey="value" cornerRadius={10} fill="#C2410C" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </RechartsRadialBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">Quality Alerts</CardTitle>
            <Award className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-gray-900">3 Critical Alerts</div>
            <p className="text-xs text-gray-500">2 student feedback, 1 curriculum</p>
            <ResponsiveContainer width="100%" height={80}>
              <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={qualityAlertsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {qualityAlertsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Quick Actions</CardTitle>
            <CardDescription className="text-sm text-gray-600">Perform common tasks quickly.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link
              href="/academic/teaching-plans"
              className="flex items-center gap-3 p-3 rounded-md bg-samps-blue-50 text-samps-blue-700 hover:bg-samps-blue-100 transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span className="font-medium">Approve Teaching Plans</span>
            </Link>
            <Link
              href="/staff/workload"
              className="flex items-center gap-3 p-3 rounded-md bg-samps-green-50 text-samps-green-700 hover:bg-samps-green-100 transition-colors"
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-medium">Assign Lecturers to Modules</span>
            </Link>
            <Link
              href="/academic/assessment"
              className="flex items-center gap-3 p-3 rounded-md bg-samps-orange-50 text-samps-orange-700 hover:bg-samps-orange-100 transition-colors"
            >
              <CheckSquare className="h-5 w-5" />
              <span className="font-medium">Approve Grades</span>
            </Link>
            <Link
              href="/staff/leave"
              className="flex items-center gap-3 p-3 rounded-md bg-samps-red-50 text-samps-red-700 hover:bg-samps-red-100 transition-colors"
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
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">Item</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider hidden md:table-cell">Submitted By</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider hidden md:table-cell">Date</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Teaching Plan - Module ABC101</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Teaching Plan</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">Dr. Alice Smith</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">2024-07-20</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                        Review
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Leave Request - John Doe</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Leave Request</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">John Doe</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">2024-07-19</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                        Approve
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">Grade Submission - CSC203</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Grade Approval</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">Prof. Bob Johnson</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">2024-07-18</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                        Approve
                      </Button>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">New Module Proposal - AI Ethics</td>
                    <td className="px-4 py-3 text-sm text-gray-600">Curriculum</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">Dr. Emily White</td>
                    <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">2024-07-17</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-right">
                      <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                        Review
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">Recent Department Activity</CardTitle>
            <CardDescription className="text-sm text-gray-600">Latest updates and actions.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-samps-blue-50 text-samps-blue-600">
                <Activity className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-800">Staff workload reviewed</p>
                <p className="text-xs text-gray-500">Department-wide - 1 hour ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-samps-green-50 text-samps-green-600">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-800">Teaching plan approved</p>
                <p className="text-xs text-gray-500">Module XYZ202 - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-samps-orange-50 text-samps-orange-600">
                <Mail className="h-4 w-4" />
              </div>
              <div className="grid gap-0.5">
                <p className="text-sm font-medium text-gray-800">New student appeal received</p>
                <p className="text-xs text-gray-500">Student ID 12345 - 6 hours ago</p>
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
