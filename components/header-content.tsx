"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Search, ChevronDown, User, Settings, HelpCircle, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function HeaderContent({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = React.useState("HOD");
  const roles = ["Lecturer", "HOD", "Dean", "DTLE"];

  // Academic year and semester dropdown state
  const { years, isLoading: yearsLoading } =
    require("@/hooks/academic-year-and-semesters/useAcademicYears").useAcademicYears();
  const [selectedYear, setSelectedYearState] = useState<string>("");
  const { semesters, isLoading: semestersLoading } =
    require("@/hooks/academic-year-and-semesters/useSemesters").useSemesters(selectedYear);
  const [selectedSemester, setSelectedSemesterState] = useState<string>("");

  useEffect(() => {
    const storedYear =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedAcademicYear")
        : null;
    const storedSemester =
      typeof window !== "undefined"
        ? localStorage.getItem("selectedSemester")
        : null;
    if (storedYear) setSelectedYearState(storedYear);
    if (storedSemester) setSelectedSemesterState(storedSemester);
  }, []);

  const handleDropdownLogout = () => {
    logout();
    router.push('/login');
  };

  const setSelectedYear = (year: string) => {
    setSelectedYearState(year);
    if (typeof window !== "undefined")
      localStorage.setItem("selectedAcademicYear", year);
    setSelectedSemesterState(""); // Reset semester when year changes
    if (typeof window !== "undefined")
      localStorage.removeItem("selectedSemester");
  };
  const setSelectedSemester = (semester: string) => {
    setSelectedSemesterState(semester);
    if (typeof window !== "undefined")
      localStorage.setItem("selectedSemester", semester);
  };

  return (
    <SidebarInset>
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span className="font-bold text-xl text-[#026892] tracking-tight">
            SAMPS UR
          </span>
        </div>
        {/* Notifications, Selectors, User */}
        <div className="flex items-center gap-2">
          {/* Academic Year Dropdown */}
            <Select
              value={selectedYear}
              onValueChange={setSelectedYear}
              disabled={yearsLoading}
            >
              <SelectTrigger className="w-[160px] border-gray-300">
                <SelectValue
                  placeholder={yearsLoading ? "Loading..." : "Academic Year"}
                />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(years) ? years : []).map(
                  (year: { id: string; name: string }) => (
                    <SelectItem key={year.id} value={year.id}>
                      {year.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {/* Semester Dropdown */}
            <Select
              value={selectedSemester}
              onValueChange={setSelectedSemester} 
              disabled={semestersLoading || !selectedYear}
            >
              <SelectTrigger className="w-[160px] border-gray-300">
                <SelectValue
                  placeholder={semestersLoading ? "Loading..." : "Semester"}
                />
              </SelectTrigger>
              <SelectContent>
                {(Array.isArray(semesters) ? semesters : []).map(
                  (semester: { id: string; name: string }) => (
                    <SelectItem key={semester.id} value={semester.id}>
                      Semester {semester.name}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50 min-w-[120px]"
              >
                {selectedRole}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Switch Role</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {roles.map((role) => (
                <DropdownMenuItem
                  key={role}
                  onSelect={() => setSelectedRole(role)}
                >
                  {role}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-gray-100"
          >
            <Bell className="h-5 w-5 text-gray-700" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#d32f2f] text-xs text-white font-bold">
              5
            </span>
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-9 w-9 rounded-full hover:bg-gray-100"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={
                      user?.profilePictureUrl ||
                      "/profile.webp?height=36&width=36"
                    }
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
                  <p className="text-sm font-medium leading-none">
                    {user?.fullName || user?.username || "User"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || "No email"}
                  </p>
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
              <DropdownMenuItem
                className="cursor-pointer text-red-600"
                onClick={handleDropdownLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 md:p-6 bg-gray-50">
        {children}
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t text-xs text-gray-500 bg-white">
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
  );
}
