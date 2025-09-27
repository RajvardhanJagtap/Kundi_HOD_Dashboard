"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MapPin, Clock, User, Calendar, BookOpen } from "lucide-react"
import type { ScheduleData } from "@/types/scheduleTypes"

interface ModuleDetailsModalProps {
  schedule: ScheduleData | null
  isOpen: boolean
  onClose: () => void
}

export function ModuleDetailsModal({ schedule, isOpen, onClose }: ModuleDetailsModalProps) {
  if (!schedule) return null

  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    "bg-blue-500": { bg: "#dff6ff", border: "#0284c7", text: "#0284c7" },
    "bg-blue-300": { bg: "#e6f7ff", border: "#0284c7", text: "#0284c7" },
    "bg-green-500": { bg: "#e6f9e6", border: "#15803d", text: "#15803d" },
    "bg-green-300": { bg: "#efffe9", border: "#15803d", text: "#15803d" },
    "bg-purple-300": { bg: "#f3e8ff", border: "#7c3aed", text: "#7c3aed" },
    "bg-orange-300": { bg: "#fff3e0", border: "#ea580c", text: "#ea580c" },
    "bg-red-300": { bg: "#ffe7e7", border: "#dc2626", text: "#dc2626" },
    "bg-teal-300": { bg: "#e6f7f6", border: "#0d9488", text: "#0d9488" },
    "bg-pink-300": { bg: "#ffe6f0", border: "#be185d", text: "#be185d" },
    "bg-indigo-300": { bg: "#eef2ff", border: "#3730a3", text: "#3730a3" },
    "bg-yellow-300": { bg: "#fff7cc", border: "#d97706", text: "#d97706" },
    "bg-yellow-400": { bg: "#fff9db", border: "#b45309", text: "#b45309" },
  }

  const colorStyle = colorMap[schedule.color] || { bg: "#ffffff", border: "#e5e7eb", text: "#374151" }

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00') // Add time to avoid timezone issues
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric", 
      month: "long",
      day: "numeric"
    })
  }

  // Calculate duration
  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}:00`)
    const end = new Date(`2000-01-01T${endTime}:00`)
    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diffMinutes === 0) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''}`
    }
    return `${diffHours}h ${diffMinutes}m`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="space-y-4">
          <div className="flex items-start gap-4">
            <div 
              className="w-4 h-16 rounded-sm flex-shrink-0"
              style={{ backgroundColor: colorStyle.border }}
            />
            <div className="flex-1 space-y-2">
              <DialogTitle className="text-xl font-bold leading-tight">
                {schedule.moduleCode && (
                  <span className="text-muted-foreground font-medium">
                    {schedule.moduleCode} - 
                  </span>
                )}
                <span className="ml-1">{schedule.moduleName}</span>
              </DialogTitle>
              <DialogDescription className="text-base">
                Detailed information about your scheduled class
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {/* Main Info Card */}
          <Card 
            className="p-6 border-2"
            style={{ 
              backgroundColor: colorStyle.bg,
              borderColor: colorStyle.border 
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5" style={{ color: colorStyle.text }} />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Date</p>
                    <p className="text-base font-medium">{formatDate(schedule.date)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5" style={{ color: colorStyle.text }} />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Time</p>
                    <p className="text-base font-medium">
                      {schedule.startTime} - {schedule.endTime}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Duration: {calculateDuration(schedule.startTime, schedule.endTime)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Location & Instructor */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5" style={{ color: colorStyle.text }} />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Venue</p>
                    <p className="text-base font-medium">{schedule.venue || 'To Be Announced'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <User className="h-5 w-5" style={{ color: colorStyle.text }} />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Instructor</p>
                    <p className="text-base font-medium">{schedule.instructorName || 'To Be Announced'}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Module Code Badge */}
            {schedule.moduleCode && (
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Module Code</p>
                    <Badge 
                      variant="outline" 
                      className="mt-1 font-mono text-sm px-3 py-1"
                      style={{ 
                        borderColor: colorStyle.border,
                        color: colorStyle.text 
                      }}
                    >
                      {schedule.moduleCode}
                    </Badge>
                  </div>
                </div>
              </Card>
            )}

            {/* Class Type/Category if available */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: colorStyle.border }}
                />
                <div>
                  <p className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Status</p>
                  <Badge variant="secondary" className="mt-1">
                    Scheduled
                  </Badge>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions or Notes section can be added here if needed */}
          <Card className="p-4 bg-muted/30">
            <div className="flex items-start gap-3">
              <div className="text-sm text-muted-foreground">
                <p className="font-medium mb-2">Class Information</p>
                <p>
                  This is a scheduled {schedule.moduleCode ? 'module' : 'class'} session. 
                  Make sure to arrive at the venue on time and bring any required materials.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}