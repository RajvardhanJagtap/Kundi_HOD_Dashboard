import { api } from '@/lib/api';

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

// New interfaces for department group readiness
export interface ModuleDetail {
  moduleAssignmentId: string;
  moduleCode: string;
  moduleName: string;
  moduleCredits: number;
  lecturerName: string;
  semesterId: string;
  catStatus: string;
  examStatus: string;
  overallStatus: string;
  isComplete: boolean;
  catSubmittedDate: string | null;
  examSubmittedDate: string | null;
  overallSubmittedDate: string | null;
  catApprovedDate: string | null;
  examApprovedDate: string | null;
  overallApprovedDate: string | null;
  completionSummary: string;
}

export interface GroupReadiness {
  groupId: string;
  groupName: string;
  groupCode: string;
  programName: string;
  programCode: string;
  yearLevel: number;
  semesterId: string;
  semesterName: string;
  academicYear: string;
  readinessStatus: string;
  progressPercentage: number;
  totalModules: number;
  completedModules: number;
  canBeSubmittedToDean: boolean;
  isSubmittedToDean: boolean;
  submissionStatus: string | null;
  submissionDate: string | null;
  moduleDetails: ModuleDetail[];
  message: string | null;
  lastUpdated: string;
  progressDisplay: string;
  displayStatus: string;
  statusBadgeColor: string;
}

export interface DepartmentGroupReadinessResponse {
  success: boolean;
  message: string;
  data: {
    groups: GroupReadiness[];
    totalGroups: number;
    readyGroups: number;
    partiallyReadyGroups: number;
    notReadyGroups: number;
    overallReadinessPercentage: number;
    generatedAt: string;
    summary: string;
  };
  timestamp: string;
}

export interface ModuleAssignmentsResponse {
  success: boolean;
  message: string;
  data: {
    content: ModuleAssignment[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    first: boolean;
    last: boolean;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  timestamp: string;
}

export interface ModuleAssignmentsParams {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  academicYearId?: string;
  semesterId?: string;
  departmentName?: string;
  instructorId?: string;
}

// Submission details interfaces
export interface SubmissionDetails {
  completionPercentage: number;
  submissionId: string;
  isSubmitted: boolean;
  canApprove: boolean;
  statusDisplay: string;
  deadline: string;
  submittedAt?: string;
  isApproved: boolean;
  status: string;
}

export interface ModuleSubmissionDetails {
  lecturerId: string;
  groupName: string;
  moduleCode: string;
  lecturerName: string;
  catSubmission: SubmissionDetails;
  moduleName: string;
  semesterName: string;
  examSubmission: SubmissionDetails;
  overallSubmission: {
    submissionId: string;
    canApprove: boolean;
    statusDisplay: string;
    status: string;
  };
  moduleAssignmentId: string;
  groupCode: string;
}

export interface ModuleSubmissionDetailsResponse {
  success: boolean;
  message: string;
  data: ModuleSubmissionDetails;
  timestamp: string;
}

export interface ModuleSubmissionDetailsListResponse {
  success: boolean;
  message: string;
  data: ModuleSubmissionDetails[];
  timestamp: string;
}

// API functions
export const moduleAssignmentsApi = {
  // Get department group readiness (NEW - replaces getModuleAssignments for HOD view)
  getDepartmentGroupReadiness: async (semesterId: string): Promise<DepartmentGroupReadinessResponse> => {
    console.log('API: getDepartmentGroupReadiness called with params:', { semesterId });
    const response = await api.get(`/grading/group-readiness/my-department`, { 
      params: { semesterId } 
    });
    return response.data;
  },

  // Get all module assignments with optional filters and pagination (kept for backward compatibility)
  getModuleAssignments: async (params?: ModuleAssignmentsParams): Promise<ModuleAssignmentsResponse> => {
    const response = await api.get('/academics/module-assignments', { params });
    return response.data;
  },

  // Get a specific module assignment by ID
  getModuleAssignmentById: async (id: string): Promise<{ success: boolean; data: ModuleAssignment; message: string }> => {
    const response = await api.get(`/academics/module-assignments/${id}`);
    console.log('API: getModuleAssignmentById response:', response.data);
    return response.data;
  },

  // Get module assignments by instructor ID
  getModuleAssignmentsByInstructor: async (instructorId: string, params?: ModuleAssignmentsParams): Promise<ModuleAssignmentsResponse> => {
    const response = await api.get(`/academics/module-assignments/instructor/${instructorId}`, { params });
    return response.data;
  },

  // Get module assignments by academic year
  getModuleAssignmentsByAcademicYear: async (academicYearId: string, params?: ModuleAssignmentsParams): Promise<ModuleAssignmentsResponse> => {
    const response = await api.get(`/academics/module-assignments/academic-year/${academicYearId}`, { params });
    return response.data;
  },

  // Get module assignments by semester
  getModuleAssignmentsBySemester: async (semesterId: string, params?: ModuleAssignmentsParams): Promise<ModuleAssignmentsResponse> => {
    const response = await api.get(`/academics/module-assignments/semester/${semesterId}`, { params });
    return response.data;
  },

  // Get submission details for a specific module
  getModuleSubmissionDetails: async (moduleId: string): Promise<ModuleSubmissionDetailsResponse> => {
    const response = await api.get(`/grading/marks-submission/module/${moduleId}/submission-details`);
    return response.data;
  },

  // Get submission details for all modules (for HOD view)
  // Since the bulk endpoint might not exist, we'll fetch module assignments first
  // and then get submission details for each module that has submissions
  getAllModuleSubmissionDetails: async (params?: ModuleAssignmentsParams): Promise<ModuleSubmissionDetailsListResponse> => {
    try {
      let allAssignments: ModuleAssignment[] = [];
      let page = 0;
      let hasMore = true;
      
      // Fetch all pages of module assignments
      while (hasMore) {
        const assignmentsResponse = await moduleAssignmentsApi.getModuleAssignments({
          ...params,
          page,
          size: 100, // Request 100 items per page to minimize API calls
        });
        
        allAssignments = [...allAssignments, ...assignmentsResponse.data.content];
        
        // Check if there are more pages
        hasMore = assignmentsResponse.data.hasNext;
        page++;
      }
      
      // Then get submission details for each assignment
      const submissionDetailsPromises = allAssignments.map(async (assignment) => {
        try {
          const submissionResponse = await moduleAssignmentsApi.getModuleSubmissionDetails(assignment.id);
          return submissionResponse.data;
        } catch (error) {
          // If submission details don't exist for this module, skip it
          console.warn(`No submission details found for module ${assignment.id}`);
          return null;
        }
      });
      
      const submissionDetails = (await Promise.all(submissionDetailsPromises)).filter(
        (detail): detail is ModuleSubmissionDetails => detail !== null
      );
      
      return {
        success: true,
        message: 'Submission details retrieved successfully',
        data: submissionDetails,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching submission details:', error);
      throw error;
    }
  },
};