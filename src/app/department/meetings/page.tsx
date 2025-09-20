import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileText } from "lucide-react";

export default function MeetingsPage() {
  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">
        Department Meetings
      </h1>
      <p className="text-gray-600 text-sm">
        Manage and review records of all departmental meetings.
      </p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Meeting Records
          </CardTitle>
          <Button
            size="sm"
            className="gap-1 bg-samps-blue-600 hover:bg-[#026892]/90 text-white"
          >
            <PlusCircle className="h-4 w-4" />
            Add Meeting
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-800 font-semibold">
                  Meeting Title
                </TableHead>
                <TableHead className="text-gray-800 font-semibold">
                  Date
                </TableHead>
                <TableHead className="text-gray-800 font-semibold">
                  Attendees
                </TableHead>
                <TableHead className="text-right text-gray-800 font-semibold">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">
                  Monthly Faculty Review
                </TableCell>
                <TableCell className="text-gray-700">2024-07-20</TableCell>
                <TableCell className="text-gray-700">All Faculty</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-samps-blue-600 hover:bg-samps-blue-50"
                  >
                    <FileText className="h-4 w-4" /> Minutes
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">
                  Curriculum Development Session
                </TableCell>
                <TableCell className="text-gray-700">2024-07-15</TableCell>
                <TableCell className="text-gray-700">
                  Curriculum Committee
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-samps-blue-600 hover:bg-samps-blue-50"
                  >
                    <FileText className="h-4 w-4" /> Minutes
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">
                  Student Feedback Analysis Meeting
                </TableCell>
                <TableCell className="text-gray-700">2024-07-10</TableCell>
                <TableCell className="text-gray-700">
                  QA Team, Student Reps
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-samps-blue-600 hover:bg-samps-blue-50"
                  >
                    <FileText className="h-4 w-4" /> Minutes
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Meeting Schedule
          </CardTitle>
          <CardDescription className="text-sm text-gray-600">
            Upcoming meetings for the department.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 w-full rounded-md bg-gray-100 flex items-center justify-center text-base text-gray-500">
            {/* This could be an actual interactive calendar component */}
            <p>
              Meeting Schedule Calendar Placeholder (e.g., a simplified calendar
              view)
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
