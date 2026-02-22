"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconBgColor,
  iconColor,
}) => {
  const changeColorClass =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
        ? "text-red-600"
        : "text-orange-600";

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 sm:p-4 overflow-hidden hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 truncate">
            {value}
          </h3>
          <p className={`text-[11px] font-medium ${changeColorClass} truncate`}>
            {change}
          </p>
        </div>
        <div
          className={`h-8 w-8 sm:h-9 sm:w-9 rounded-lg ${iconBgColor} flex items-center justify-center flex-shrink-0`}
        >
          <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

export default StatCard;
