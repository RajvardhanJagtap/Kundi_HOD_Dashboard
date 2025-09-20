// Individual filter components
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { School, Department, Program, FilterProps } from './types';

interface SchoolFilterProps extends FilterProps {
  schools: School[];
}

export function SchoolFilter({ 
  schools, 
  value, 
  onValueChange, 
  placeholder = "Select School", 
  disabled = false,
  className = "",
  showAll = true,
  allLabel = "All Schools"
}: SchoolFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">{allLabel}</SelectItem>
        )}
        {schools.map((school) => (
          <SelectItem key={school.id} value={school.id}>
            {school.name} {school.code && `(${school.code})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface DepartmentFilterProps extends FilterProps {
  departments: Department[];
}

export function DepartmentFilter({ 
  departments, 
  value, 
  onValueChange, 
  placeholder = "Select Department", 
  disabled = false,
  className = "",
  showAll = true,
  allLabel = "All Departments"
}: DepartmentFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">{allLabel}</SelectItem>
        )}
        {departments.map((department) => (
          <SelectItem key={department.id} value={department.id}>
            {department.name} {department.code && `(${department.code})`}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

interface ProgramFilterProps extends FilterProps {
  programs: Program[];
}

export function ProgramFilter({ 
  programs, 
  value, 
  onValueChange, 
  placeholder = "Select Program", 
  disabled = false,
  className = "",
  showAll = true,
  allLabel = "All Programs"
}: ProgramFilterProps) {
  return (
    <Select value={value} onValueChange={onValueChange} disabled={disabled}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {showAll && (
          <SelectItem value="all">{allLabel}</SelectItem>
        )}
        {programs.map((program) => (
          <SelectItem key={program.id} value={program.id}>
            {program.name} {program.code && `(${program.code})`}
            {program.level && (
              <span className="text-xs text-gray-500 ml-1">- {program.level}</span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
