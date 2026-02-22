"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const DepartmentPerformance: React.FC = () => {
  const performanceData = [
    { level: "Year 1", performance: 75 },
    { level: "Year 2", performance: 78 },
    { level: "Year 3", performance: 80 },
    { level: "Year 4", performance: 83 },
    { level: "Year 5", performance: 85 },
    { level: "Year 6", performance: 84 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm h-full flex flex-col">
      {/* Header */}
      <div className="px-3 sm:px-4 py-2 sm:py-2.5 flex-shrink-0">
        <h2 className="text-sm sm:text-base font-bold text-gray-900">
          Department Performance Analytics
        </h2>
      </div>

      {/* Chart */}
      <div className="flex-1 overflow-hidden flex flex-col px-2 sm:px-4 py-2.5 sm:py-4 min-h-[240px]">
        <ResponsiveContainer width="100%" height={240}>
          <BarChart
            data={performanceData}
            margin={{ top: 6, right: 8, left: -12, bottom: 6 }}
            barSize={28}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis
              dataKey="level"
              stroke="#9ca3af"
              tick={{ fill: "#6b7280", fontSize: 9, fontWeight: 500 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
            />
            <YAxis
              stroke="#9ca3af"
              tick={{ fill: "#6b7280", fontSize: 10, fontWeight: 500 }}
              axisLine={{ stroke: "#e5e7eb" }}
              tickLine={false}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                fontSize: "12px",
                padding: "8px 12px",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{ color: "#111827", fontWeight: "600", marginBottom: "4px" }}
              cursor={{ fill: "rgba(2, 104, 146, 0.05)" }}
            />
            <Bar
              dataKey="performance"
              fill="#026892"
              radius={[6, 6, 0, 0]}
              maxBarSize={50}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentPerformance;
