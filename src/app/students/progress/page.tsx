"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const modulePerformanceData = [
  { module: "CSC101", "Average Grade": 85 },
  { module: "MTH203", "Average Grade": 78 },
  { module: "ENG101", "Average Grade": 90 },
  { module: "PHY305", "Average Grade": 72 },
]

export default function StudentProgressPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Student Progress</h1>
      <p className="text-gray-600 text-sm">Monitor the academic progress and performance of students.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Student Performance Overview</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <TrendingUp className="h-4 w-4" />
            View Trends
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Student ID</TableHead>
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="text-gray-700">Program</TableHead>
                <TableHead className="text-gray-700">Current GPA</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU001</TableCell>
                <TableCell className="text-gray-700">Alice Brown</TableCell>
                <TableCell className="text-gray-700">B.Sc. Computer Science</TableCell>
                <TableCell className="text-gray-700">3.8</TableCell>
                <TableCell className="text-samps-green-600">On Track</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU003</TableCell>
                <TableCell className="text-gray-700">Charlie Green</TableCell>
                <TableCell className="text-gray-700">B.Sc. Computer Science</TableCell>
                <TableCell className="text-gray-700">2.5</TableCell>
                <TableCell className="text-samps-orange-600">At Risk</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU004</TableCell>
                <TableCell className="text-gray-700">Diana Prince</TableCell>
                <TableCell className="text-gray-700">M.Sc. Data Science</TableCell>
                <TableCell className="text-gray-700">3.9</TableCell>
                <TableCell className="text-samps-green-600">On Track</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Module Performance Breakdown</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Average grades per module across all students.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              "Average Grade": {
                label: "Average Grade",
                color: "#026892",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={modulePerformanceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="module" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Average Grade" fill="#026892" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
