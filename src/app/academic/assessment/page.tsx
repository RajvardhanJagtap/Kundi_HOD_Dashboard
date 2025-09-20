import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CheckSquare, FileText } from "lucide-react"

export default function AssessmentPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Assessment Management</h1>
      <p className="text-gray-600 text-sm">Oversee and approve assessment activities and grades.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Pending Grade Approvals</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <CheckSquare className="h-4 w-4" />
            Bulk Approve
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Module</TableHead>
                <TableHead className="text-gray-700">Lecturer</TableHead>
                <TableHead className="text-gray-700">Submission Date</TableHead>
                <TableHead className="text-right text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">CSC101 - Intro to Programming</TableCell>
                <TableCell className="text-gray-700">Dr. Alice Smith</TableCell>
                <TableCell className="text-gray-700">2024-07-20</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> Review Grades
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">MTH203 - Discrete Mathematics</TableCell>
                <TableCell className="text-gray-700">Prof. Bob Johnson</TableCell>
                <TableCell className="text-gray-700">2024-07-19</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> Review Grades
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">ENG101 - Engineering Fundamentals</TableCell>
                <TableCell className="text-gray-700">Dr. Jane Doe</TableCell>
                <TableCell className="text-gray-700">2024-07-18</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
                    <FileText className="h-4 w-4" /> Review Grades
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Assessment Calendar</CardTitle>
          <CardDescription className="text-sm text-gray-600">Key dates for assessments and grading.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full rounded-md bg-gray-100 flex items-center justify-center text-base text-gray-500">
            {/* This could be an actual interactive calendar component */}
            <p>Assessment Calendar Placeholder (e.g., a simplified calendar view)</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
