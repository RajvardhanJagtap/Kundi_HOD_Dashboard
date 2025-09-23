import { useAuth } from "@/contexts/AuthContext";

/**
 * Custom hook to get the current user's school ID
 * @returns The department ID or null if not available
 */
export const useSchoolId = (): string | null => {
  const { departmentId } = useAuth();
  return departmentId;
};

/**
 * Utility function to get department ID from user object
 * @param user - User object containing attributes
 * @returns The department ID or null if not available
 */
export const getDepartmentIdFromUser = (user: any): string | null => {
  return user?.attributes?.DEPARTMENT_ID || null;
};

/**
 * Utility function to get department ID from localStorage (for non-React contexts)
 * @returns The department ID or null if not available
 */
export const getDepartmentIdFromStorage = (): string | null => {
  if (typeof window === "undefined") return null;
  
  try {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      return user?.attributes?.DEPARTMENT_ID || null;
    }
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
  }
  
  return null;
};
