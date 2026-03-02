"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import {
  ArrowRight,
  Users,
  Activity,
  CheckCircle,
  Mail,
  FileText,
  UserPlus,
  CheckSquare,
  CalendarCheck,
  AlertTriangle,
  TrendingUp,
  BookOpen,
  ClipboardCheck,
} from "lucide-react";
import Link from "next/link";
import {
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
} from "recharts";
import { useEffect, useState } from "react";
import DepartmentCalendar from "@/components/DepartmentCalendar";
import DepartmentPerformance from "@/components/DepartmentPerformance";
import QuickActions from "@/components/QuickActions";
import StatCard from "@/components/StatCard";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchHodDashboardStats,
  HodDashboardStats,
} from "@/lib/hod-dashboard-api";

export default function HODDashboardPage() {
  const { departmentId } = useAuth();
  const [selectedAcademicYearId, setSelectedAcademicYearId] =
    useState<string>("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [stats, setStats] = useState<HodDashboardStats | null>(null);
  const todaysSchedule = [
    {
      title: "Attendance Check",
      location: "Office",
      time: "08:30",
      type: "Task",
    },
    {
      title: "Dept Meeting",
      location: "Room A",
      time: "10:00",
      type: "Meeting",
    },
    {
      title: "Student Follow-up",
      location: "Admin",
      time: "13:00",
      type: "Task",
    },
  ].sort((a, b) => a.time.localeCompare(b.time));

  const formatScheduleTime = (time: string) => {
    const [hourString, minute] = time.split(":");
    const hour = Number(hourString);
    const period = hour >= 12 ? "PM" : "AM";
    const twelveHour = hour % 12 === 0 ? 12 : hour % 12;

    return `${String(twelveHour).padStart(2, "0")}:${minute} ${period}`;
  };

  // Keep dashboard in sync with the header dropdown selections (stored in localStorage).
  useEffect(() => {
    const readSelections = () => {
      if (typeof window === "undefined") return;
      const yearId = localStorage.getItem("selectedAcademicYearId") || "";
      const semesterId = localStorage.getItem("selectedSemesterId") || "";
      setSelectedAcademicYearId(yearId);
      setSelectedSemesterId(semesterId);
    };

    readSelections();

    window.addEventListener("academicYearChanged", readSelections);
    window.addEventListener("semesterChanged", readSelections);

    return () => {
      window.removeEventListener("academicYearChanged", readSelections);
      window.removeEventListener("semesterChanged", readSelections);
    };
  }, []);

  // Fetch real stats whenever department/year/semester changes.
  useEffect(() => {
    if (!departmentId || !selectedAcademicYearId || !selectedSemesterId) return;

    let isCancelled = false;

    (async () => {
      try {
        const data = await fetchHodDashboardStats({
          departmentId,
          academicYearId: selectedAcademicYearId,
          semesterId: selectedSemesterId,
        });
        if (!isCancelled) setStats(data);
      } catch (error) {
        // Avoid UI changes; keep previous values on error.
        console.error("Failed to load dashboard stats:", error);
      }
    })();

    return () => {
      isCancelled = true;
    };
  }, [departmentId, selectedAcademicYearId, selectedSemesterId]);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          HOD Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening in your department.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Staff Members"
          value={stats?.staffCount ?? 0}
          change="+5% from last semester"
          changeType="positive"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-[#026892]"
        />
        <StatCard
          title="Enrolled Students"
          value={stats?.enrolledStudents ?? 0}
          change="+3% from last academic year"
          changeType="positive"
          icon={CheckCircle}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Pending Approvals"
          value={stats?.pendingApprovals ?? 0}
          change="High priority"
          changeType="neutral"
          icon={AlertTriangle}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Active Modules"
          value={stats?.activeModules ?? 0}
          change="+4 from last semester"
          changeType="positive"
          icon={BookOpen}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-stretch">
        <QuickActions />

        <Card className="bg-white shadow-sm border border-gray-200 rounded-lg h-full flex flex-col">
          <div className="px-2 sm:px-3 md:px-3 mb-1 sm:mb-1.5 md:mb-2 pt-2 sm:pt-2.5 md:pt-3">
            <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              Today's Schedule
            </CardTitle>
          </div>
          <CardContent className="p-2.5 sm:p-3 flex-1">
            <div className="divide-y divide-gray-100">
              {todaysSchedule.map((item) => {
                const formattedTime = formatScheduleTime(item.time);

                return (
                  <div
                    key={`${item.time}-${item.title}`}
                    className="py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 pr-2">
                        <h4 className="text-base font-semibold text-gray-900 leading-snug break-words">
                          {item.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-0.5 break-words">
                          {item.location}
                        </p>
                      </div>
                      <p className="text-sm sm:text-base text-gray-500 font-medium leading-none whitespace-nowrap">
                        {formattedTime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200 rounded-lg h-full flex flex-col">
          <div className="px-2 sm:px-3 md:px-3 mb-1 sm:mb-1.5 md:mb-2 pt-2 sm:pt-2.5 md:pt-3">
            <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              Pending Approvals
            </CardTitle>
          </div>
          <CardContent className="p-2 sm:p-2.5 flex-1">
            <div className="space-y-3">
              <Link href="/department/teaching-plans" className="block">
                <div className="flex items-start gap-2.5 p-2 rounded-lg border border-gray-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FileText className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      Teaching Plan - Module ABC101
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      Dr. Alice Smith - 2024-07-20
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/staff/leave" className="block">
                <div className="flex items-start gap-2.5 p-2 rounded-lg border border-gray-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      Leave Request - John Doe
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      John Doe - 2024-07-19
                    </p>
                  </div>
                </div>
              </Link>
              <Link href="/academic/marks-submitted" className="block">
                <div className="flex items-start gap-2.5 p-2 rounded-lg border border-gray-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                      Grade Submission - CSC203
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      Prof. Bob Johnson - 2024-07-18
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DepartmentCalendar />
        <DepartmentPerformance />
      </div>
    </div>
  );
}
