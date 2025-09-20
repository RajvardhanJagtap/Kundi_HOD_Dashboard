"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { FileText, CheckSquare } from "lucide-react"
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const reviewProgressData = [
  { name: "Completed", value: 80, color: "hsl(var(--samps-green-500))" },
  { name: "In Progress", value: 15, color: "hsl(var(--samps-orange-500))" },
  { name: "Pending", value: 5, color: "hsl(var(--samps-red-500))" },
]

export default function ModuleReviewPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Module Review</h1>
      <p className="text-gray-600 text-sm">Conduct and manage reviews of departmental modules.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Modules for Review</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <CheckSquare className="h-4 w-4" />
            Finalize Reviews
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Module Code</TableHead>
                <TableHead className="text-gray-700">Module Title</TableHead>
                <TableHead className="text-gray-700">Last Review Date</TableHead>
                <TableHead className="text-gray-700">Reviewer</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">CSC101</TableCell>
                <TableCell className="text-gray-700">Introduction to Programming</TableCell>
                <TableCell className="text-gray-700">2023-09-01</TableCell>
                <TableCell className="text-gray-700">Dr. Alice Smith</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> Start Review
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">MTH203</TableCell>
                <TableCell className="text-gray-700">Discrete Mathematics</TableCell>
                <TableCell className="text-gray-700">2023-09-01</TableCell>
                <TableCell className="text-gray-700">Prof. Bob Johnson</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> Start Review
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">ENG101</TableCell>
                <TableCell className="text-gray-700">Engineering Fundamentals</TableCell>
                <TableCell className="text-gray-700">2023-08-20</TableCell>
                <TableCell className="text-gray-700">Dr. Jane Doe</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> Start Review
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Review Progress</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Overview of module review completion status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Modules",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={reviewProgressData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {reviewProgressData.map((entry, index) => (
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
