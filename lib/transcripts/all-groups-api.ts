import { api } from "@/lib/api";

export interface AcademicGroup {
  id: string;
  name: string;
  code: string;
  description: string;
  yearLevel: number;
  capacity: number;
  currentEnrollment: number;
  startDate: string;
  expectedGraduationDate: string;
  isActive: boolean;
  isFull: boolean;
  admissionYear: number;
  programId: string | null;
  programName: string | null;
  programCode: string | null;
  departmentName: string | null;
  schoolName: string | null;
  collegeName: string | null;
  currentSemesterId: string | null;
  currentSemesterName: string | null;
  currentSemesterNumber: number | null;
  fullName: string | null;
  displayName: string | null;
  academicLevel: string | null;
  uniqueIdentifier: string | null;
  availableSpots: number | null;
  enrollmentPercentage: number | null;
  hasAvailableSpots: boolean | null;
  isOverenrolled: boolean | null;
  isFirstYear: boolean | null;
  isFinalYear: boolean | null;
  expectedGraduationYear: number | null;
  remainingYears: number | null;
  programCompletionPercentage: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  totalActiveEnrollments: number | null;
  totalGraduatedStudents: number | null;
}

export interface AcademicGroupsResponse {
  success: boolean;
  message: string;
  data: AcademicGroup[];
  timestamp: string;
}

export interface ModuleEnrollment {
  id: string;
  enrollmentType: string;
  enrollmentDate: string;
  isActive: boolean;
  attemptNumber: number;
  previousAttemptId: string | null;
  completionDate: string | null;
  isCompleted: boolean;
  finalGrade: string | null;
  remarks: string;
  studentEnrollmentId: string;
  studentName: string;
  enrollmentNumber: string;
  moduleId: string;
  moduleCode: string;
  moduleName: string;
  moduleCredits: number;
  groupId: string;
  groupName: string;
  academicYearId: string;
  academicYearName: string;
  currentSemesterId: string;
  currentSemesterName: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  enrollmentTypeDisplay: string | null;
  enrollmentStatus: string | null;
  canComplete: boolean | null;
  canRetake: boolean | null;
}

export interface StudentEnrollment {
  id: string;
  enrollmentNumber: string;
  enrollmentDate: string;
  expectedGraduationDate: string;
  actualGraduationDate: string | null;
  currentYearLevel: number;
  isActive: boolean;
  isGraduated: boolean;
  isDroppedOut: boolean;
  isSuspended: boolean;
  isTransferred: boolean;
  cumulativeGpa: number;
  totalCreditsEarned: number;
  totalCreditsAttempted: number;
  statusChangeDate: string | null;
  statusChangeReason: string | null;
  feesStatus: string;
  scholarshipAwarded: boolean;
  scholarshipDetails: string;
  promotionStatus: string;
  studentType: string;
  totalFailedCredits: number;
  currentFailedCredits: number;
  promotionDecisionDate: string | null;
  promotionDecidedBy: string | null;
  promotionDecidedByName: string | null;
  studentId: string;
  studentFirstName: string | null;
  studentLastName: string | null;
  studentFullName: string;
  studentEmail: string | null;
  studentPhoneNumber: string | null;
  groupId: string;
  groupName: string;
  groupCode: string | null;
  groupYearLevel: number | null;
  programId: string;
  programName: string;
  programCode: string | null;
  departmentName: string | null;
  schoolName: string | null;
  collegeName: string | null;
  academicYearId: string;
  academicYearName: string | null;
  academicYearCode: string | null;
  currentSemesterId: string;
  currentSemesterName: string | null;
  currentSemesterNumber: number | null;
  failedModules: string[];
  retakeModules: string[];
  currentModuleEnrollments: string[];
  moduleEnrollments: ModuleEnrollment[];
  failedModuleDetails: any[];
  retakeModuleDetails: any[];
  enrollmentStatus: string | null;
  enrollmentStatusDescription: string | null;
  completionPercentage: number | null;
  remainingSemesters: number | null;
  gpaCategory: string | null;
  academicPerformanceStatus: string | null;
  successRate: number | null;
  isOnAcademicProbation: boolean | null;
  isEligibleForGraduation: boolean | null;
  enrollmentRiskLevel: string | null;
  promotionStatusDescription: string | null;
  promotionStatusColor: string | null;
  isPromoted: boolean | null;
  requiresRetakes: boolean | null;
  needsRemedialAction: boolean | null;
  hasRetakeModules: boolean | null;
  hasFailedModules: boolean | null;
  promotionDecisionSummary: string | null;
  creditCompletionPercentage: number | null;
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  updatedBy: string | null;
  yearsInProgram: number | null;
  semestersCompleted: number | null;
  isOverdue: boolean | null;
  daysToGraduation: number | null;
  retakeAttemptCounts: any | null;
}

export interface StudentEnrollmentsResponse {
  success: boolean;
  message: string;
  data: StudentEnrollment[];
  timestamp: string;
}

export const transcriptsApi = {
  /**
   * Get academic groups by department and academic year
   * @param departmentId - The department ID
   * @param academicYearId - The academic year ID
   * @returns Promise<AcademicGroupsResponse>
   */
  getAcademicGroups: async (departmentId: string, academicYearId: string): Promise<AcademicGroupsResponse> => {
    const response = await api.get<AcademicGroupsResponse>(
      `/academics/groups/department/${departmentId}?academicYearId=${academicYearId}`
    );
    return response.data;
  },

  /**
   * Get student enrollments for a specific group and semester
   * @param groupId - The group ID
   * @param semesterId - The semester ID
   * @returns Promise<StudentEnrollmentsResponse>
   */
  getStudentEnrollmentsByGroup: async (groupId: string, semesterId: string): Promise<StudentEnrollmentsResponse> => {
    const response = await api.get<StudentEnrollmentsResponse>(
      `/academics/student-enrollments/group/${groupId}?semesterId=${semesterId}`
    );
    return response.data;
  },
};