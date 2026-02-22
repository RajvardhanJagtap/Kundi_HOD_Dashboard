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
import DepartmentCalendar from "@/components/DepartmentCalendar";
import DepartmentPerformance from "@/components/DepartmentPerformance";
import QuickActions from "@/components/QuickActions";
import StatCard from "@/components/StatCard";

export default function HODDashboardPage() {
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
          value={45}
          change="+5% from last semester"
          changeType="positive"
          icon={Users}
          iconBgColor="bg-blue-50"
          iconColor="text-[#026892]"
        />
        <StatCard
          title="Enrolled Students"
          value={1234}
          change="+3% from last academic year"
          changeType="positive"
          icon={CheckCircle}
          iconBgColor="bg-green-50"
          iconColor="text-green-600"
        />
        <StatCard
          title="Pending Approvals"
          value={23}
          change="High priority"
          changeType="neutral"
          icon={AlertTriangle}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-600"
        />
        <StatCard
          title="Active Modules"
          value={32}
          change="+4 from last semester"
          changeType="positive"
          icon={BookOpen}
          iconBgColor="bg-purple-50"
          iconColor="text-purple-600"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickActions />

        <Card className="bg-white shadow-sm border border-gray-200 rounded-lg h-full">
          <div className="px-2 sm:px-3 md:px-4 mb-1.5 sm:mb-2 md:mb-3 pt-2 sm:pt-3 md:pt-4">
            <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              Today's Meetings
            </CardTitle>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-sm font-semibold text-gray-600">09:00</div>
                  <div className="text-xs text-gray-500">AM</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Department Meeting</h4>
                  <p className="text-[11px] text-gray-600 truncate">Conference Room A</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-sm font-semibold text-gray-600">11:30</div>
                  <div className="text-xs text-gray-500">AM</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Curriculum Review</h4>
                  <p className="text-[11px] text-gray-600 truncate">Meeting Room 2</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-12 text-center">
                  <div className="text-sm font-semibold text-gray-600">02:00</div>
                  <div className="text-xs text-gray-500">PM</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Student Affairs Discussion</h4>
                  <p className="text-[11px] text-gray-600 truncate">Office 301</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-200 rounded-lg h-full">
          <div className="px-2 sm:px-3 md:px-4 mb-1.5 sm:mb-2 md:mb-3 pt-2 sm:pt-3 md:pt-4">
            <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
              Pending Approvals
            </CardTitle>
          </div>
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-3">
              <Link href="/department/teaching-plans" className="block">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Teaching Plan - Module ABC101</h4>
                    <p className="text-[11px] text-gray-600">Dr. Alice Smith - 2024-07-20</p>
                  </div>
                </div>
              </Link>
              <Link href="/staff/leave" className="block">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-green-50 hover:bg-green-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Leave Request - John Doe</h4>
                    <p className="text-[11px] text-gray-600">John Doe - 2024-07-19</p>
                  </div>
                </div>
              </Link>
              <Link href="/academic/marks-submitted" className="block">
                <div className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer">
                  <div className="flex-shrink-0">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">Grade Submission - CSC203</h4>
                    <p className="text-[11px] text-gray-600">Prof. Bob Johnson - 2024-07-18</p>
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
