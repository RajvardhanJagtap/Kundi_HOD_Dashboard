import { useState, useEffect } from "react";
import { 
  moduleAssignmentsApi, 
  Lecturer, 
  Module, 
  ModuleAssignment,
  CreateModuleAssignmentRequest,
  UpdateModuleAssignmentRequest 
} from "@/lib/modules-assignment/module-assignments-api";
import { useAuth } from "@/contexts/AuthContext";

interface UseLecturersReturn {
  lecturers: Lecturer[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useLecturersByDepartment = (): UseLecturersReturn => {
  const [lecturers, setLecturers] = useState<Lecturer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDepartmentId } = useAuth();

  const fetchLecturers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const departmentId = getDepartmentId();
      if (!departmentId) {
        throw new Error("Department ID not found");
      }

      const response = await moduleAssignmentsApi.getLecturersByDepartment(departmentId);
      
      if (response.success) {
        setLecturers(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch lecturers");
      }
    } catch (err: any) {
      console.error("Error fetching lecturers:", err);
      setError(err.message || "Failed to fetch lecturers");
      setLecturers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLecturers();
  }, []);

  const refetch = async () => {
    await fetchLecturers();
  };

  return {
    lecturers,
    isLoading,
    error,
    refetch,
  };
};

interface UseModulesReturn {
  modules: Module[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useModulesByDepartment = (): UseModulesReturn => {
  const [modules, setModules] = useState<Module[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDepartmentId } = useAuth();

  const fetchModules = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const departmentId = getDepartmentId();
      if (!departmentId) {
        throw new Error("Department ID not found");
      }

      const response = await moduleAssignmentsApi.getActiveModulesByDepartment(departmentId);
      
      if (response.success) {
        setModules(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch modules");
      }
    } catch (err: any) {
      console.error("Error fetching modules:", err);
      setError(err.message || "Failed to fetch modules");
      setModules([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  const refetch = async () => {
    await fetchModules();
  };

  return {
    modules,
    isLoading,
    error,
    refetch,
  };
};

interface UseModuleAssignmentsReturn {
  assignments: ModuleAssignment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseModuleAssignmentsParams {
  academicYearId: string;
}

export const useModuleAssignments = ({ academicYearId }: UseModuleAssignmentsParams): UseModuleAssignmentsReturn => {
  const [assignments, setAssignments] = useState<ModuleAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDepartmentId } = useAuth();

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const departmentId = getDepartmentId();
      if (!departmentId) {
        throw new Error("Department ID not found");
      }

      if (!academicYearId) {
        setAssignments([]);
        return;
      }

      const response = await moduleAssignmentsApi.getModuleAssignmentsByDepartment(departmentId, academicYearId);
      
      if (response.success) {
        setAssignments(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch module assignments");
      }
    } catch (err: any) {
      console.error("Error fetching module assignments:", err);
      setError(err.message || "Failed to fetch module assignments");
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (academicYearId) {
      fetchAssignments();
    }
  }, [academicYearId]);

  const refetch = async () => {
    await fetchAssignments();
  };

  return {
    assignments,
    isLoading,
    error,
    refetch,
  };
};

interface UseCreateModuleAssignmentReturn {
  createAssignment: (data: CreateModuleAssignmentRequest) => Promise<void>;
  isCreating: boolean;
  error: string | null;
}

export const useCreateModuleAssignment = (): UseCreateModuleAssignmentReturn => {
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssignment = async (data: CreateModuleAssignmentRequest) => {
    try {
      setIsCreating(true);
      setError(null);

      const response = await moduleAssignmentsApi.createModuleAssignment(data);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to create module assignment");
      }
    } catch (err: any) {
      console.error("Error creating module assignment:", err);
      setError(err.message || "Failed to create module assignment");
      throw err;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createAssignment,
    isCreating,
    error,
  };
};

interface UseUpdateModuleAssignmentReturn {
  updateAssignment: (moduleAssignmentId: string, data: UpdateModuleAssignmentRequest) => Promise<void>;
  isUpdating: boolean;
  error: string | null;
}

export const useUpdateModuleAssignment = (): UseUpdateModuleAssignmentReturn => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAssignment = async (moduleAssignmentId: string, data: UpdateModuleAssignmentRequest) => {
    try {
      setIsUpdating(true);
      setError(null);

      const response = await moduleAssignmentsApi.updateModuleAssignment(moduleAssignmentId, data);
      
      if (!response.success) {
        throw new Error(response.message || "Failed to update module assignment");
      }
    } catch (err: any) {
      console.error("Error updating module assignment:", err);
      setError(err.message || "Failed to update module assignment");
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateAssignment,
    isUpdating,
    error,
  };
};