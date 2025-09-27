"use client";

import { useState, useEffect } from "react"
import { WeeklyView } from "@/components/timetable/weekly-view"
import { TimetableHeader } from "@/components/timetable/timetable-header"
import { MonthlyView } from "@/components/timetable/monthly-view" 
import { DayView } from "@/components/timetable/day-view"
import { ModuleDetailsModal } from "@/components/timetable/module-details-modal"
import { useWeeklyTimetable, useDailyTimetable, useMonthlyTimetable } from "@/hooks/timetable/useTimetable"
import { transformTimetableSlotToScheduleData, getDayOfWeekFromDate, type ScheduleData } from "@/types/scheduleTypes"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export type ViewType = "day" | "week" | "month"

function TimetableContent() {
  const [currentView, setCurrentView] = useState<ViewType>("week")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([])
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleData | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Get day name for daily view
  const dayOfWeek = getDayOfWeekFromDate(currentDate.toISOString().split('T')[0])

  // API queries
  const weeklyQuery = useWeeklyTimetable(currentDate, {
    enabled: currentView === "week"
  })
  
  const dailyQuery = useDailyTimetable(dayOfWeek, {
    enabled: currentView === "day"
  })
  
  const monthlyQuery = useMonthlyTimetable(currentDate, {
    enabled: currentView === "month"
  })

  // Update schedule data when queries change
  useEffect(() => {
    let data: ScheduleData[] = []
    
    if (currentView === "week" && weeklyQuery.data?.success) {
      data = weeklyQuery.data.data.map(transformTimetableSlotToScheduleData)
    } else if (currentView === "day" && dailyQuery.data?.success) {
      data = dailyQuery.data.data.map(transformTimetableSlotToScheduleData)
    } else if (currentView === "month" && monthlyQuery.data?.success) {
      data = monthlyQuery.data.data.map(transformTimetableSlotToScheduleData)
    }
    
    setScheduleData(data)
  }, [currentView, weeklyQuery.data, dailyQuery.data, monthlyQuery.data])

  // Refetch daily data when date changes in day view
  useEffect(() => {
    if (currentView === "day" && dailyQuery.refetch) {
      dailyQuery.refetch()
    }
  }, [currentDate, currentView, dailyQuery])

  // Handle schedule click - open modal
  const handleScheduleClick = (schedule: ScheduleData) => {
    setSelectedSchedule(schedule)
    setIsModalOpen(true)
  }

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedSchedule(null)
  }

  // Handle add class
  const handleAddClass = () => {
    console.log("Add class clicked")
    // You can implement add class functionality here
  }

  // Handle view change
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view)
  }

  // Handle date change
  const handleDateChange = (date: Date) => {
    setCurrentDate(date)
  }

  // Get current query based on view
  const getCurrentQuery = () => {
    switch (currentView) {
      case "week":
        return weeklyQuery
      case "day":
        return dailyQuery
      case "month":
        return monthlyQuery
      default:
        return weeklyQuery
    }
  }

  const currentQuery = getCurrentQuery()

  // Loading state
  if (currentQuery.isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading timetable...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (currentQuery.isError) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <AlertDescription>
          Failed to load timetable data. Please try again later.
          {currentQuery.error instanceof Error && (
            <div className="mt-2 text-sm text-muted-foreground">
              {currentQuery.error.message}
            </div>
          )}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <TimetableHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        onAddClass={handleAddClass}
        currentDate={currentDate}
        onDateChange={handleDateChange}
      />

      <div className="min-h-[400px]">
        {currentView === "day" && (
          <DayView
            schedules={scheduleData}
            currentDate={currentDate}
            onScheduleClick={handleScheduleClick}
            onDateChange={handleDateChange}
          />
        )}

        {currentView === "week" && (
          <WeeklyView
            schedules={scheduleData}
            currentDate={currentDate}
            onScheduleClick={handleScheduleClick}
          />
        )}

        {currentView === "month" && (
          <MonthlyView
            schedules={scheduleData}
            currentDate={currentDate}
            onScheduleClick={handleScheduleClick}
          />
        )}
      </div>

      {/* Module Details Modal */}
      <ModuleDetailsModal
        schedule={selectedSchedule}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  )
}

export default function TimetablePage() {
  return (
    <div className="p-2">
      <TimetableContent />
    </div>
  )
}