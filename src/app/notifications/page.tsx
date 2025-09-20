"use client"

import { TableCell } from "@/components/ui/table"

import { TableBody } from "@/components/ui/table"

import { TableHead } from "@/components/ui/table"

import { TableRow } from "@/components/ui/table"

import { TableHeader } from "@/components/ui/table"

import { Table } from "@/components/ui/table"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useActionState } from "react"
import { sendNotification } from "@/actions/notifications"
import { CheckCircle, XCircle } from "lucide-react"

export default function NotificationsPage() {
  const [state, formAction, isPending] = useActionState(sendNotification, null)

  return (
    <div className="grid gap-6">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">Send Notifications</h1>
      <p className="text-gray-600 text-sm">Send important updates and announcements to students or lecturers.</p>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Compose New Notification</CardTitle>
          <CardDescription className="text-sm text-gray-600">Fill in the details to send your message.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient-type">Send To</Label>
              <Select name="recipientType" defaultValue="students" required>
                <SelectTrigger id="recipient-type">
                  <SelectValue placeholder="Select recipient type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="students">All Students</SelectItem>
                  <SelectItem value="lecturers">All Lecturers</SelectItem>
                  <SelectItem value="all">All Users (Students & Lecturers)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" name="subject" placeholder="e.g., Important: Exam Schedule Update" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="Type your notification message here..."
                rows={5}
                required
              />
            </div>
            <Button type="submit" disabled={isPending} className="bg-samps-blue-600 hover:bg-samps-blue-700 text-white">
              {isPending ? "Sending..." : "Send Notification"}
            </Button>
            {state && (
              <div
                className={`mt-4 flex items-center gap-2 ${
                  state.success ? "text-samps-green-600" : "text-samps-red-600"
                }`}
              >
                {state.success ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                <span>{state.message}</span>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">Sent Notifications History</CardTitle>
          <CardDescription className="text-sm text-gray-600">Review previously sent notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="text-gray-700">Subject</TableHead>
                <TableHead className="text-gray-700">Recipient</TableHead>
                <TableHead className="text-gray-700">Date Sent</TableHead>
                <TableHead className="text-right text-gray-700">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Department Meeting Reminder</TableCell>
                <TableCell className="text-gray-700">All Lecturers</TableCell>
                <TableCell className="text-gray-700">2024-07-24</TableCell>
                <TableCell className="text-samps-green-600">Sent</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">New Academic Calendar Available</TableCell>
                <TableCell className="text-gray-700">All Students</TableCell>
                <TableCell className="text-gray-700">2024-07-20</TableCell>
                <TableCell className="text-samps-green-600">Sent</TableCell>
              </TableRow>
              <TableRow className="hover:bg-gray-50">
                <TableCell className="font-medium text-gray-800">Important: Policy Update</TableCell>
                <TableCell className="text-gray-700">All Users</TableCell>
                <TableCell className="text-gray-700">2024-07-15</TableCell>
                <TableCell className="text-samps-green-600">Sent</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
