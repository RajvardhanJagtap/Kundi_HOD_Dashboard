"use client"

import { Card } from "@/components/ui/card"
import { MapPin } from "lucide-react"
import type { ScheduleData } from "@/types/scheduleTypes"

interface WeeklyViewProps {
  schedules: ScheduleData[]
  currentDate: Date
  onScheduleClick: (schedule: ScheduleData) => void
}

const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"]

const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]

export function WeeklyView({ schedules, currentDate, onScheduleClick }: WeeklyViewProps) {
  const getWeekDates = (date: Date) => {
    // Get the start of the week based on the header's week calculation
    // The header shows "Sep 28 - Oct 4, 2025" which suggests Sunday start
    const startOfWeek = new Date(date)
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    startOfWeek.setDate(date.getDate() - dayOfWeek)

    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek)
      day.setDate(startOfWeek.getDate() + i)
      // Return date string to avoid timezone issues
      const year = day.getFullYear()
      const month = String(day.getMonth() + 1).padStart(2, '0')
      const dayNum = String(day.getDate()).padStart(2, '0')
      return {
        dateStr: `${year}-${month}-${dayNum}`,
        displayDate: day
      }
    })
  }

  const weekDates = getWeekDates(currentDate)

  // Filter schedules to only include those within the current week date range
  const weekSchedules = schedules.filter(schedule => {
    const weekDateStrings = weekDates.map(d => d.dateStr)
    return weekDateStrings.includes(schedule.date)
  })

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

  const getSchedulesForDateAndTime = (dateStr: string, timeSlot: string) => {
    return weekSchedules.filter((schedule) => {
      const scheduleDate = schedule.date
      const scheduleStartTime = schedule.startTime
      const scheduleEndTime = schedule.endTime

      if (scheduleDate !== dateStr) return false

      const slotTime = Number.parseInt(timeSlot.split(":")[0])
      const startTime = Number.parseInt(scheduleStartTime.split(":")[0])
      const endTime = Number.parseInt(scheduleEndTime.split(":")[0])

      return slotTime >= startTime && slotTime < endTime
    })
  }

  return (
    <div className="bg-card rounded-sm border">
      {/* Header with days */}
      <div className="grid grid-cols-8 border-b">
        <div className="p-4 text-sm font-medium text-muted-foreground">TIME</div>
        {weekDays.map((day, index) => (
          <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground border-l">
            <div className="font-semibold">{day}</div>
            <div className="text-xs mt-1">
              {weekDates[index]?.displayDate.toLocaleDateString("en-US", { 
                month: "short", 
                day: "numeric"
              })}
            </div>
          </div>
        ))}
      </div>
  
      {/* Time slots and classes */}
      {timeSlots.map((timeSlot, timeIndex) => (
        <div key={timeSlot} className="grid grid-cols-8 border-b last:border-b-0 min-h-[80px]">
          <div className="p-4 text-sm font-medium text-muted-foreground border-r">{timeSlot}</div>
          {weekDates.map((dateObj, dayIndex) => {
            const daySchedules = getSchedulesForDateAndTime(dateObj.dateStr, timeSlot)
            return (
              <div key={dayIndex} className="p-2 border-l relative">
                {daySchedules.map((schedule) => (
                  <Card
                    key={schedule.id}
                    className="p-3 mb-2 border cursor-pointer rounded-sm hover:shadow-md transition-shadow"
                    onClick={() => onScheduleClick(schedule)}
                    style={{
                      backgroundColor: colorMap[schedule.color]?.bg || '#ffffff',
                      borderColor: colorMap[schedule.color]?.border || '#e5e7eb',
                    }}
                  >
                    <div className="space-y-1">
                      <h4 className="font-semibold text-sm leading-tight truncate whitespace-nowrap">
                        {schedule.moduleCode ? `${schedule.moduleCode} - ` : ''}{schedule.moduleName}
                      </h4>
                      <div className="flex items-center gap-1 text-xs opacity-90 truncate whitespace-nowrap">
                        <MapPin className="h-3 w-3" />
                        <span>{schedule.venue || 'TBA'}</span>
                      </div>
                      <div className="text-xs opacity-90 truncate whitespace-nowrap">
                        {schedule.startTime} - {schedule.endTime} • {schedule.instructorName || 'TBA'}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )
          })}
        </div>
      ))}
  </div>
)}