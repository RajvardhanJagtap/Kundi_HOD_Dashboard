import { api } from "@/lib/api";

export interface Lecturer {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  middleName: string | null;
  fullName: string;
  phoneNumber: string;
  profilePictureUrl: string | null;
  userType: string;
  accountStatus: string;
  authProvider: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLoginAt: string;
  passwordChangedAt: string;
  accountLockedUntil: string | null;
  failedLoginAttempts: number;
  termsAcceptedAt: string | null;
  privacyPolicyAcceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  deletedAt: string | null;
  deletedBy: string | null;
  roles: any[];
  attributes: {
    DEPARTMENT_ID: string;
    STAFF_NUMBER: string;
  };
  isDeleted: boolean;
  isAccountLocked: boolean;
  isAccountActive: boolean;
}

export interface LecturersResponse {
  success: boolean;
  message: string;
  data: Lecturer[];
  timestamp: string;
}

export interface Module {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  contactHours: number;
  lectureHours: number;
  tutorialHours: number;
  practicalHours: number;
  selfStudyHours: number;
  level: number;
  semesterOffered: number;
  isCore: boolean;
  isElective: boolean;
  isActive: boolean;
  prerequisites: string;
  learningOutcomes: string;
  assessmentMethods: string;
  recommendedTextbooks: string;
  minimumPassMark: number;
  maximumRetakes: number;
  departmentId: string;
  departmentName: string;
  departmentCode: string;
  schoolName: string;
  collegeName: string;
  institutionName: string;
  fullName: string;
  levelDescription: string;
  totalContactHours: number;
  totalStudyHours: number;
  workloadPerCredit: number;
  requiresPracticalWork: boolean;
  hasPrerequisites: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  totalProgramModules: number;
  totalAssignments: number;
  totalMaterials: number;
}

export interface ModulesResponse {
  success: boolean;
  message: string;
  data: Module[];
  timestamp: string;
}

export interface ModuleAssignment {
  id: string;
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleCredits: number;
  instructorId: string;
  instructorName: string;
  instructorEmail: string;
  groupId: string;
  groupCode: string;
  groupName: string;
  academicYearId: string;
  academicYearName: string;
  semesterId: string;
  semesterName: string;
  semesterNumber: number;
  programId: string | null;
  programName: string | null;
  programCode: string | null;
  yearLevel: number | null;
  assignmentDate: string;
  startDate: string;
  endDate: string;
  creditHours: number | null;
  contactHours: number;
  assignmentType: string;
  notes: string;
  isActive: boolean;
  isPrimary: boolean;
  teachingMethods: string | null;
  assessmentMethods: string | null;
  venue: string | null;
  schedule: string | null;
  maxStudents: number;
  currentEnrollment: number;
  status: string;
  departmentName: string;
  schoolName: string;
  collegeName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
}

export interface ModuleAssignmentsResponse {
  success: boolean;
  message: string;
  data: ModuleAssignment[];
  timestamp: string;
}

export interface CreateModuleAssignmentRequest {
  moduleId: string;
  instructorId: string;
  groupId: string;
  academicYearId: string;
  semesterId: string;
  assignmentDate: string;
  startDate: string;
  endDate: string;
  creditHours: string;
  contactHours: string;
  assignmentType: string;
  notes: string;
  isActive: string;
  isPrimary: string;
  teachingMethods: string;
  assessmentMethods: string;
  venue: string;
  schedule: string;
  maxStudents: string;
  currentEnrollment: string;
}

export interface CreateModuleAssignmentResponse {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
}

export interface UpdateModuleAssignmentRequest {
  assignmentId: string;
  newLecturerId: string;
  reason?: string;
}

export interface UpdateModuleAssignmentResponse {
  success: boolean;
  message: string;
  data: any;
  timestamp: string;
}

export const moduleAssignmentsApi = {
  /**
   * Get lecturers by department
   * @param departmentId - The department ID
   * @returns Promise<LecturersResponse>
   */
  getLecturersByDepartment: async (departmentId: string): Promise<LecturersResponse> => {
    const response = await api.get<LecturersResponse>(
      `/users/department/${departmentId}/lecturers`
    );
    return response.data;
  },

  /**
   * Get active modules by department
   * @param departmentId - The department ID
   * @returns Promise<ModulesResponse>
   */
  getActiveModulesByDepartment: async (departmentId: string): Promise<ModulesResponse> => {
    const response = await api.get<ModulesResponse>(
      `/academics/modules/department/${departmentId}/active`
    );
    return response.data;
  },

  /**
   * Get module assignments by department groups
   * @param departmentId - The department ID
   * @param academicYearId - The academic year ID
   * @returns Promise<ModuleAssignmentsResponse>
   */
  getModuleAssignmentsByDepartment: async (departmentId: string, academicYearId: string): Promise<ModuleAssignmentsResponse> => {
    const response = await api.get<ModuleAssignmentsResponse>(
      `/academics/module-assignments/department/${departmentId}/groups?academicYearId=${academicYearId}`
    );
    return response.data;
  },

  /**
   * Create module assignment
   * @param data - The module assignment data
   * @returns Promise<CreateModuleAssignmentResponse>
   */
  createModuleAssignment: async (data: CreateModuleAssignmentRequest): Promise<CreateModuleAssignmentResponse> => {
    const response = await api.post<CreateModuleAssignmentResponse>(
      '/academics/module-assignments',
      data
    );
    return response.data;
  },

  /**
   * Update/Transfer module assignment to a new lecturer
   * @param moduleAssignmentId - The module assignment ID
   * @param data - The update data (assignmentId/semesterId, newLecturerId, reason)
   * @returns Promise<UpdateModuleAssignmentResponse>
   */
  updateModuleAssignment: async (
    moduleAssignmentId: string, 
    data: UpdateModuleAssignmentRequest
  ): Promise<UpdateModuleAssignmentResponse> => {
    const { assignmentId, newLecturerId, reason = 'Reassignment by HOD' } = data;
    
    const response = await api.put<UpdateModuleAssignmentResponse>(
      `/academics/module-assignments/${moduleAssignmentId}/transfer?assignmentId=${assignmentId}&newLecturerId=${newLecturerId}&reason=${encodeURIComponent(reason)}`
    );
    return response.data;
  },
};