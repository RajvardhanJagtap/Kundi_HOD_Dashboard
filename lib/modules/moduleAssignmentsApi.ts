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
  // Get all module assignments with optional filters and pagination
  getModuleAssignments: async (params?: ModuleAssignmentsParams): Promise<ModuleAssignmentsResponse> => {
    const response = await api.get('/academics/module-assignments', { params });
    return response.data;
  },

  // Get a specific module assignment by ID
  getModuleAssignmentById: async (id: string): Promise<{ success: boolean; data: ModuleAssignment; message: string }> => {
    const response = await api.get(`/academics/module-assignments/${id}`);
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
      // First, try to get all module assignments
      const assignmentsResponse = await moduleAssignmentsApi.getModuleAssignments(params);
      const assignments = assignmentsResponse.data.content;
      
      // Then get submission details for each assignment
      const submissionDetailsPromises = assignments.map(async (assignment) => {
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