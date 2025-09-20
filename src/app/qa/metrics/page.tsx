"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TrendingUp } from "lucide-react"
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

const qualityTrendData = [
  { quarter: "Q1", "Student Satisfaction": 4.0, "Research Output": 10 },
  { quarter: "Q2", "Student Satisfaction": 4.2, "Research Output": 12 },
  { quarter: "Q3", "Student Satisfaction": 4.1, "Research Output": 15 },
  { quarter: "Q4", "Student Satisfaction": 4.3, "Research Output": 18 },
]

export default function QAMetricsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quality Assurance Metrics</h1>
      <p className="text-gray-600 text-sm">Monitor key quality metrics for the department.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Departmental Quality Scores</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <TrendingUp className="h-4 w-4" />
            View Trends
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Metric</TableHead>
                <TableHead className="text-gray-700">Current Score</TableHead>
                <TableHead className="text-gray-700">Target</TableHead>
                <TableHead className="text-right text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Student Satisfaction</TableCell>
                <TableCell className="text-gray-700">4.2/5</TableCell>
                <TableCell className="text-gray-700">4.0/5</TableCell>
                <TableCell className="text-samps-green-600">Met</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Research Output</TableCell>
                <TableCell className="text-gray-700">15 papers</TableCell>
                <TableCell className="text-gray-700">20 papers</TableCell>
                <TableCell className="text-samps-orange-600">Below Target</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Module Completion Rate</TableCell>
                <TableCell className="text-gray-700">95%</TableCell>
                <TableCell className="text-gray-700">90%</TableCell>
                <TableCell className="text-samps-green-600">Met</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Quality Trend Analysis</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Visual representation of key quality metrics over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              "Student Satisfaction": {
                label: "Student Satisfaction (Scale of 5)",
                color: "#026892",
              },
              "Research Output": {
                label: "Research Output (Papers)",
                color: "#026892",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={qualityTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="quarter" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Line type="monotone" dataKey="Student Satisfaction" stroke="var(--color-Student-Satisfaction)" />
                <Line type="monotone" dataKey="Research Output" stroke="var(--color-Research-Output)" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
