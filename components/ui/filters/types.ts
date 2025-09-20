// Filter-related TypeScript interfaces and types

export interface School {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface Department {
  id: string;
  name: string;
  code?: string;
  schoolId: string;
  description?: string;
}

export interface Program {
  id: string;
  name: string;
  code?: string;
  departmentId: string;
  level?: string; // e.g., "Undergraduate", "Graduate", "Postgraduate"
  duration?: string; // e.g., "4 years"
  description?: string;
}

export interface FilterState {
  school: string;
  department: string;
  program: string;
  searchTerm?: string;
}

export interface FilterOptions {
  schools: School[];
  departments: Department[];
  programs: Program[];
}

export interface FilterProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  showAll?: boolean;
  allLabel?: string;
}

export interface CascadingFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  options: FilterOptions;
  isLoading?: boolean;
  showSearch?: boolean;
  searchPlaceholder?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}
