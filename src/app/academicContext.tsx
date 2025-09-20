import React, { createContext, useContext, ReactNode } from 'react';

// Types for the context
interface AcademicYear {
  id?: string;
  uuid?: string;
  name?: string;
  title?: string;
  year?: string;
  code?: string;
  isCurrent?: boolean;
  isActive?: boolean;
}

interface Semester {
  id?: string;
  uuid?: string;
  name?: string;
  title?: string;
  semester?: string;
  code?: string;
  isActive?: boolean;
  isCurrent?: boolean;
  semesterNumber?: number;
}

// Context value interface
interface AcademicContextValue {
  // Academic Year data
  academicYears: AcademicYear[];
  selectedYear: string;
  selectedYearData: AcademicYear | null;
  
  // Semester data
  academicSemesters: Semester[];
  selectedSemester: string;
  selectedSemesterData: Semester | null;
  
  // Loading states
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setSelectedYear: (yearId: string) => void;
  setSelectedSemester: (semesterId: string) => void;
}

// Create the context
const AcademicContext = createContext<AcademicContextValue | null>(null);

// Provider props interface
interface AcademicContextProviderProps {
  children: ReactNode;
  // These will be passed from the header component
  academicYears: AcademicYear[];
  selectedYear: string;
  academicSemesters: Semester[];
  selectedSemester: string;
  isLoading: boolean;
  error: string | null;
  onYearChange: (yearId: string) => void;
  onSemesterChange: (semesterId: string) => void;
}

// Provider component
export const AcademicContextProvider: React.FC<AcademicContextProviderProps> = ({
  children,
  academicYears,
  selectedYear,
  academicSemesters,
  selectedSemester,
  isLoading,
  error,
  onYearChange,
  onSemesterChange,
}) => {
  // Find the selected year and semester data
  const selectedYearData = academicYears.find(
    year => (year.id === selectedYear || year.uuid === selectedYear)
  ) || null;
  
  const selectedSemesterData = academicSemesters.find(
    semester => (semester.id === selectedSemester || semester.uuid === selectedSemester)
  ) || null;

  const contextValue: AcademicContextValue = {
    academicYears,
    selectedYear,
    selectedYearData,
    academicSemesters,
    selectedSemester,
    selectedSemesterData,
    isLoading,
    error,
    setSelectedYear: onYearChange,
    setSelectedSemester: onSemesterChange,
  };

  return (
    <AcademicContext.Provider value={contextValue}>
      {children}
    </AcademicContext.Provider>
  );
};

// Custom hook to use the academic context
export const useAcademicContext = (): AcademicContextValue => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademicContext must be used within an AcademicContextProvider');
  }
  return context;
};

// Custom hook specifically for accessing the current academic year ID (most common use case)
export const useCurrentAcademicYearId = (): string => {
  const { selectedYear } = useAcademicContext();
  return selectedYear;
};

// Custom hook for accessing both year and semester IDs
export const useCurrentAcademicSelection = () => {
  const { selectedYear, selectedSemester, selectedYearData, selectedSemesterData } = useAcademicContext();
  return {
    academicYearId: selectedYear,
    semesterId: selectedSemester,
    academicYearData: selectedYearData,
    semesterData: selectedSemesterData,
  };
};

// Export types for use in other components
export type { AcademicYear, Semester, AcademicContextValue };