import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, FileText, Download } from "lucide-react"

export default function PoliciesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Department Policies</h1>
      <p className="text-gray-600 text-sm">Access and manage all official departmental policies and guidelines.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Policy Documents</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Upload Policy
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">Academic Integrity Policy.pdf</span>
            </div>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">Staff Leave Policy.pdf</span>
            </div>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">Student Grievance Procedure.pdf</span>
            </div>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-gray-600" />
              <span className="font-medium text-gray-800">Research Ethics Guidelines.pdf</span>
            </div>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Policy Updates</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Recent changes and announcements regarding departmental policies.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-2">
          <p className="text-sm text-gray-800">
            <span className="font-medium">2024-07-10:</span> New Data Privacy Policy released. All staff and students
            are required to review.
          </p>
          <p className="text-sm text-gray-800">
            <span className="font-medium">2024-06-25:</span> Revision to Grading Policy for undergraduate modules.
            Effective from next semester.
          </p>
          <p className="text-sm text-gray-800">
            <span className="font-medium">2024-05-15:</span> Updated Remote Work Policy for administrative staff.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
