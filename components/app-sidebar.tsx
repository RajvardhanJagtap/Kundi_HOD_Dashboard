"use client";
import Link from "next/link";
import { SidebarHeader } from "@/components/ui/sidebar";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Home,
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  LineChart,
  MessageSquarePlus,
  Scroll,
  BookmarkCheck,
  Calendar,
  CheckCircle,
  ClipboardList,
  FolderKanban,
  UserSquare2,
  Clock,
  BookCheck,
  CalendarCheck,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const roles = ["Lecturer", "HOD", "Dean", "DTLE"];

const hodNavigation = [
  {
    title: "Dashboard",
    icon: Home,
    url: "/dashboard",
  },
  {
    title: "Teaching Plans",
    icon: ClipboardList,
    url: "/department/teaching-plans",
  },
  {
    title: "Attendance",
    icon: Clock,
    url: "/academic/attendance",
  },
  {
    title: "Timetables",
    icon: Calendar,
    url: "/academic/timetables",
  },
  {
    title: "Set Submissions",
    icon: CalendarCheck,
    url: "/academic/deadlines",
  },
  {
    title: "Marks Submitted",
    icon: CheckCircle,
    url: "/academic/marks-submitted",
  },
  {
    title: "Classes Marks",
    icon: BookmarkCheck,
    url: "/academic/classes-marks",
  },
  {
    title: "Students Transcripts",
    icon: Scroll,
    url: "/students/transcripts",
  },
  {
    title: "Student Records",
    icon: Award,
    url: "/students/records",
  },
  {
    title: "Resources",
    icon: FolderKanban,
    url: "/department/resources",
  },
  {
    title: "Leave Requests",
    icon: Users,
    url: "/staff/leave",
  },
  {
    title: "Curriculum",
    icon: BookCheck,
    url: "/department/curriculum",
  },
  {
    title: "Communication",
    icon: MessageSquarePlus,
    url: "/notifications",
  },
  {
    title: "Reports",
    icon: LineChart,
    url: "/reports",
  },
  {
    title: "Services Requests",
    icon: MessageSquarePlus,
    url: "/services",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  // Check if the current path matches the item's URL
  const isRouteActive = (url: string) => {
    return pathname.startsWith(url);
  };

  return (
    <Sidebar className="bg-white border-none">
      <SidebarHeader className="app-sidebar border-b border-gray-300 h-16">
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="m-auto">
                <Image
                  src="/img/logo.jpeg"
                  alt="Institution Logo"
                  width={50}
                  height={50}
                />
              </div>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="py-2">
        {hodNavigation.map((item) => (
          <SidebarGroup key={item.title} className="px-2 font-small">
            <SidebarGroupLabel asChild>
              <SidebarMenuButton asChild>
                <Link
                  href={item.url}
                  className={`w-full flex items-center gap-2 p-2 rounded-md font-medium text-black transition-colors ${
                    isRouteActive(item.url)
                      ? "bg-[#ECFDF5] text-[#026892]"
                      : "hover:text-[#026892] hover:bg-[#ECFDF5]"
                  }`}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  <span className="font-medium text-sm text-black">
                    {item.title}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarGroupLabel>
          </SidebarGroup>
        ))}
      </SidebarContent>
      {/* <SidebarFooter className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-400 space-y-1">
          <p>Version 2.1.0</p>
          <p>Last Updated: Aug 2025</p>
        </div>
      </SidebarFooter> */}
    </Sidebar>
  );
}
