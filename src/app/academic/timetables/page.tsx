import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Download } from "lucide-react"

export default function TimetablesPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Timetables</h1>
      <p className="text-gray-600 text-sm">Manage and view departmental and module timetables.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">Department Timetable</CardTitle>
          <Button size="sm" className="gap-1 bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
            <PlusCircle className="h-4 w-4" />
            Generate Timetable
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full rounded-md bg-gray-100 flex items-center justify-center text-base text-gray-500">
            {/* This could be a visual timetable grid */}
            <p>Department Timetable View Placeholder (e.g., a grid showing classes per day/time)</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Module Timetables</CardTitle>
          <CardDescription className="text-sm text-gray-600">Individual timetables for each module.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">CSC101 - Intro to Programming</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> View
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">MTH203 - Discrete Mathematics</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> View
            </Button>
          </div>
          <div className="flex items-center justify-between border-b pb-2">
            <span className="font-medium text-gray-800">ENG101 - Engineering Fundamentals</span>
            <Button variant="ghost" size="sm" className="text-samps-blue-600 hover:bg-samps-blue-50">
              <Download className="h-4 w-4" /> View
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
