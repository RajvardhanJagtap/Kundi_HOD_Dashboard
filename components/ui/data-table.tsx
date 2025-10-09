"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface Column<T> {
  key: string;
  title: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  className?: string;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  rowClassName?: string | ((record: T, index: number) => string);
  onRowClick?: (record: T, index: number) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available",
  className,
  rowClassName,
  onRowClick,
}: DataTableProps<T>) {
  const getRowClassName = (record: T, index: number) => {
    const baseClasses = "hover:bg-gray-50";
    const clickableClasses = onRowClick ? "cursor-pointer" : "";
    
    if (typeof rowClassName === "function") {
      return cn(baseClasses, clickableClasses, rowClassName(record, index));
    }
    
    return cn(baseClasses, clickableClasses, rowClassName);
  };

  const handleRowClick = (record: T, index: number) => {
    if (onRowClick) {
      onRowClick(record, index);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border border-gray-200 rounded-lg overflow-hidden", className)}>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={cn(
                  "px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider",
                  column.className
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-8 text-center text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={record.id || index}
                className={getRowClassName(record, index)}
                onClick={() => handleRowClick(record, index)}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className="px-4 py-3 text-sm text-gray-600"
                  >
                    {column.render
                      ? column.render(record[column.key], record, index)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

// Export individual table components for backward compatibility
export const Table = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
  <table className={cn("w-full", className)} {...props}>
    {children}
  </table>
);

export const TableHeader = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={cn("bg-gray-50 border-b border-gray-200", className)} {...props}>
    {children}
  </thead>
);

export const TableBody = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={cn("bg-white divide-y divide-gray-200", className)} {...props}>
    {children}
  </tbody>
);

export const TableRow = ({ children, className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn("hover:bg-gray-50", className)} {...props}>
    {children}
  </tr>
);

export const TableHead = ({ children, className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={cn(
      "px-4 py-3 text-left text-sm font-medium text-gray-900 tracking-wider",
      className
    )}
    {...props}
  >
    {children}
  </th>
);

export const TableCell = ({ children, className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn("px-4 py-3 text-sm text-gray-600", className)} {...props}>
    {children}
  </td>
);
