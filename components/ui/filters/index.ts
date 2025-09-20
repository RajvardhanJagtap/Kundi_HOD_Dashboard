// Export all filter components and types
export * from './types';
export * from './individual-filters';
export * from './cascading-filters';

// Main exports
export { CascadingFilters } from './cascading-filters';
export { SchoolFilter, DepartmentFilter, ProgramFilter } from './individual-filters';
export type { 
  School, 
  Department, 
  Program, 
  FilterState, 
  FilterOptions, 
  FilterProps,
  CascadingFiltersProps 
} from './types';
