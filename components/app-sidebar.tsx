"use client";
import Link from "next/link";
import { SidebarHeader } from "@/components/ui/sidebar";

import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Bell,
  ChevronDown,
  ChevronUp,
  Home,
  LogOut,
  Settings,
  Building2,
  BookOpen,
  Users,
  GraduationCap,
  Award,
  LineChart,
  User,
  MessageSquarePlus,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
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
    title: "Department",
    icon: Building2,
    items: [
      { title: "Overview", url: "/department/overview" },
      { title: "Module Planning", url: "/department/module-planning" },
      { title: "Resources", url: "/department/resources" },
      { title: "Calendar", url: "/department/calendar" },
      { title: "Policies", url: "/department/policies" },
      { title: "Meetings", url: "/department/meetings" },
      { title: "Curriculum", url: "/department/curriculum" },
      { title: "Teaching Plans", url: "/department/teaching-plans" },
    ],
  },
  {
    title: "Academic",
    icon: BookOpen,
    items: [
      //{ title: "Assessment", url: "/academic/assessment" },
      { title: "Timetables", url: "/academic/timetables" },
      { title: "Deadlines", url: "/academic/deadlines" },
      { title: "Exams", url: "/academic/exams" },
      { title: "Marks Submitted", url: "/academic/marks-submitted" },
      { title: "Classes Marks", url: "/academic/classes-marks" },
      { title: "Attendance", url: "/academic/attendance" },
    ],
  },
  {
    title: "Staff",
    icon: Users,
    items: [
      { title: "Directory", url: "/staff/directory" },
      { title: "Workload", url: "/staff/workload" },
      { title: "Module Assignments", url: "/staff/module-assignments" },
      { title: "Performance", url: "/staff/performance" },
      { title: "Leave", url: "/staff/leave" },
      { title: "Development", url: "/staff/development" },
      { title: "Recruitment", url: "/staff/recruitment" },
    ],
  },
  {
    title: "Students",
    icon: GraduationCap,
    items: [
      { title: "Records", url: "/students/records" },
      { title: "Progress", url: "/students/progress" },
      { title: "Appeals", url: "/students/appeals" },
      { title: "Graduands", url: "/students/graduands" },
    ],
  },
  {
    title: "Quality Assurance",
    icon: Award,
    items: [
      { title: "Metrics", url: "/qa/metrics" },
      { title: "Module Review", url: "/qa/module-review" },
      { title: "Feedback", url: "/qa/feedback" },
      { title: "Improvements", url: "/qa/improvements" },
      { title: "Audits", url: "/qa/audits" },
    ],
  },
  {
    title: "Reports",
    icon: LineChart,
    items: [
      { title: "Staff Reports", url: "/reports/staff" },
      { title: "Student Reports", url: "/reports/student" },
      { title: "Resource Reports", url: "/reports/resource" },
      { title: "Quality Reports", url: "/reports/quality" },
      { title: "Custom Reports", url: "/reports/custom" },
    ],
  },
  {
    title: "Communication", // New group for communication
    icon: MessageSquarePlus,
    items: [
      { title: "Notifications", url: "/notifications" }, // New notifications page
    ],
  },
  {
    title: "Personal",
    icon: User,
    url: "/personal",
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const [openCollapsible, setOpenCollapsible] = React.useState<string | null>(
    null
  ); // State to track which collapsible is open

  // Handle collapsible toggle
  const handleCollapsibleToggle = (title: string) => {
    setOpenCollapsible(openCollapsible === title ? null : title);
  };

  // Function to check if any sub-item of a parent is active
  const isParentActive = (parentItem: (typeof hodNavigation)[0]) => {
    if (parentItem.url && pathname === parentItem.url) return true; // Direct link is active
    if (parentItem.items) {
      return parentItem.items.some((subItem) =>
        pathname.startsWith(subItem.url)
      );
    }
    return false;
  };

  return (
    <Sidebar className="bg-white border-none">
      <SidebarHeader className="app-sidebar border-b border-gray-300">
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
            {item.items ? (
              <Collapsible
                open={openCollapsible === item.title}
                onOpenChange={() => handleCollapsibleToggle(item.title)}
                className=" submenu  font-semibold"
              >
                <SidebarGroupLabel asChild>
                  <CollapsibleTrigger
                    className={`w-full flex items-center gap-2 p-2 rounded-md font-medium text-black transition-colors ${
                      isParentActive(item)
                        ? "bg-[#ECFDF5] text-[#026892]"
                        : "hover:text-[#026892] hover:bg-[#ECFDF5]"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="font-bold text-sm text-gray-700">{item.title}</span>
                    <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180 text-black" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
                <CollapsibleContent>
                  <SidebarGroupContent className="py-1 pl-4">
                    <SidebarMenu className="font-normal">
                      {item.items.map((subItem) => (
                        <SidebarMenuItem key={subItem.title}>
                          <SidebarMenuButton asChild>
                            <Link
                              href={subItem.url}
                              className={`flex w-full items-center gap-2 p-2 rounded-md text-sm transition-colors ${
                                (
                                  subItem.url === "/academic/marks-submitted"
                                    ? pathname.startsWith(
                                        "/academic/marks-submitted"
                                      )
                                    : pathname === subItem.url
                                )
                                  ? "bg-[#ECFDF5] text-[#026892] font-medium"
                                  : "text-gray-600 hover:text-[#026892] hover:bg-[#ECFDF5]"
                              }`}
                            >
                              {subItem.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </Collapsible>
            ) : (
              <SidebarGroupLabel asChild>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    className={`w-full flex items-center gap-2 p-2 rounded-md font-medium text-black transition-colors ${
                      pathname === item.url
                        ? "bg-[#ECFDF5] text-[#026892]"
                        : "hover:text-[#026892] hover:bg-[#ECFDF5]"
                    }`}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    <span className="font-bold text-sm text-gray-700">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarGroupLabel>
            )}
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
