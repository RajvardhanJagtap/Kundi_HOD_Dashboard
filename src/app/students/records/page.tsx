"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText } from "lucide-react"
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const studentDemographicsData = [
  { name: "B.Sc. Computer Science", value: 700, color: "#026892" },
  { name: "M.Sc. Data Science", value: 300, color: "#38A06C" },
  { name: "Ph.D. AI", value: 200, color: "#C2410C" },
]

export default function StudentRecordsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Student Records</h1>
      <p className="text-gray-600 text-sm">Access and manage academic records for all departmental students.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Student List</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Add New Student
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Student ID</TableHead>
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="text-gray-700">Program</TableHead>
                <TableHead className="text-gray-700">Enrollment Year</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU001</TableCell>
                <TableCell className="text-gray-700">Alice Brown</TableCell>
                <TableCell className="text-gray-700">B.Sc. Computer Science</TableCell>
                <TableCell className="text-gray-700">2022</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Record
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU002</TableCell>
                <TableCell className="text-gray-700">Bob White</TableCell>
                <TableCell className="text-gray-700">M.Sc. Data Science</TableCell>
                <TableCell className="text-gray-700">2023</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Record
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">STU003</TableCell>
                <TableCell className="text-gray-700">Charlie Green</TableCell>
                <TableCell className="text-gray-700">B.Sc. Computer Science</TableCell>
                <TableCell className="text-gray-700">2022</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> View Record
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Student Demographics</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Breakdown of student population by program.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Number of Students",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={studentDemographicsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {studentDemographicsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend />
              </RechartsPieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
