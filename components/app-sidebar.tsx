"use client";
import Link from "next/link";
import { SidebarHeader } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
  ChevronRight,
  FileText,
  BarChart3,
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

// Role-based navigation configuration
const navigationConfig = {
  hod: {
    primary: [
      {
        title: "Dashboard",
        icon: Home,
        url: "/dashboard",
      },
      {
        title: "Academic Management",
        icon: BookOpen,
        items: [
          { title: "Teaching Plans", url: "/department/teaching-plans" },
          { title: "Attendance", url: "/academic/attendance" },
          { title: "Timetables", url: "/academic/timetables" },
          { title: "Student Requests", url: "/services" },
        ],
      },
      {
        title: "Academic Records",
        icon: FileText,
        items: [
          { title: "Marks Submitted", url: "/academic/marks-submitted" },
          { title: "Classes Marks", url: "/academic/classes-marks" },
          { title: "Students Transcripts", url: "/students/transcripts" },
          { title: "Student Records", url: "/students/records" },
        ],
      },
      {
        title: "Staff Management",
        icon: Users,
        items: [
          {
            title: "Lecturer Registration",
            url: "/staff/lecturer-registration",
          },
          { title: "Leave Requests", url: "/staff/leave" },
          { title: "Modules Allocation", url: "/staff/module-assignments" },
          { title: "Assign Claims", url: "/staff/assign-claims" },
          { title: "Set Submissions", url: "/academic/deadlines" },
        ],
      },
      // {
      //   title: "Resources",
      //   icon: FolderKanban,
      //   url: "/department/resources",
      // },
      // {
      //   title: "Curriculum",
      //   icon: BookCheck,
      //   url: "/department/curriculum",
      // },
      // {
      //   title: "Communication",
      //   icon: MessageSquarePlus,
      //   url: "/notifications",
      // },
      {
        title: "Reports",
        icon: LineChart,
        url: "/reports",
      },
    ],
  },
};

function getExpandedSectionFromPath(pathname: string, navigation: any) {
  for (const item of navigation.primary) {
    if (item.items) {
      for (const subItem of item.items) {
        if (
          pathname === subItem.url ||
          pathname.startsWith(subItem.url + "/")
        ) {
          return item.title;
        }
      }
    } else if (pathname === item.url || pathname.startsWith(item.url + "/")) {
      return item.title;
    }
  }
  return "Dashboard";
}

export function AppSidebar() {
  const pathname = usePathname();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "Dashboard"
  );
  const [activeSubItem, setActiveSubItem] = useState<string>("");
  const [currentRole, setCurrentRole] = useState<string>("hod");
  const currentNavigation =
    navigationConfig[currentRole as keyof typeof navigationConfig];

  useEffect(() => {
    const shouldBeExpanded = getExpandedSectionFromPath(
      pathname,
      currentNavigation
    );
    setExpandedSection(shouldBeExpanded);

    let activeSubItemUrl = pathname;
    for (const item of currentNavigation.primary) {
      if (item.items) {
        for (const subItem of item.items) {
          if (pathname.startsWith(subItem.url + "/")) {
            activeSubItemUrl = subItem.url;
            break;
          }
        }
      }
    }
    setActiveSubItem(activeSubItemUrl);
  }, [pathname, currentNavigation]);

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
      <SidebarContent className="py-2 px-3">
        <nav className="space-y-2">
          {currentNavigation.primary.map((item: any) => (
            <div key={item.title}>
              {item.items ? (
                <Collapsible
                  open={expandedSection === item.title}
                  onOpenChange={(isOpen) => {
                    if (isOpen) {
                      setExpandedSection(item.title);
                    } else {
                      setExpandedSection("");
                    }
                  }}
                  className="group/collapsible"
                >
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`w-full justify-between text-black hover:text-[#026892] hover:bg-[#ECFDF5] data-[state=open]:bg-[#ECFDF5] data-[state=open]:text-[#026892] ${
                        expandedSection === item.title
                          ? "bg-gray-700 text-white"
                          : ""
                      }`}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3 h-4 w-4" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className="h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="ml-6 mt-2 space-y-1">
                      {item.items.map((subItem: any) => (
                        <Link key={subItem.title} href={subItem.url}>
                          <Button
                            variant="ghost"
                            className={`w-full justify-start text-sm hover:text-[#026892] hover:bg-[#ECFDF5] ${
                              pathname === subItem.url ||
                              pathname.startsWith(subItem.url + "/") ||
                              activeSubItem === subItem.url
                                ? "bg-[#ECFDF5] text-[#026892]"
                                : "text-gray-700"
                            }`}
                            onClick={() => {
                              setActiveSubItem(subItem.url);
                              setExpandedSection(item.title);
                            }}
                          >
                            {/* Add appropriate icon for each submenu item */}
                            {subItem.title === "Teaching Plans" && (
                              <ClipboardList className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Attendance" && (
                              <Clock className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Timetables" && (
                              <Calendar className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Student Requests" && (
                              <MessageSquarePlus className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Marks Submitted" && (
                              <CheckCircle className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Classes Marks" && (
                              <BookmarkCheck className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Students Transcripts" && (
                              <Scroll className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Student Records" && (
                              <Award className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Lecturer Registration" && (
                              <Users className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Leave Requests" && (
                              <Users className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Modules Allocation" && (
                              <Users className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Assign Claims" && (
                              <FileText className="mr-3 h-4 w-4" />
                            )}
                            {subItem.title === "Set Submissions" && (
                              <CalendarCheck className="mr-3 h-4 w-4" />
                            )}
                            <span>{subItem.title}</span>
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ) : (
                <Link href={item.url}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-black hover:text-[#026892] hover:bg-[#ECFDF5] ${
                      pathname === item.url ? "bg-[#ECFDF5] text-[#026892]" : ""
                    }`}
                    onClick={() => {
                      setExpandedSection(item.title);
                      setActiveSubItem(item.url);
                    }}
                  >
                    <item.icon className="mr-3 h-4 w-4" />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              )}
            </div>
          ))}
        </nav>
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
