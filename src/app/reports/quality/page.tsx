import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileText } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function QualityReportsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quality Reports</h1>
      <p className="text-gray-600 text-sm">Generate and view reports on departmental quality assurance.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Available Reports</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <FileText className="h-4 w-4" />
            Generate New Report
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Student Feedback Summary (S1 2024)</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Module Review Outcomes (Annual 2023)</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Audit Findings Report (Last Audit)</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">Quality Improvement Initiatives Progress</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> Download
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Report Generation Options</CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Customize parameters for report generation.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="quality-report-type">Report Type</Label>
            <Select defaultValue="feedback">
              <SelectTrigger id="quality-report-type">
                <SelectValue placeholder="Select a report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feedback">Student Feedback Summary</SelectItem>
                <SelectItem value="module-review">Module Review Outcomes</SelectItem>
                <SelectItem value="audit-findings">Audit Findings Report</SelectItem>
                <SelectItem value="improvements">Quality Improvement Initiatives Progress</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quality-time-period">Time Period</Label>
            <Input id="quality-time-period" type="text" placeholder="e.g., S1 2024, Annual 2023" />
          </div>
          <Button className="bg-samps-blue-600 hover:bg-samps-blue-700 text-white">Generate Report</Button>
        </CardContent>
      </Card>
    </div>
  )
}
