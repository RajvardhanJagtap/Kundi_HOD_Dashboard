"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

// Update your ViewType to include 'day'
export type ViewType = "day" | "week" | "month"

interface TimetableHeaderProps {
  currentView: ViewType
  onViewChange: (view: ViewType) => void
  onAddClass: () => void
  currentDate: Date
  onDateChange: (date: Date) => void
}

export function TimetableHeader({
  currentView,
  onViewChange,
  onAddClass,
  currentDate,
  onDateChange,
}: TimetableHeaderProps) {
  const formatDate = (date: Date) => {
    if (currentView === "day") {
      return date.toLocaleDateString("en-US", {
        weekday: 'long',
        month: "long",
        day: "numeric",
        year: "numeric"
      })
    } else if (currentView === "week") {
      const startOfWeek = new Date(date)
      startOfWeek.setDate(date.getDate() - date.getDay())
      const endOfWeek = new Date(startOfWeek)
      endOfWeek.setDate(startOfWeek.getDate() + 6)

      return `${startOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${endOfWeek.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`
    } else {
      return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
  }

  const navigateDate = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate)
    if (currentView === "day") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 1 : -1))
    } else if (currentView === "week") {
      newDate.setDate(currentDate.getDate() + (direction === "next" ? 7 : -7))
    } else {
      newDate.setMonth(currentDate.getMonth() + (direction === "next" ? 1 : -1))
    }
    onDateChange(newDate)
  }

  const getButtonClass = (view: ViewType) => {
    return `text-sm transition-all duration-200 ${currentView === view
        ? "bg-[#026892] hover:bg-[#025a7a] text-white border-[#026892] shadow-sm"
        : "hover:bg-[#026892]/10 hover:border-[#026892]/30 hover:text-[#026892]"
      }`
  }

  return (
    <div className="">
      <h1 className="text-3xl font-bold text-foreground">Timetable</h1>
      <h4 className="text-lg text-muted-foreground mb-6">Manage your class schedules efficiently</h4>

      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange("day")}
            className={getButtonClass("day")}
          >
            Day
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange("week")}
            className={getButtonClass("week")}
          >
            Week
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewChange("month")}
            className={getButtonClass("month")}
          >
            Month
          </Button>
        </div>

        <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("prev")}
              className="hover:bg-[#026892]/10 hover:border-[#026892]/30 hover:text-[#026892] transition-all duration-200"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <span className="text-lg font-medium text-foreground min-w-[250px] text-center">
              {formatDate(currentDate)}
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateDate("next")}
              className="hover:bg-[#026892]/10 hover:border-[#026892]/30 hover:text-[#026892] transition-all duration-200"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
      </div>
    </div>
  )
}