"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X, GraduationCap, Building, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

import { SchoolFilter, DepartmentFilter, ProgramFilter } from './individual-filters';
import { 
  CascadingFiltersProps, 
  FilterState, 
  FilterOptions,
  School,
  Department,
  Program
} from './types';

export function CascadingFilters({
  filters,
  onFiltersChange,
  options,
  isLoading = false,
  showSearch = true,
  searchPlaceholder = "Search...",
  orientation = 'horizontal',
  className = "",
}: CascadingFiltersProps) {
  
  // Filter departments based on selected school
  const filteredDepartments = React.useMemo(() => {
    if (filters.school === 'all' || !filters.school) {
      return options.departments;
    }
    return options.departments.filter(dept => dept.schoolId === filters.school);
  }, [filters.school, options.departments]);

  // Filter programs based on selected department
  const filteredPrograms = React.useMemo(() => {
    if (filters.department === 'all' || !filters.department) {
      // If no specific department, show programs from all departments in selected school
      if (filters.school === 'all' || !filters.school) {
        return options.programs;
      }
      const schoolDepartmentIds = filteredDepartments.map(dept => dept.id);
      return options.programs.filter(program => schoolDepartmentIds.includes(program.departmentId));
    }
    return options.programs.filter(program => program.departmentId === filters.department);
  }, [filters.department, filters.school, filteredDepartments, options.programs]);

  // Reset dependent filters when parent filter changes
  const handleSchoolChange = (schoolId: string) => {
    onFiltersChange({
      ...filters,
      school: schoolId,
      department: 'all', // Reset department when school changes
      program: 'all', // Reset program when school changes
    });
  };

  const handleDepartmentChange = (departmentId: string) => {
    onFiltersChange({
      ...filters,
      department: departmentId,
      program: 'all', // Reset program when department changes
    });
  };

  const handleProgramChange = (programId: string) => {
    onFiltersChange({
      ...filters,
      program: programId,
    });
  };

  const handleSearchChange = (searchTerm: string) => {
    onFiltersChange({
      ...filters,
      searchTerm,
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      school: 'all',
      department: 'all',
      program: 'all',
      searchTerm: '',
    });
  };

  const hasActiveFilters = filters.school !== 'all' || 
                          filters.department !== 'all' || 
                          filters.program !== 'all' || 
                          (filters.searchTerm && filters.searchTerm.length > 0);

  if (isLoading) {
    return (
      <Card className={cn("border border-gray-200 shadow-sm", className)}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className={cn(
              "grid gap-4",
              orientation === 'horizontal' 
                ? "grid-cols-1 sm:grid-cols-3" 
                : "grid-cols-1"
            )}>
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
              <Skeleton className="h-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("border border-gray-200 shadow-sm", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Input */}
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={filters.searchTerm || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 border-gray-300 focus:border-[#026892] focus:ring-[#026892]"
              />
            </div>
          )}

          {/* Filter Controls */}
          <div className={cn(
            "grid gap-4",
            orientation === 'horizontal' 
              ? "grid-cols-1 sm:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {/* School Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <GraduationCap className="h-4 w-4" />
                School
              </label>
              <SchoolFilter
                schools={options.schools}
                value={filters.school}
                onValueChange={handleSchoolChange}
                className="border-gray-300 focus:border-[#026892] focus:ring-[#026892]"
              />
            </div>

            {/* Department Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Building className="h-4 w-4" />
                Department
              </label>
              <DepartmentFilter
                departments={filteredDepartments}
                value={filters.department}
                onValueChange={handleDepartmentChange}
                className="border-gray-300 focus:border-[#026892] focus:ring-[#026892]"
                disabled={filters.school === 'all'}
              />
            </div>

            {/* Program Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                Program
              </label>
              <ProgramFilter
                programs={filteredPrograms}
                value={filters.program}
                onValueChange={handleProgramChange}
                className="border-gray-300 focus:border-[#026892] focus:ring-[#026892]"
                disabled={filters.department === 'all'}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={clearAllFilters}
                className="gap-2 text-gray-600 hover:text-gray-900"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Export individual components for standalone use
export { SchoolFilter, DepartmentFilter, ProgramFilter };
