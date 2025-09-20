import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CustomReportsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Custom Reports</h1>
      <p className="text-gray-600 text-sm">Create and manage custom reports based on specific data needs.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">My Custom Reports</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Create New Custom Report
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Module Enrollment by Year (2020-2024)</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <FileText className="h-4 w-4" /> View Report
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Staff Publication Count by Research Area</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <FileText className="h-4 w-4" /> View Report
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Student GPA Distribution by Program</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <FileText className="h-4 w-4" /> View Report
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Custom Report Builder</CardTitle>
          <CardDescription className="text-sm text-gray-600">Define parameters for your custom report.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="report-name">Report Name</Label>
            <Input id="report-name" placeholder="e.g., Student Enrollment Trends" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="data-source">Data Source</Label>
            <Select defaultValue="students">
              <SelectTrigger id="data-source">
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="staff">Staff</SelectItem>
                <SelectItem value="modules">Modules</SelectItem>
                <SelectItem value="qa">Quality Assurance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="filters">Filters (e.g., Program, Year, Status)</Label>
            <Input id="filters" placeholder="e.g., Program: 'CS', Year: '2023'" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fields">Fields to Include (comma-separated)</Label>
            <Textarea id="fields" placeholder="e.g., Student ID, Name, GPA, Program" />
          </div>
          <Button className="bg-samps-blue-600 hover:bg-samps-blue-700 text-white">Generate Custom Report</Button>
        </CardContent>
      </Card>
    </div>
  )
}
