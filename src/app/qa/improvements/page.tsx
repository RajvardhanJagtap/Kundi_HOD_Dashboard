"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, CheckSquare } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const improvementProgressData = [
  { quarter: "Q1", "Completed Initiatives": 5, "Ongoing Initiatives": 3 },
  { quarter: "Q2", "Completed Initiatives": 7, "Ongoing Initiatives": 2 },
  { quarter: "Q3", "Completed Initiatives": 9, "Ongoing Initiatives": 1 },
]

export default function ImprovementsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quality Improvements</h1>
      <p className="text-gray-600 text-sm">Track and manage initiatives for continuous quality improvement.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Improvement Initiatives</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Add New Initiative
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Initiative</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-gray-700">Due Date</TableHead>
                <TableHead className="text-gray-700">Lead</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Revise Grading Rubrics</TableCell>
                <TableCell className="text-samps-orange-600">In Progress</TableCell>
                <TableCell className="text-gray-700">2024-09-30</TableCell>
                <TableCell className="text-gray-700">Prof. Bob Johnson</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Enhance Student Support Services</TableCell>
                <TableCell className="text-samps-green-600">Completed</TableCell>
                <TableCell className="text-gray-700">2024-06-30</TableCell>
                <TableCell className="text-gray-700">Dr. Alice Smith</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <CheckSquare className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Update Lab Equipment</TableCell>
                <TableCell className="text-samps-orange-600">In Progress</TableCell>
                <TableCell className="text-gray-700">2024-10-15</TableCell>
                <TableCell className="text-gray-700">IT Support</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Edit className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Improvement Progress</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Overview of ongoing and completed quality improvement initiatives.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              "Completed Initiatives": { label: "Completed Initiatives" },
              "Ongoing Initiatives": { label: "Ongoing Initiatives" },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={improvementProgressData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="Completed Initiatives" fill="var(--color-Completed-Initiatives)" />
                <Bar dataKey="Ongoing Initiatives" fill="var(--color-Ongoing-Initiatives)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
