"use client"

import type { ScheduleData } from "@/types/scheduleTypes"

interface DayViewProps {
  schedules: ScheduleData[]
  currentDate: Date
  onScheduleClick: (schedule: ScheduleData) => void
  onDateChange?: (date: Date) => void
}

export function DayView({ schedules, currentDate, onScheduleClick, onDateChange }: DayViewProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { 
      weekday: 'long', 
      month: 'long', 
      day: 'numeric'
    })
  }

  const navigateDate = (direction: "prev" | "next") => {
    if (onDateChange) {
      const newDate = new Date(currentDate)
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
      onDateChange(newDate)
    }
  }

  const getDaySchedules = () => {
    const dateStr = currentDate.toISOString().split("T")[0]
    return schedules
      .filter(schedule => schedule.date === dateStr)
      .sort((a, b) => a.startTime.localeCompare(b.startTime))
  }

  const formatTime = (time: string) => {
    // Convert 24-hour format to 12-hour format if needed
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const daySchedules = getDaySchedules()

  const colorMap: Record<string, { bg: string; border: string }> = {
    "bg-blue-500": { bg: "#dff6ff", border: "#0284c7" },
    "bg-blue-300": { bg: "#e6f7ff", border: "#0284c7" },
    "bg-green-500": { bg: "#e6f9e6", border: "#15803d" },
    "bg-green-300": { bg: "#efffe9", border: "#15803d" },
    "bg-purple-300": { bg: "#f3e8ff", border: "#7c3aed" },
    "bg-orange-300": { bg: "#fff3e0", border: "#ea580c" },
    "bg-red-300": { bg: "#ffe7e7", border: "#dc2626" },
    "bg-teal-300": { bg: "#e6f7f6", border: "#0d9488" },
    "bg-pink-300": { bg: "#ffe6f0", border: "#be185d" },
    "bg-indigo-300": { bg: "#eef2ff", border: "#3730a3" },
    "bg-yellow-300": { bg: "#fff7cc", border: "#d97706" },
    "bg-yellow-400": { bg: "#fff9db", border: "#b45309" },
  }

  return (
    <div>
      {/* Main Content */}
      <div>
        {daySchedules.length === 0 ? (
          <div className="text-center py-2">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No classes scheduled</h3>
            <p className="text-gray-500">You have no classes scheduled for this day.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Schedule Cards */}
            {daySchedules.map((schedule, index) => (
              <div
                key={schedule.id}
                onClick={() => onScheduleClick(schedule)}
                className="rounded-sm border p-4 hover:shadow-sm cursor-pointer transition-all duration-150"
                style={{
                  backgroundColor: colorMap[schedule.color]?.bg || "",
                }}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-start">
                    <h2 className="text-lg font-bold text-foreground">
                      {schedule.moduleCode ? `${schedule.moduleCode} - ` : ""}{schedule.moduleName}
                    </h2>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <div className="font-medium">{formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</div>
                    <div className="mt-1">{schedule.venue}</div>
                    <div className="mt-1">{schedule.instructorName || "TBA"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}