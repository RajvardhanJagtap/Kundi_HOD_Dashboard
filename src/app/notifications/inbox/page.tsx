"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  FileText,
  Search,
  Settings,
  Trash2,
  Users,
  Eye,
  MoreVertical,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// HOD-specific notification data
const notificationsData = [
  {
    id: 1,
    type: "alert",
    title: "Low attendance alert",
    description: "Computer Science Department - 3 students below 75% attendance threshold",
    timestamp: "5 minutes ago",
    isRead: false,
    priority: "urgent",
    department: "Computer Science",
    icon: AlertTriangle,
    color: "red",
  },
  {
    id: 2,
    type: "deadline",
    title: "Grade submission deadline",
    description: "Mathematics Department grades due in 2 hours. 2 lecturers haven't submitted yet.",
    timestamp: "1 hour ago",
    isRead: false,
    priority: "high",
    department: "Mathematics",
    icon: Clock,
    color: "orange",
  },
  {
    id: 3,
    type: "application",
    title: "New lecturer application",
    description: "Dr. Sarah Wilson has applied for Computer Science position. Review required.",
    timestamp: "2 hours ago",
    isRead: false,
    priority: "normal",
    department: "Computer Science",
    icon: FileText,
    color: "blue",
  },
  {
    id: 4,
    type: "meeting",
    title: "Department meeting scheduled",
    description: "Weekly department heads meeting tomorrow at 10:00 AM in Conference Room A.",
    timestamp: "4 hours ago",
    isRead: true,
    priority: "normal",
    department: "All Departments",
    icon: Users,
    color: "green",
  },
  {
    id: 5,
    type: "approval",
    title: "Exam schedule approved",
    description: "Final examination schedule for all departments has been approved by the Dean.",
    timestamp: "1 day ago",
    isRead: true,
    priority: "normal",
    department: "All Departments",
    icon: Calendar,
    color: "purple",
  },
  {
    id: 6,
    type: "budget",
    title: "Budget allocation update",
    description: "Q4 budget allocation for department resources has been updated.",
    timestamp: "2 days ago",
    isRead: false,
    priority: "high",
    department: "Administration",
    icon: TrendingUp,
    color: "blue",
  },
  {
    id: 7,
    type: "performance",
    title: "Department performance report",
    description: "Monthly performance metrics are now available for review.",
    timestamp: "3 days ago",
    isRead: true,
    priority: "normal",
    department: "All Departments",
    icon: UserCheck,
    color: "green",
  },
  {
    id: 8,
    type: "system",
    title: "System maintenance completed",
    description: "Academic portal maintenance has been completed successfully.",
    timestamp: "1 week ago",
    isRead: true,
    priority: "normal",
    department: "IT Services",
    icon: Settings,
    color: "blue",
  },
];

// NotificationsList component for rendering notifications
interface NotificationsListProps {
  notifications: typeof notificationsData;
  getColorClasses: (color: string) => any;
  getPriorityBadge: (priority: string) => any;
  markAsRead: (id: number) => void;
  deleteNotification: (id: number) => void;
  openDropdown: number | null;
  setOpenDropdown: (id: number | null) => void;
}

function NotificationsList({
  notifications,
  getColorClasses,
  getPriorityBadge,
  markAsRead,
  deleteNotification,
  openDropdown,
  setOpenDropdown,
}: NotificationsListProps) {
  if (notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <Bell className="mx-auto h-12 w-12 text-gray-300 mb-4" />
        <p>No notifications found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {notifications.map((notification) => {
        const colorClasses = getColorClasses(notification.color);
        const priorityBadge = getPriorityBadge(notification.priority);
        const IconComponent = notification.icon;

        return (
          <div
            key={notification.id}
            className={`border rounded-lg p-4 transition-colors hover:bg-gray-50 ${
              !notification.isRead ? "bg-blue-50/50 border-blue-200" : "bg-white"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-2 ${colorClasses.bg} rounded-lg shrink-0`}>
                <IconComponent className={`h-5 w-5 ${colorClasses.text}`} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-medium ${!notification.isRead ? "text-gray-900" : "text-gray-700"}`}>
                        {notification.title}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {notification.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{notification.timestamp}</span>
                      <span>•</span>
                      <span>{notification.department}</span>
                      <Badge className={priorityBadge.className}>
                        {priorityBadge.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="relative notification-actions">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setOpenDropdown(openDropdown === notification.id ? null : notification.id)}
                      className="hover:cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                    
                    {openDropdown === notification.id && (
                      <div 
                        className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-[9999]"
                        style={{ zIndex: 9999 }}
                      >
                        <div className="py-1">
                          {!notification.isRead && (
                            <div 
                              className="cursor-pointer px-3 py-2 hover:bg-gray-50 flex items-center text-sm"
                              onClick={() => {
                                markAsRead(notification.id);
                                setOpenDropdown(null);
                              }}
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Mark as Read
                            </div>
                          )}
                          <div 
                            className="cursor-pointer px-3 py-2 hover:bg-gray-50 flex items-center text-sm text-red-600"
                            onClick={() => {
                              deleteNotification(notification.id);
                              setOpenDropdown(null);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function NotificationsInboxContent() {
  const [notifications, setNotifications] = useState(notificationsData);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filter notifications based on type, search term, and tab
  const filteredNotifications = notifications.filter((notification) => {
    const matchesFilter = filter === "all" || notification.type === filter;
    const matchesSearch = 
      notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = 
      activeTab === "all" || 
      (activeTab === "unread" && !notification.isRead) ||
      (activeTab === "read" && notification.isRead);
    
    return matchesFilter && matchesSearch && matchesTab;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNotifications.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedNotifications = filteredNotifications.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchTerm, activeTab]);

  // Mark notification as read
  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notif => 
      notif.id === id ? { ...notif, isRead: true } : notif
    ));
  };

  // Delete notification
  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notif => notif.id !== id));
  };

  // Mark all as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, isRead: true })));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.notification-actions')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get color classes for notification types
  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: { bg: "bg-blue-100", text: "text-[#026892]", border: "border-blue-200" },
      orange: { bg: "bg-orange-100", text: "text-orange-600", border: "border-orange-200" },
      green: { bg: "bg-green-100", text: "text-green-600", border: "border-green-200" },
      purple: { bg: "bg-purple-100", text: "text-purple-600", border: "border-purple-200" },
      red: { bg: "bg-red-100", text: "text-red-600", border: "border-red-200" },
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  // Get priority badge
  const getPriorityBadge = (priority: string) => {
    const priorityMap = {
      urgent: { label: "Urgent", className: "bg-red-100 text-red-700" },
      high: { label: "High", className: "bg-orange-100 text-orange-700" },
      normal: { label: "Normal", className: "bg-gray-100 text-gray-700" },
    };
    return priorityMap[priority as keyof typeof priorityMap] || priorityMap.normal;
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header Stats - Dashboard Style */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Notifications
                </p>
                <p className="text-2xl font-bold text-gray-800">{notifications.length}</p>
                <p className="text-xs text-green-600">
                  All time
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Bell className="w-6 h-6 text-[#026892]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Unread
                </p>
                <p className="text-2xl font-bold text-gray-800">{unreadCount}</p>
                <p className="text-xs text-orange-600">
                  Require attention
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  This Week
                </p>
                <p className="text-2xl font-bold text-gray-800">15</p>
                <p className="text-xs text-green-600">
                  Recent activity
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  High Priority
                </p>
                <p className="text-2xl font-bold text-gray-800">
                  {notifications.filter(n => n.priority === "high" || n.priority === "urgent").length}
                </p>
                <p className="text-xs text-purple-600">
                  Need immediate action
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications with Tabs and Pagination */}
      <Card className="bg-white shadow-sm border border-gray-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-gray-900">Notifications</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                Manage and view all your HOD notifications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter by type */}
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="alert">🚨 Alerts</SelectItem>
                <SelectItem value="deadline">⏰ Deadlines</SelectItem>
                <SelectItem value="application">📄 Applications</SelectItem>
                <SelectItem value="meeting">👥 Meetings</SelectItem>
                <SelectItem value="approval">✅ Approvals</SelectItem>
                <SelectItem value="budget">💰 Budget</SelectItem>
                <SelectItem value="performance">📊 Performance</SelectItem>
                <SelectItem value="system">⚙️ System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Underline Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              {[
                { id: "all", label: `All (${notifications.length})` },
                { id: "unread", label: `Unread (${unreadCount})` },
                { id: "read", label: `Read (${notifications.length - unreadCount})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-[#026892] text-[#026892] hover:cursor-pointer"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:cursor-pointer"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Notifications List */}
          <NotificationsList 
            notifications={paginatedNotifications}
            getColorClasses={getColorClasses}
            getPriorityBadge={getPriorityBadge}
            markAsRead={markAsRead}
            deleteNotification={deleteNotification}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        onClick={() => setCurrentPage(page)}
                        isActive={currentPage === page}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function NotificationsInboxPage() {
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Notification Inbox</h1>
        <p className="text-gray-600 text-sm">View and manage all your HOD notifications in one place.</p>
      </div>
      <NotificationsInboxContent />
    </div>
  );
}
