"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarEvent {
  date: number;
  title: string;
  color: string;
  bgColor: string;
}

const DepartmentCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [clickedDay, setClickedDay] = useState<number | null>(null);

  const events: CalendarEvent[] = [
    { date: 5, title: "Faculty Meeting", color: "bg-blue-400", bgColor: "bg-blue-50" },
    { date: 12, title: "Exam Review", color: "bg-green-400", bgColor: "bg-green-50" },
    { date: 15, title: "Grade Submission", color: "bg-amber-400", bgColor: "bg-amber-50" },
    { date: 20, title: "Department Seminar", color: "bg-purple-400", bgColor: "bg-purple-50" },
    { date: 25, title: "Leave Approval", color: "bg-rose-400", bgColor: "bg-rose-50" },
  ];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDay }, (_, i) => i);

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const getEventsForDay = (day: number) => {
    return events.filter((event) => event.date === day);
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm w-full h-full flex flex-col">
      {/* Header */}
      <div className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 flex items-center justify-between flex-shrink-0 border-b">
        <h2 className="text-xs sm:text-sm md:text-base font-bold text-gray-900 truncate">Department Calendar</h2>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <button
            onClick={previousMonth}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
          </button>
          <span className="text-[11px] sm:text-xs font-semibold text-gray-900 w-20 sm:w-24 md:w-28 text-center truncate">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-4 sm:h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="flex-1 overflow-visible flex flex-col px-1.5 sm:px-2 md:px-4 py-1.5 sm:py-2 md:py-2.5">
        <div className="flex-1 flex flex-col w-full">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-1.5 mb-1 sm:mb-1.5">
            {dayNames.map((day) => (
              <div
                key={day}
                className="text-center text-[11px] sm:text-xs font-semibold text-gray-600 py-1 sm:py-1.5"
              >
                <span className="hidden sm:inline">{day}</span>
                <span className="sm:hidden text-[11px] font-bold">{day.slice(0, 1)}</span>
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0.5 sm:gap-1 md:gap-1.5 auto-rows-fr flex-1">
            {/* Empty days before month starts */}
            {emptyDays.map((_, i) => (
              <div key={`empty-${i}`} className="bg-gray-50 rounded-lg min-h-[26px] sm:min-h-[42px] md:min-h-[52px]" />
            ))}

            {/* Days of month */}
            {daysArray.map((day, index) => {
              const dayEvents = getEventsForDay(day);
              const isHovered = hoveredDay === day && dayEvents.length > 0;
              const isClicked = clickedDay === day && dayEvents.length > 0;
              const showPopup = (isHovered || isClicked) && dayEvents.length > 0;
              const col = (index + firstDay) % 7;
              const row = Math.floor((index + firstDay) / 7);

              return (
                <div
                  key={day}
                  className="relative min-h-[26px] sm:min-h-[42px] md:min-h-[52px]"
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  onClick={() => {
                    if (dayEvents.length > 0) {
                      setClickedDay(clickedDay === day ? null : day);
                    }
                  }}
                >
                  <div
                    className={`border border-gray-200 rounded-lg p-1 sm:p-1.5 text-center flex flex-col transition-all duration-200 h-full ${
                      dayEvents.length > 0
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md cursor-pointer"
                        : "bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-semibold text-gray-900 mb-0.5">
                      {day}
                    </div>
                    {dayEvents.length > 0 && (
                      <div className="flex flex-col gap-0.5 flex-1 justify-start">
                        <div className="text-[11px] font-medium text-indigo-600 truncate">
                          {dayEvents[0].title}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Popup Tooltip */}
                  {showPopup && (
                    <div 
                      className={`absolute z-50 bg-white border border-gray-200 rounded-lg shadow-xl p-2.5 w-48 sm:w-52 ${
                        row < 2 ? 'top-full mt-2' : 'bottom-full mb-2'
                      } ${
                        col >= 5 ? 'right-0' : col <= 1 ? 'left-0' : 'left-1/2 -translate-x-1/2'
                      }`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="text-xs font-bold text-gray-900 mb-2 border-b border-gray-200 pb-1.5">
                        {dayName(day, currentDate)}
                      </div>
                      <div className="space-y-2">
                        {dayEvents.map((event, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className={`w-2 h-2 rounded-full ${event.color} mt-1.5 flex-shrink-0`} />
                            <div className="text-[11px] text-gray-700">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Backdrop for mobile - closes popup when clicking outside */}
      {clickedDay !== null && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setClickedDay(null)}
        />
      )}
    </div>
  );
};

function dayName(day: number, currentDate: Date): string {
  const eventDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  return eventDate.toLocaleDateString("default", { weekday: "long", month: "short", day: "numeric" });
}

export default DepartmentCalendar;
