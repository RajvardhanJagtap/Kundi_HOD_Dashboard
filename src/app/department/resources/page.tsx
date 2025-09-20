"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download, Trash2 } from "lucide-react"
import { Bar, BarChart as RechartsBarChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Legend } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const resourceUsageData = [
  { resource: "Labs", usage: 90 },
  { resource: "Library", usage: 75 },
  { resource: "Software", usage: 85 },
  { resource: "Equipment", usage: 60 },
]

export default function ResourcesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Department Resources</h1>
      <p className="text-gray-600 text-sm">Manage and access shared departmental resources.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Resource Library</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Upload Resource
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-800 font-semibold">File Name</TableHead>
                <TableHead className="text-gray-800 font-semibold">Type</TableHead>
                <TableHead className="text-gray-800 font-semibold">Uploaded By</TableHead>
                <TableHead className="text-gray-800 font-semibold">Date</TableHead>
                <TableHead className="text-right text-gray-800 font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Department Budget 2024.xlsx</TableCell>
                <TableCell className="text-gray-700">Spreadsheet</TableCell>
                <TableCell className="text-gray-700">Admin</TableCell>
                <TableCell className="text-gray-700">2024-07-15</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-samps-red-600 hover:bg-samps-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Faculty Meeting Agenda.pdf</TableCell>
                <TableCell className="text-gray-700">PDF Document</TableCell>
                <TableCell className="text-gray-700">Dr. Emily White</TableCell>
                <TableCell className="text-gray-700">2024-07-20</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-samps-red-600 hover:bg-samps-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Lab Equipment Manuals.zip</TableCell>
                <TableCell className="text-gray-700">Archive</TableCell>
                <TableCell className="text-gray-700">IT Support</TableCell>
                <TableCell className="text-gray-700">2024-07-10</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-samps-red-600 hover:bg-samps-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Resource Usage Analytics</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Insights into how departmental resources are being utilized (in percentage).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              usage: {
                label: "Usage (%)",
                color: "#026892",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={resourceUsageData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="resource" />
                <YAxis domain={[0, 100]} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="usage" fill="var(--color-usage)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
