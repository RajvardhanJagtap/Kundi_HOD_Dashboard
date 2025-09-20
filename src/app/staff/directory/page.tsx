"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { PlusCircle, Mail, Phone } from "lucide-react"
import { Pie, PieChart as RechartsPieChart, ResponsiveContainer, Legend, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const staffRolesData = [
  { name: "Professors", value: 5, color: "#026892" },
  { name: "Lecturers", value: 15, color: "#38A06C" },
  { name: "Research Assistants", value: 5, color: "#C2410C" },
  { name: "Admin Staff", value: 3, color: "hsl(var(--samps-red-500))" },
]

export default function StaffDirectoryPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Staff Directory</h1>
      <p className="text-gray-600 text-sm">View and manage contact information for all departmental staff.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Department Staff</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Add New Staff
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Name</TableHead>
                <TableHead className="text-gray-700">Role</TableHead>
                <TableHead className="text-gray-700">Email</TableHead>
                <TableHead className="text-gray-700">Phone</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Dr. Alice Smith</TableCell>
                <TableCell className="text-gray-700">Lecturer</TableCell>
                <TableCell className="text-gray-700">alice.s@example.com</TableCell>
                <TableCell className="text-gray-700">123-456-7890</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Prof. Bob Johnson</TableCell>
                <TableCell className="text-gray-700">Professor</TableCell>
                <TableCell className="text-gray-700">bob.j@example.com</TableCell>
                <TableCell className="text-gray-700">098-765-4321</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Ms. Carol White</TableCell>
                <TableCell className="text-gray-700">Research Assistant</TableCell>
                <TableCell className="text-gray-700">carol.w@example.com</TableCell>
                <TableCell className="text-gray-700">555-123-4567</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <Phone className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Staff Roles Overview</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Distribution of staff across different roles in the department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              value: {
                label: "Number of Staff",
              },
            }}
            className="h-64 w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <Pie
                  data={staffRolesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {staffRolesData.map((entry, index) => (
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
