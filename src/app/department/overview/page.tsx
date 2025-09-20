"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import {
  Users,
  BookOpen,
  GraduationCap,
  Award,
  LineChart,
  CheckCircle,
} from "lucide-react";
import {
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const departmentPerformanceData = [
  { quarter: "Q1", "Pass Rate": 85, "Completion Rate": 90 },
  { quarter: "Q2", "Pass Rate": 88, "Completion Rate": 92 },
  { quarter: "Q3", "Pass Rate": 87, "Completion Rate": 91 },
  { quarter: "Q4", "Pass Rate": 89, "Completion Rate": 93 },
];

export default function DepartmentOverviewPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Department Overview
      </h1>
      <p className="text-gray-600 text-sm">
        A comprehensive look at your department's key metrics and activities.
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-white shadow-sm border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900">
              Key Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Users className="h-6 w-6 text-samps-blue-600" />
                <div>
                  <div className="text-xs text-gray-600">Total Lecturers</div>
                  <div className="text-xl font-bold text-samps-blue-900">
                    25
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <BookOpen className="h-6 w-6 text-samps-green-600" />
                <div>
                  <div className="text-xs text-gray-600">Total Modules</div>
                  <div className="text-xl font-bold text-samps-green-900">
                    40
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <GraduationCap className="h-6 w-6 text-samps-yellow-600" />
                <div>
                  <div className="text-xs text-gray-600">Active Students</div>
                  <div className="text-xl font-bold text-samps-yellow-900">
                    1200
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <Award className="h-6 w-6 text-samps-green-600" />
                <div>
                  <div className="text-xs text-gray-600">Average Pass Rate</div>
                  <div className="text-xl font-bold text-samps-green-700">
                    88%
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <LineChart className="h-6 w-6 text-samps-blue-600" />
                <div>
                  <div className="text-xs text-gray-600">
                    Research Publications (Last Year)
                  </div>
                  <div className="text-xl font-bold text-samps-blue-900">
                    15
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                <CheckCircle className="h-6 w-6 text-samps-green-600" />
                <div>
                  <div className="text-xs text-gray-600">
                    Student Retention Rate
                  </div>
                  <div className="text-xl font-bold text-samps-green-700">
                    92%
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 bg-white shadow-sm border border-gray-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Recent Department Activities
            </CardTitle>
            <Button
              size="sm"
              className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white"
            >
              <PlusCircle className="h-4 w-4" />
              Add Activity
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-gray-700">Activity</TableHead>
                  <TableHead className="text-gray-700">Date</TableHead>
                  <TableHead className="text-gray-700">Status</TableHead>
                  <TableHead className="text-right text-gray-700">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-800">
                    Department Meeting Minutes
                  </TableCell>
                  <TableCell className="text-gray-700">2024-07-24</TableCell>
                  <TableCell className="text-samps-green-600">
                    Completed
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-blue-600 hover:bg-samps-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-red-600 hover:bg-samps-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-800">
                    New Lecturer Onboarding
                  </TableCell>
                  <TableCell className="text-gray-700">2024-07-22</TableCell>
                  <TableCell className="text-samps-orange-600">
                    In Progress
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-blue-600 hover:bg-samps-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-red-600 hover:bg-samps-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-800">
                    Curriculum Review Session
                  </TableCell>
                  <TableCell className="text-gray-700">2024-07-18</TableCell>
                  <TableCell className="text-samps-green-600">
                    Completed
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-blue-600 hover:bg-samps-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-red-600 hover:bg-samps-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow className="hover:bg-gray-50">
                  <TableCell className="font-medium text-gray-800">
                    Student Feedback Analysis
                  </TableCell>
                  <TableCell className="text-gray-700">2024-07-15</TableCell>
                  <TableCell className="text-samps-orange-600">
                    Pending
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-blue-600 hover:bg-samps-blue-50"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-samps-red-600 hover:bg-samps-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Department Performance Trends
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Visual representation of key performance indicators over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              "Pass Rate": {
                label: "Pass Rate",
                color: "hsl(var(--samps-blue-600))",
              },
              "Completion Rate": {
                label: "Completion Rate",
                color: "hsl(var(--samps-green-500))",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart
                data={departmentPerformanceData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Pass Rate" fill="#026892" radius={4} />
                <Bar dataKey="Completion Rate" fill="#38A06C" radius={4} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
