"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertTriangle,
  Bell,
  Calendar,
  Clock,
  FileText,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Users,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarInset } from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function HeaderContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [notifications] = useState(5)

  // Academic year and semester dropdown state
  const { years, isLoading: yearsLoading } =
    require("@/hooks/academic-year-and-semesters/useAcademicYears").useAcademicYears()
  const [selectedYear, setSelectedYearState] = useState<string>("")
  const { semesters, isLoading: semestersLoading } =
    require("@/hooks/academic-year-and-semesters/useSemesters").useSemesters(selectedYear)
  const [selectedSemester, setSelectedSemesterState] = useState<string>("")

  useEffect(() => {
    const storedYear = typeof window !== "undefined" ? localStorage.getItem("selectedAcademicYear") : null
    const storedSemester = typeof window !== "undefined" ? localStorage.getItem("selectedSemester") : null
    if (storedYear) setSelectedYearState(storedYear)
    if (storedSemester) setSelectedSemesterState(storedSemester)
  }, [])

  // Auto-select first academic year when available and none selected yet
  useEffect(() => {
    if (!yearsLoading && Array.isArray(years) && years.length > 0 && !selectedYear) {
      const firstYearId = years[0]?.id
      if (firstYearId) {
        setSelectedYear(firstYearId)
      }
    }
  }, [yearsLoading, years, selectedYear])

  // After year is selected and semesters fetched, auto-select first semester if none
  useEffect(() => {
    if (!semestersLoading && Array.isArray(semesters) && semesters.length > 0 && selectedYear && !selectedSemester) {
      const firstSemesterId = semesters[0]?.id
      if (firstSemesterId) {
        setSelectedSemester(firstSemesterId)
      }
    }
  }, [semestersLoading, semesters, selectedYear, selectedSemester])

  const handleDropdownLogout = () => {
    logout()
    router.push("/login")
  }

  const setSelectedYear = (year: string) => {
    setSelectedYearState(year)
    if (typeof window !== "undefined") localStorage.setItem("selectedAcademicYear", year)
    setSelectedSemesterState("") // Reset semester when year changes
    if (typeof window !== "undefined") localStorage.removeItem("selectedSemester")
  }
  const setSelectedSemester = (semester: string) => {
    setSelectedSemesterState(semester)
    if (typeof window !== "undefined") localStorage.setItem("selectedSemester", semester)
  }

  return (
    <SidebarInset className="flex flex-col h-screen overflow-hidden min-w-0">
      <header className="flex-shrink-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-[#026892] tracking-tight">SAMPS UR</span>
        </div>
        {/* Notifications, Selectors, User */}
        <div className="flex items-center gap-2">
          {/* Academic Year Dropdown */}
          <Select value={selectedYear} onValueChange={setSelectedYear} disabled={yearsLoading}>
            <SelectTrigger className="w-[160px] border-gray-300">
              <SelectValue placeholder={yearsLoading ? "Loading..." : "Academic Year"} />
            </SelectTrigger>
            <SelectContent>
              {(Array.isArray(years) ? years : []).map((year: { id: string; name: string }) => (
                <SelectItem key={year.id} value={year.id}>
                  {year.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Semester Dropdown */}
          <Select
            value={selectedSemester}
            onValueChange={setSelectedSemester}
            disabled={semestersLoading || !selectedYear}
          >
            <SelectTrigger className="w-[160px] border-gray-300">
              <SelectValue placeholder={semestersLoading ? "Loading..." : "Semester"} />
            </SelectTrigger>
            <SelectContent>
              {(Array.isArray(semesters) ? semesters : []).map((semester: { id: string; name: string }) => (
                <SelectItem key={semester.id} value={semester.id}>
                  Semester {semester.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Role Display - Static */}
          <Button
            variant="outline"
            className="flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 min-w-[120px]"
          >
            HOD
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-700" />
                {notifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full pl-1 text-xs bg-red-500 text-white border-2 border-white">
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Notifications</span>
                  <Badge variant="secondary" className="text-xs">
                    {notifications} new
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Notification Items */}
              <div className="max-h-80 overflow-y-auto">
                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 bg-red-100 rounded-lg shrink-0">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Low attendance alert</p>
                      <p className="text-xs text-gray-600 mt-1">Computer Science - 3 students below 75%</p>
                      <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full shrink-0 mt-2"></div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 bg-orange-100 rounded-lg shrink-0">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Grade submission deadline</p>
                      <p className="text-xs text-gray-600 mt-1">Mathematics - Due in 2 hours</p>
                      <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                    </div>
                    <div className="w-2 h-2 bg-orange-500 rounded-full shrink-0 mt-2"></div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 bg-blue-100 rounded-lg shrink-0">
                      <FileText className="h-4 w-4 text-[#026892]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">New lecturer application</p>
                      <p className="text-xs text-gray-600 mt-1">Dr. Sarah Wilson - Computer Science</p>
                      <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                    </div>
                    <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2"></div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 bg-green-100 rounded-lg shrink-0">
                      <Users className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Department meeting scheduled</p>
                      <p className="text-xs text-gray-600 mt-1">Tomorrow at 10:00 AM - Conference Room A</p>
                      <p className="text-xs text-gray-500 mt-1">4 hours ago</p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full shrink-0 mt-2"></div>
                  </div>
                </DropdownMenuItem>

                <DropdownMenuItem className="cursor-pointer p-3 hover:bg-gray-50">
                  <div className="flex items-start gap-3 w-full">
                    <div className="p-2 bg-purple-100 rounded-lg shrink-0">
                      <Calendar className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">Exam schedule approved</p>
                      <p className="text-xs text-gray-600 mt-1">Final exams for all departments</p>
                      <p className="text-xs text-gray-500 mt-1">1 day ago</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer justify-center text-center p-3 text-[#026892] hover:bg-[#026892]/10">
                <Link href="/notifications/inbox" className="w-full text-center">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={user?.profilePictureUrl || "/profile.webp?height=36&width=36" || "/placeholder.svg"}
                    alt={user?.fullName || "User"}
                  />
                  <AvatarFallback className="bg-[#026892]/10 text-[#026892] font-medium">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user?.fullName || user?.username || "User"}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user?.email || "No email"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleDropdownLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 min-h-0 overflow-auto p-4 md:p-6 bg-gray-50 min-w-0">{children}</main>
      <footer className="flex-shrink-0 flex flex-col gap-2 sm:flex-row py-6 w-full items-center px-4 md:px-6 border-t text-xs text-gray-500 bg-white">
        <p>&copy; {new Date().getFullYear()} SAMPS UR. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="hover:underline underline-offset-4">
            Version 2.1.0
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Support
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Terms
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Privacy
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Feedback
          </Link>
          <Link href="#" className="hover:underline underline-offset-4">
            Last Updated: Aug 2025
          </Link>
        </nav>
      </footer>
    </SidebarInset>
  )
}
