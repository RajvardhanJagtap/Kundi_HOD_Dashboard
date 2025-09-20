"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MessageSquare, CheckSquare } from "lucide-react"
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const feedbackCategoriesData = [
  { name: "Course Content", value: 40 },
  { name: "Lecturer Performance", value: 30 },
  { name: "Resource Availability", value: 20 },
  { name: "Administrative Support", value: 10 },
]
const PIE_COLORS = ["#026892", "#38A06C", "#C2410C"]

export default function FeedbackPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Feedback Management</h1>
      <p className="text-gray-600 text-sm">Collect, review, and act on feedback from students and staff.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Recent Feedback</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <CheckSquare className="h-4 w-4" />
            Mark as Reviewed
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Source</TableHead>
                <TableHead className="text-gray-700">Topic</TableHead>
                <TableHead className="text-gray-700">Date</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Student (STU001)</TableCell>
                <TableCell className="text-gray-700">Course Content (CSC101)</TableCell>
                <TableCell className="text-gray-700">2024-07-23</TableCell>
                <TableCell className="text-samps-orange-600">New</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <MessageSquare className="h-4 w-4" /> View Feedback
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Lecturer (Dr. Smith)</TableCell>
                <TableCell className="text-gray-700">Resource Availability</TableCell>
                <TableCell className="text-gray-700">2024-07-21</TableCell>
                <TableCell className="text-samps-green-600">Reviewed</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <MessageSquare className="h-4 w-4" /> View Feedback
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Student (STU003)</TableCell>
                <TableCell className="text-gray-700">Assessment Fairness (MTH203)</TableCell>
                <TableCell className="text-gray-700">2024-07-20</TableCell>
                <TableCell className="text-samps-orange-600">New</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <MessageSquare className="h-4 w-4" /> View Feedback
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Feedback Categories</CardTitle>
          <CardDescription className="text-sm text-gray-600">Breakdown of feedback by category.</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Feedback Count",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={feedbackCategoriesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#026892"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {feedbackCategoriesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
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
