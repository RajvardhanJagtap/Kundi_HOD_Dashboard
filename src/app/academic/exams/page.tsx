"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import {
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const examStatisticsData = [
  { semester: "S1 2023", "Average Score": 75, "Pass Rate": 88 },
  { semester: "S2 2023", "Average Score": 78, "Pass Rate": 90 },
  { semester: "S1 2024", "Average Score": 80, "Pass Rate": 92 },
]

export default function ExamsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Exams Management</h1>
      <p className="text-gray-600 text-sm">Manage and schedule departmental examinations.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Exam Schedule</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-bg-[#026892]/90 text-white">
            <PlusCircle className="h-4 w-4" />
            Add Exam
          </Button>
        </CardHeader>
        <CardContent>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">Module</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider">Venue</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-900 tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">CSC101</td>
                  <td className="px-4 py-3 text-sm text-gray-600">2024-12-10</td>
                  <td className="px-4 py-3 text-sm text-gray-600">09:00 AM</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Exam Hall 1</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-samps-red-600 hover:bg-samps-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">MTH203</td>
                  <td className="px-4 py-3 text-sm text-gray-600">2024-12-12</td>
                  <td className="px-4 py-3 text-sm text-gray-600">02:00 PM</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Exam Hall 2</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-samps-red-600 hover:bg-samps-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">ENG101</td>
                  <td className="px-4 py-3 text-sm text-gray-600">2024-12-15</td>
                  <td className="px-4 py-3 text-sm text-gray-600">10:00 AM</td>
                  <td className="px-4 py-3 text-sm text-gray-600">Lecture Hall 3</td>
                  <td className="px-4 py-3 text-sm text-gray-600 text-right">
                    <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-samps-red-600 hover:bg-samps-red-50">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Exam Statistics</CardTitle>
          <CardDescription className="text-sm text-gray-600">Performance overview of recent exams.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              "Average Score": {
                label: "Average Score",
                color: "#026892",
              },
              "Pass Rate": {
                label: "Pass Rate",
                color: "#026892",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={examStatisticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="semester" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="Average Score" stroke="var(--color-Average-Score)" />
                <Line type="monotone" dataKey="Pass Rate" stroke="var(--color-Pass-Rate)" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
