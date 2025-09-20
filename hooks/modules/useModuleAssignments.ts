import { useState, useEffect, useCallback } from 'react';
import { 
  moduleAssignmentsApi, 
  ModuleAssignment, 
  ModuleAssignmentsParams,
  ModuleSubmissionDetails,
  ModuleSubmissionDetailsResponse,
  ModuleSubmissionDetailsListResponse
} from '@/lib/modules/moduleAssignmentsApi';

interface UseModuleAssignmentsState {
  data: ModuleAssignment[];
  loading: boolean;
  error: string | null;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface UseModuleAssignmentsReturn extends UseModuleAssignmentsState {
  fetchModuleAssignments: (params?: ModuleAssignmentsParams) => Promise<void>;
  refetch: () => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;
  clearError: () => void;
}

export const useModuleAssignments = (initialParams?: ModuleAssignmentsParams): UseModuleAssignmentsReturn => {
  const [state, setState] = useState<UseModuleAssignmentsState>({
    data: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    hasNext: false,
    hasPrevious: false,
  });

  const [params, setParams] = useState<ModuleAssignmentsParams>(initialParams || {});

  const fetchModuleAssignments = useCallback(async (newParams?: ModuleAssignmentsParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const queryParams = { ...params, ...newParams };
      const response = await moduleAssignmentsApi.getModuleAssignments(queryParams);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data.content,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          currentPage: response.data.page,
          pageSize: response.data.size,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
          loading: false,
          error: null,
        }));
        
        if (newParams) {
          setParams(prev => ({ ...prev, ...newParams }));
        }
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Failed to fetch module assignments',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching module assignments',
      }));
    }
  }, [params]);

  const refetch = useCallback(() => fetchModuleAssignments(), [fetchModuleAssignments]);

  const setPage = useCallback((page: number) => {
    fetchModuleAssignments({ ...params, page });
  }, [params, fetchModuleAssignments]);

  const setPageSize = useCallback((size: number) => {
    fetchModuleAssignments({ ...params, size, page: 0 });
  }, [params, fetchModuleAssignments]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchModuleAssignments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ...state,
    fetchModuleAssignments,
    refetch,
    setPage,
    setPageSize,
    clearError,
  };
};

// Hook for fetching module assignments by instructor
export const useModuleAssignmentsByInstructor = (instructorId: string, initialParams?: ModuleAssignmentsParams) => {
  const [state, setState] = useState<UseModuleAssignmentsState>({
    data: [],
    loading: false,
    error: null,
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    pageSize: 20,
    hasNext: false,
    hasPrevious: false,
  });

  const fetchByInstructor = useCallback(async (params?: ModuleAssignmentsParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await moduleAssignmentsApi.getModuleAssignmentsByInstructor(instructorId, params);
      
      if (response.success) {
        setState(prev => ({
          ...prev,
          data: response.data.content,
          totalElements: response.data.totalElements,
          totalPages: response.data.totalPages,
          currentPage: response.data.page,
          pageSize: response.data.size,
          hasNext: response.data.hasNext,
          hasPrevious: response.data.hasPrevious,
          loading: false,
          error: null,
        }));
      } else {
        setState(prev => ({
          ...prev,
          loading: false,
          error: response.message || 'Failed to fetch instructor module assignments',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching instructor module assignments',
      }));
    }
  }, [instructorId]);

  useEffect(() => {
    if (instructorId) {
      fetchByInstructor(initialParams);
    }
  }, [instructorId, fetchByInstructor]);

  return {
    ...state,
    fetchModuleAssignments: fetchByInstructor,
    refetch: () => fetchByInstructor(initialParams),
  };
};

// Hook for fetching a single module assignment
export const useModuleAssignment = (id: string) => {
  const [state, setState] = useState<{
    data: ModuleAssignment | null;
    loading: boolean;
    error: string | null;
  }>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchModuleAssignment = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await moduleAssignmentsApi.getModuleAssignmentById(id);
      
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
          error: response.message || 'Failed to fetch module assignment',
        }));
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'An error occurred while fetching module assignment',
      }));
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchModuleAssignment();
    }
  }, [id, fetchModuleAssignment]);

  return {
    ...state,
    refetch: fetchModuleAssignment,
  };
};

// Hook for fetching module submission details
export const useModuleSubmissionDetails = () => {
  const [state, setState] = useState<{
    data: ModuleSubmissionDetails[];
    loading: boolean;
    error: string | null;
  }>({
    data: [],
    loading: false,
    error: null,
  });

  const fetchAllSubmissionDetails = useCallback(async (params?: ModuleAssignmentsParams) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      const response = await moduleAssignmentsApi.getAllModuleSubmissionDetails(params);
      
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
          error: response.message || 'Failed to fetch submission details',
        }));
      }
    } catch (error: any) {
      console.error('Error in fetchAllSubmissionDetails:', error);
      let errorMessage = 'An error occurred while fetching submission details';
      
      if (error.response?.status === 400) {
        errorMessage = 'Bad request - please check the API parameters';
      } else if (error.response?.status === 401) {
        errorMessage = 'Unauthorized - please check your authentication';
      } else if (error.response?.status === 404) {
        errorMessage = 'API endpoint not found';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error - please try again later';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
    }
  }, []);

  const fetchSubmissionDetails = useCallback(async (moduleId: string): Promise<ModuleSubmissionDetailsResponse> => {
    try {
      const response = await moduleAssignmentsApi.getModuleSubmissionDetails(moduleId);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...state,
    fetchAllSubmissionDetails,
    fetchSubmissionDetails,
    clearError,
    refetch: () => fetchAllSubmissionDetails(),
  };
};