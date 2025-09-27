"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ScheduleData } from "@/types/scheduleTypes"

interface MonthlyViewProps {
  schedules: ScheduleData[]
  currentDate: Date
  onScheduleClick: (schedule: ScheduleData) => void
}

export function MonthlyView({ schedules, currentDate, onScheduleClick }: MonthlyViewProps) {
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month - using a consistent date format
    for (let day = 1; day <= daysInMonth; day++) {
      // Create date string in YYYY-MM-DD format to avoid timezone issues
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
      days.push(dateStr)
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
  
  // Filter schedules to only include those within the current month
  const monthSchedules = schedules.filter(schedule => {
    const scheduleDate = new Date(schedule.date + 'T00:00:00') // Add time to avoid timezone issues
    const currentMonth = currentDate.getMonth()
    const currentYear = currentDate.getFullYear()
    
    return scheduleDate.getMonth() === currentMonth && scheduleDate.getFullYear() === currentYear
  })

  const getSchedulesForDate = (dateStr: string | null) => {
    if (!dateStr) return []
    return monthSchedules.filter((schedule) => schedule.date === dateStr)
  }

  // Helper function to get day number from date string
  const getDayFromDateStr = (dateStr: string) => {
    return parseInt(dateStr.split('-')[2])
  }

  // Helper function to check if date string is today
  const isToday = (dateStr: string) => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return dateStr === todayStr
  }

  const colorMap: Record<string, { bg: string; border?: string }> = {
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

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="bg-card rounded-sm border">
      {/* Header with day names */}
      <div className="grid grid-cols-7 border-b">
        {weekDays.map((day) => (
          <div key={day} className="p-4 text-center text-sm font-medium text-muted-foreground border-r last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {days.map((dateStr, index) => {
          const daySchedules = getSchedulesForDate(dateStr)
          const isTodayDate = dateStr && isToday(dateStr)

          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 border-r border-b last:border-r-0 ${!dateStr ? "bg-muted/30" : ""}`}
            >
              {dateStr && (
                <>
                  <div className={`text-sm font-medium mb-2 ${isTodayDate ? "text-accent font-bold" : "text-foreground"}`}>
                    {getDayFromDateStr(dateStr)}
                  </div>
                  <div className="space-y-1">
                    {daySchedules.slice(0, 3).map((schedule) => (
                      <Card
                        key={schedule.id}
                        className={`p-2 border cursor-pointer rounded-sm`}
                        onClick={() => onScheduleClick(schedule)}
                        style={{ 
                          backgroundColor: colorMap[schedule.color]?.bg || '#ffffff',
                          borderColor: '#e5e7eb' 
                        }}
                      >
                        <div className="text-xs font-medium truncate whitespace-nowrap">
                          {schedule.moduleCode ? `${schedule.moduleCode} - ` : ''}{schedule.moduleName}
                        </div>
                        <div className="text-xs opacity-90 truncate whitespace-nowrap">{schedule.venue || 'TBA'}</div>
                        <div className="text-xs opacity-90 truncate whitespace-nowrap">
                          {schedule.startTime} - {schedule.endTime} • {schedule.instructorName || 'TBA'}
                        </div>
                      </Card>
                    ))}
                    {daySchedules.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{daySchedules.length - 3} more
                      </Badge>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}