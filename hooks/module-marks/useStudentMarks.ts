import { useState, useEffect, useCallback } from 'react';
import { studentMarksApi, ModuleMarksheet, StudentMark } from '@/lib/module-marks/student-marks-api';

interface UseStudentMarksState {
  data: ModuleMarksheet | null;
  loading: boolean;
  error: string | null;
  submitting: boolean;
  publishing: boolean;
  exporting: boolean;
}

interface UseStudentMarksReturn extends UseStudentMarksState {
  fetchModuleMarksheet: (moduleAssignmentId: string) => Promise<void>;
  submitToDean: (moduleAssignmentId: string) => Promise<boolean>;
  publishToStudents: (moduleAssignmentId: string) => Promise<boolean>;
  exportExcel: (moduleAssignmentId: string) => Promise<void>;
  updateMarks: (moduleAssignmentId: string, marks: Partial<StudentMark>[]) => Promise<boolean>;
  refetch: () => Promise<void>;
  clearError: () => void;
}

export const useStudentMarks = (moduleAssignmentId?: string): UseStudentMarksReturn => {
  const [state, setState] = useState<UseStudentMarksState>({
    data: null,
    loading: false,
    error: null,
    submitting: false,
    publishing: false,
    exporting: false,
  });

  const [currentModuleId, setCurrentModuleId] = useState<string | undefined>(moduleAssignmentId);

  const fetchModuleMarksheet = useCallback(async (id: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setCurrentModuleId(id);
      
      const response = await studentMarksApi.getModuleMarksheet(id);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Failed to fetch module marksheet',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching module marksheet',
      }));
    }
  }, []);

  const submitToDean = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, submitting: true, error: null }));
      
      const response = await studentMarksApi.submitMarksToDean(id);
      
      if (response.success) {
        // Update local state to reflect submission
        setState(prev => ({
          ...prev,
          data: prev.data ? {
            ...prev.data,
            isSubmittedToDean: true
          } : null,
          submitting: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          submitting: false,
          error: response.message || 'Failed to submit marks to dean',
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        submitting: false,
        error: error instanceof Error ? error.message : 'An error occurred while submitting to dean',
      }));
      return false;
    }
  }, []);

  const publishToStudents = useCallback(async (id: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, publishing: true, error: null }));
      
      const response = await studentMarksApi.publishMarksToStudents(id);
      
      if (response.success) {
        // Update local state to reflect publication
        setState(prev => ({
          ...prev,
          data: prev.data ? {
            ...prev.data,
            isPublished: true
          } : null,
          publishing: false,
        }));
        return true;
      } else {
        setState(prev => ({
          ...prev,
          publishing: false,
          error: response.message || 'Failed to publish marks to students',
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        publishing: false,
        error: error instanceof Error ? error.message : 'An error occurred while publishing marks',
      }));
      return false;
    }
  }, []);

  const exportExcel = useCallback(async (id: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, exporting: true, error: null }));
      
      const blob = await studentMarksApi.exportMarksExcel(id);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `module-marks-${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      setState(prev => ({ ...prev, exporting: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        exporting: false,
        error: error instanceof Error ? error.message : 'An error occurred while exporting marks',
      }));
    }
  }, []);

  const updateMarks = useCallback(async (id: string, marks: Partial<StudentMark>[]): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, error: null }));
      
      const response = await studentMarksApi.updateStudentMarks(id, marks);
      
      if (response.success) {
        // Refetch the data to get updated marks
        await fetchModuleMarksheet(id);
        return true;
      } else {
        setState(prev => ({
          ...prev,
          error: response.message || 'Failed to update marks',
        }));
        return false;
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'An error occurred while updating marks',
      }));
      return false;
    }
  }, [fetchModuleMarksheet]);

  const refetch = useCallback(async () => {
    if (currentModuleId) {
      await fetchModuleMarksheet(currentModuleId);
    }
  }, [fetchModuleMarksheet, currentModuleId]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch data on mount if moduleAssignmentId is provided
  useEffect(() => {
    if (moduleAssignmentId) {
      fetchModuleMarksheet(moduleAssignmentId);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    fetchModuleMarksheet,
    submitToDean,
    publishToStudents,
    exportExcel,
    updateMarks,
    refetch,
    clearError,
  };
};

// Hook for marks statistics
export const useMarksStatistics = (moduleAssignmentId: string) => {
  const [state, setState] = useState<{
    data: any;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStatistics = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await studentMarksApi.getMarksStatistics(moduleAssignmentId);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data,
          loading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to fetch marks statistics',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching statistics',
      }));
    }
  }, [moduleAssignmentId]);

  useEffect(() => {
    if (moduleAssignmentId) {
      fetchStatistics();
    }
  }, [moduleAssignmentId, fetchStatistics]);

  return {
    ...state,
    refetch: fetchStatistics,
  };
};