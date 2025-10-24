import { useState, useEffect } from "react";
import { transcriptsApi, AcademicGroup, StudentEnrollment } from "@/lib/transcripts/all-groups-api";
import { useAuth } from "@/contexts/AuthContext";

interface UseTranscriptsReturn {
  groups: AcademicGroup[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseTranscriptsParams {
  academicYearId: string;
}

export const useTranscripts = ({ academicYearId }: UseTranscriptsParams): UseTranscriptsReturn => {
  const [groups, setGroups] = useState<AcademicGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getDepartmentId, isLoading: authLoading, isAuthenticated } = useAuth();

  const fetchGroups = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Wait a bit for auth to fully initialize if still loading
      if (authLoading) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const departmentId = getDepartmentId();
      if (!departmentId) {
        throw new Error("Department ID not found. Please ensure you are logged in and have proper permissions.");
      }

      console.log("Fetching academic groups with department ID:", departmentId);
      const response = await transcriptsApi.getAcademicGroups(departmentId, academicYearId);
      
      if (response.success) {
        setGroups(response.data);
        console.log("Successfully fetched academic groups:", response.data.length);
      } else {
        throw new Error(response.message || "Failed to fetch academic groups");
      }
    } catch (err: any) {
      console.error("Error fetching academic groups:", err);
      setError(err.message || "Failed to fetch academic groups");
      setGroups([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we have academicYearId and user is authenticated
    if (!academicYearId) {
      setIsLoading(false);
      setError(null);
      return;
    }
    
    if (!isAuthenticated) {
      setIsLoading(false);
      setError("Please log in to access transcripts");
      return;
    }
    
    // If auth is still loading, wait for it to complete
    if (authLoading) {
      setIsLoading(true);
      return;
    }
    
    fetchGroups();
  }, [academicYearId, isAuthenticated, authLoading]);

  const refetch = async () => {
    await fetchGroups();
  };

  return {
    groups,
    isLoading,
    error,
    refetch,
  };
};

interface UseStudentEnrollmentsReturn {
  enrollments: StudentEnrollment[];
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseStudentEnrollmentsParams {
  groupId: string;
}

export const useStudentEnrollments = ({ groupId }: UseStudentEnrollmentsParams): UseStudentEnrollmentsReturn => {
  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await transcriptsApi.getStudentEnrollmentsByGroup(groupId);
      
      if (response.success) {
        setEnrollments(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch student enrollments");
      }
    } catch (err: any) {
      console.error("Error fetching student enrollments:", err);
      setError(err.message || "Failed to fetch student enrollments");
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (groupId) {
      fetchEnrollments();
    }
  }, [groupId]);

  const refetch = async () => {
    await fetchEnrollments();
  };

  return {
    enrollments,
    isLoading,
    error,
    refetch,
  };
};