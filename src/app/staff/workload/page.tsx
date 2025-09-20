"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const workloadAnalyticsData = [
  { name: "Dr. Smith", teaching: 12, admin: 8 },
  { name: "Prof. Johnson", teaching: 18, admin: 10 },
  { name: "Dr. Lee", teaching: 15, admin: 7 },
  { name: "Ms. White", teaching: 10, admin: 12 },
]

export default function WorkloadPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Staff Workload</h1>
      <p className="text-gray-600 text-sm">Monitor and manage the teaching and administrative workload of staff.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Current Workload Distribution</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <Edit className="h-4 w-4" />
            Adjust Workload
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Staff Name</TableHead>
                <TableHead className="text-gray-700">Teaching Hours (per week)</TableHead>
                <TableHead className="text-gray-700">Admin Load (FTE)</TableHead>
                <TableHead className="text-gray-700">Total Load (FTE)</TableHead>
                <TableHead className="text-right text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Dr. Alice Smith</TableCell>
                <TableCell className="text-gray-700">12 hrs</TableCell>
                <TableCell className="text-gray-700">0.5 FTE</TableCell>
                <TableCell className="text-gray-700">1.0 FTE</TableCell>
                <TableCell className="text-right text-samps-green-600">Optimal</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Prof. Bob Johnson</TableCell>
                <TableCell className="text-gray-700">18 hrs</TableCell>
                <TableCell className="text-gray-700">0.7 FTE</TableCell>
                <TableCell className="text-gray-700">1.3 FTE</TableCell>
                <TableCell className="text-right text-samps-red-600">Overloaded</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Dr. Sarah Lee</TableCell>
                <TableCell className="text-gray-700">15 hrs</TableCell>
                <TableCell className="text-gray-700">0.6 FTE</TableCell>
                <TableCell className="text-gray-700">1.1 FTE</TableCell>
                <TableCell className="text-right text-samps-orange-600">High</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Workload Analytics</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Visual representation of teaching and administrative workload distribution.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              teaching: {
                label: "Teaching Hours",
                color: "#026892",
              },
              admin: {
                label: "Admin Load",
                color: "#38A06C",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={workloadAnalyticsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="teaching" fill="var(--color-teaching)" />
                <Bar dataKey="admin" fill="var(--color-admin)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
