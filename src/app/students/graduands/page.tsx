"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckSquare, FileText } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const graduationStatisticsData = [
  { year: 2022, Graduates: 250 },
  { year: 2023, Graduates: 270 },
  { year: 2024, Graduates: 290 },
]

export default function GraduandsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Graduands Management</h1>
      <p className="text-gray-600 text-sm">Manage and approve students eligible for graduation.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Graduation Candidates</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <CheckSquare className="h-4 w-4" />
            Finalize List
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Student ID</TableHead>
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="text-gray-700">Program</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU010</TableCell>
                <TableCell className="text-gray-700">David Lee</TableCell>
                <TableCell className="text-gray-700">B.Sc. Computer Science</TableCell>
                <TableCell className="text-samps-green-600">Eligible</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Transcript
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU011</TableCell>
                <TableCell className="text-gray-700">Sarah Kim</TableCell>
                <TableCell className="text-gray-700">M.Sc. Data Science</TableCell>
                <TableCell className="text-samps-orange-600">Pending Review</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Transcript
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU013</TableCell>
                <TableCell className="text-gray-700">Emily Chen</TableCell>
                <TableCell className="text-gray-700">B.Sc. Computer Science</TableCell>
                <TableCell className="text-samps-green-600">Eligible</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Transcript
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Graduation Statistics</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Overview of graduation rates and trends over the years.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              Graduates: {
                label: "Number of Graduates",
                color: "hsl(var(--samps-green-500))",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={graduationStatisticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Graduates" fill="var(--color-Graduates)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
