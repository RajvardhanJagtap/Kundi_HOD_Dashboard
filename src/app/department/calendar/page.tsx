"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  PlusCircle,
  CalendarIcon,
  Clock,
  MapPin,
  Users,
  Bell,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  isSameMonth,
} from "date-fns"

interface Event {
  id: string
  title: string
  date: string
  time: string
  endTime?: string
  location: string
  type: "meeting" | "deadline" | "academic" | "social" | "maintenance" | "other"
  priority: "high" | "medium" | "low"
  attendees?: string[]
  description?: string
  status: "scheduled" | "completed" | "cancelled"
}

const eventTypes = {
  meeting: { color: "bg-blue-500", label: "Meeting", textColor: "text-blue-700" },
  deadline: { color: "bg-red-500", label: "Deadline", textColor: "text-red-700" },
  academic: { color: "bg-green-500", label: "Academic", textColor: "text-green-700" },
  social: { color: "bg-purple-500", label: "Social", textColor: "text-purple-700" },
  maintenance: { color: "bg-orange-500", label: "Maintenance", textColor: "text-orange-700" },
  other: { color: "bg-gray-500", label: "Other", textColor: "text-gray-700" },
}

export default function DepartmentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [filterType, setFilterType] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")

  const [events, setEvents] = useState<Event[]>([
    {
      id: "1",
      title: "Faculty Retreat",
      date: "2024-08-15",
      time: "09:00 AM",
      endTime: "05:00 PM",
      location: "University Hall",
      type: "academic",
      priority: "high",
      attendees: ["Dr. Smith", "Prof. Johnson", "Dr. Williams"],
      description: "Annual faculty retreat for strategic planning and team building.",
      status: "scheduled",
    },
    {
      id: "2",
      title: "Module Review Committee Meeting",
      date: "2024-08-20",
      time: "10:00 AM",
      endTime: "12:00 PM",
      location: "Dept. Meeting Room",
      type: "meeting",
      priority: "high",
      attendees: ["HOD", "Module Coordinators"],
      description: "Review of current modules and planning for next semester.",
      status: "scheduled",
    },
    {
      id: "3",
      title: "New Student Orientation",
      date: "2024-09-01",
      time: "09:00 AM",
      endTime: "01:00 PM",
      location: "Main Auditorium",
      type: "academic",
      priority: "medium",
      attendees: ["All Faculty", "Student Services"],
      description: "Welcome and orientation program for new students.",
      status: "scheduled",
    },
    {
      id: "4",
      title: "Research Grant Application Deadline",
      date: "2024-09-10",
      time: "05:00 PM",
      location: "Online",
      type: "deadline",
      priority: "high",
      description: "Final deadline for research grant applications.",
      status: "scheduled",
    },
    {
      id: "5",
      title: "Department Social Event",
      date: "2024-08-25",
      time: "06:00 PM",
      endTime: "09:00 PM",
      location: "Faculty Lounge",
      type: "social",
      priority: "low",
      attendees: ["All Department Staff"],
      description: "Monthly department social gathering.",
      status: "scheduled",
    },
    {
      id: "6",
      title: "IT System Maintenance",
      date: "2024-08-30",
      time: "02:00 AM",
      endTime: "06:00 AM",
      location: "Server Room",
      type: "maintenance",
      priority: "medium",
      description: "Scheduled maintenance of department IT systems.",
      status: "scheduled",
    },
  ])

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      const matchesDate = isSameDay(eventDate, date)
      const matchesFilter = filterType === "all" || event.type === filterType
      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesDate && matchesFilter && matchesSearch
    })
  }

  const getAllFilteredEvents = () => {
    return events
      .filter((event) => {
        const matchesFilter = filterType === "all" || event.type === filterType
        const matchesSearch =
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase())

        return matchesFilter && matchesSearch
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => (direction === "next" ? addMonths(prev, 1) : subMonths(prev, 1)))
  }

  const renderCalendarGrid = () => {
    const monthStart = startOfMonth(currentDate)
    const monthEnd = endOfMonth(currentDate)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

    return (
      <div className="grid grid-cols-7 gap-1 p-4">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="p-2 text-center font-semibold text-samps-blue-700 border-b">
            {day}
          </div>
        ))}
        {days.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] p-1 border border-gray-200 cursor-pointer transition-colors hover:bg-gray-50 ${
                isSelected ? "bg-samps-blue-50 border-samps-blue-300" : ""
              } ${isCurrentDay ? "ring-2 ring-samps-blue-400" : ""}`}
              onClick={() => setSelectedDate(day)}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isCurrentDay
                    ? "text-samps-blue-600 font-bold"
                    : isSameMonth(day, currentDate)
                      ? "text-gray-900"
                      : "text-gray-400"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div
                    key={event.id}
                    className={`text-xs p-1 rounded truncate cursor-pointer ${eventTypes[event.type].color} text-white hover:opacity-80`}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedEvent(event)
                    }}
                  >
                    {event.title}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-gray-500 font-medium">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex-1 p-1 md:p-2 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">Department Calendar</h1>
          <p className="text-gray-600 mt-1">Manage and view all department events and deadlines</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog open={showAddEvent} onOpenChange={setShowAddEvent}>
            <DialogTrigger asChild>
              <Button className="bg-samps-blue-600 hover:bg-[#026892]/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Event
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Event</DialogTitle>
                <DialogDescription>Create a new department event or deadline.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input id="title" placeholder="Enter event title" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="date">Date</Label>
                    <Input id="date" type="date" />
                  </div>
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input id="time" type="time" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="Event location" />
                </div>
                <div>
                  <Label htmlFor="type">Event Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(eventTypes).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Event description" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowAddEvent(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-samps-blue-600 hover:bg-samps-blue-700">Create Event</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick Stats - Moved to top as requested */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#026892] from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <CalendarIcon className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">This Month</p>
                <p className="text-2xl font-bold">
                  {events.filter((e) => isSameMonth(new Date(e.date), currentDate)).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">High Priority</p>
                <p className="text-2xl font-bold">{events.filter((e) => e.priority === "high").length}</p>
              </div>
              <Bell className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Meetings</p>
                <p className="text-2xl font-bold">{events.filter((e) => e.type === "meeting").length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white shadow-sm">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  {Object.entries(eventTypes).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2 flex-1">
              <Search className="h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={viewMode === "month" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("month")}
                className={viewMode === "month" ? "bg-samps-blue-600 hover:bg-[#026892]/90" : ""}
              >
                Month
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("week")}
                className={viewMode === "week" ? "bg-samps-blue-600 hover:bg-[#026892]/90" : ""}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "day" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("day")}
                className={viewMode === "day" ? "bg-samps-blue-600 hover:bg-[#026892]/90" : ""}
              >
                Day
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar View */}
        <Card className="lg:col-span-2 bg-white shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-gray-700 mb-2">{format(currentDate, "MMMM yyyy")}</CardTitle>
                <CardDescription>Click on dates to view events</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                  Today
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">{renderCalendarGrid()}</CardContent>
        </Card>

        {/* Event Details Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Events */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-2">
                {selectedDate ? format(selectedDate, "EEEE, MMMM d") : "Select a Date"}
              </CardTitle>
              <CardDescription>
                {selectedDate
                  ? `${getEventsForDate(selectedDate).length} events scheduled`
                  : "Click on a date to view events"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDate && getEventsForDate(selectedDate).length > 0 ? (
                <div className="space-y-3">
                  {getEventsForDate(selectedDate).map((event) => (
                    <div
                      key={event.id}
                      className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-samps-blue-700">{event.title}</h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Clock className="h-3 w-3" />
                            {event.time} {event.endTime && `- ${event.endTime}`}
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {event.location}
                          </div>
                        </div>
                        <Badge className={`${eventTypes[event.type].color} text-white`}>
                          {eventTypes[event.type].label}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : selectedDate ? (
                <p className="text-sm text-gray-600 text-center py-4">No events scheduled for this date.</p>
              ) : (
                <p className="text-sm text-gray-600 text-center py-4">Select a date to view events.</p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700 mb-2">Upcoming Events</CardTitle>
              <CardDescription>Next 5 upcoming events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {getAllFilteredEvents()
                  .slice(0, 5)
                  .map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <div className={`w-3 h-3 rounded-full ${eventTypes[event.type].color}`}></div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{event.title}</p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(event.date), "MMM d")} • {event.time}
                        </p>
                      </div>
                      {event.priority === "high" && <Bell className="h-3 w-3 text-red-500" />}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Event Type Legend */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-gray-700">Event Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(eventTypes).map(([key, value]) => (
                  <div key={key} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${value.color}`}></div>
                    <span className="text-sm">{value.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription>Event Details</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={`${eventTypes[selectedEvent.type].color} text-white`}>
                  {eventTypes[selectedEvent.type].label}
                </Badge>
                <Badge
                  variant={
                    selectedEvent.priority === "high"
                      ? "destructive"
                      : selectedEvent.priority === "medium"
                        ? "default"
                        : "secondary"
                  }
                >
                  {selectedEvent.priority} priority
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date</Label>
                  <p className="text-sm">{format(new Date(selectedEvent.date), "EEEE, MMMM d, yyyy")}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Time</Label>
                  <p className="text-sm">
                    {selectedEvent.time} {selectedEvent.endTime && `- ${selectedEvent.endTime}`}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <p className="text-sm flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {selectedEvent.location}
                </p>
              </div>

              {selectedEvent.attendees && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Attendees</Label>
                  <p className="text-sm flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {selectedEvent.attendees.join(", ")}
                  </p>
                </div>
              )}

              {selectedEvent.description && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-600">{selectedEvent.description}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Close
                </Button>
                <Button className="bg-samps-blue-600 hover:bg-hover:bg-[#026892]/90">Edit Event</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
