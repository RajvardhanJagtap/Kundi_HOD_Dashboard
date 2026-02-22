"use client";

import React from "react";
import Link from "next/link";
import { FileText, Users, CheckSquare, Calendar } from "lucide-react";

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  bgColor: string;
  textColor: string;
  iconColor: string;
}

const QuickActions: React.FC = () => {
  const actions: QuickAction[] = [
    {
      id: "teaching-plans",
      label: "Approve Teaching Plans",
      icon: <FileText size={18} />,
      href: "/academic/teaching-plans",
      bgColor: "bg-[#DBEAFE]",
      textColor: "text-[#1E40AF]",
      iconColor: "text-[#1E40AF]",
    },
    {
      id: "assign-lecturers",
      label: "Assign Lecturers to Modules",
      icon: <Users size={18} />,
      href: "/staff/modules-allocation",
      bgColor: "bg-[#DBEAFE]",
      textColor: "text-[#1E40AF]",
      iconColor: "text-[#1E40AF]",
    },
    {
      id: "approve-grades",
      label: "Approve Grades",
      icon: <CheckSquare size={18} />,
      href: "/academic-records/classes-marks",
      bgColor: "bg-[#DBEAFE]",
      textColor: "text-[#1E40AF]",
      iconColor: "text-[#1E40AF]",
    },
    {
      id: "approve-leave",
      label: "Approve Staff Leave Requests",
      icon: <Calendar size={18} />,
      href: "/staff/leave-requests",
      bgColor: "bg-[#FFEDD5]",
      textColor: "text-[#9A3412]",
      iconColor: "text-[#9A3412]",
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 md:p-4 shadow-sm h-full flex flex-col">
      <div className="mb-1.5 sm:mb-2 md:mb-3">
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-900">Quick Actions</h2>
      </div>

      <div className="space-y-1.5 sm:space-y-2 flex flex-col">
        {actions.map((action) => {
          return (
            <Link key={action.id} href={action.href} className="block">
              <div
                role="button"
                tabIndex={0}
                className={`flex items-center gap-2 px-2 sm:px-2.5 md:px-3 py-1.5 sm:py-2 md:py-2.5 rounded-lg ${action.bgColor} border border-gray-200 hover:bg-[${action.id === 'approve-leave' ? '#FED7AA' : '#BFDBFE'}] hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-200 group`}
              >
                <div className={`flex-shrink-0 ${action.iconColor} group-hover:text-gray-900`}>
                  <span className="[&>svg]:h-3.5 [&>svg]:w-3.5 sm:[&>svg]:h-4 sm:[&>svg]:w-4">{action.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-semibold text-xs sm:text-sm ${action.textColor} group-hover:text-gray-900 truncate`}>
                    {action.label}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActions;
