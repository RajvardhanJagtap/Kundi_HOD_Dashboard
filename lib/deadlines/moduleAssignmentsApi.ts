import { api } from '@/lib/api';

export interface ModuleAssignment {
  id: string;
  moduleCode: string;
  moduleName: string;
  instructorName: string;
  instructorEmail: string;
  currentEnrollment: number;
  maxStudents: number;
  startDate: string;
  endDate: string;
  academicYearName: string;
  semesterName: string;
  departmentName: string;
  schoolName: string;
  collegeName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ModuleAssignmentsResponse {
  content: ModuleAssignment[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
}

export interface ModuleAssignmentsParams {
  page?: number;
  size?: number;
  moduleCode?: string;
  instructorName?: string;
  departmentName?: string;
  academicYear?: string;
  semester?: string;
}

export interface DeadlineSubmission {
  catDeadline: string;
  examDeadline: string;
  instructions?: string;
  catTitle?: string;
  examTitle?: string;
  catPriority?: 'NORMAL' | 'HIGH' | 'LOW';
  examPriority?: 'NORMAL' | 'HIGH' | 'LOW';
  catGracePeriodHours?: number;
  examGracePeriodHours?: number;
  catNotes?: string;
  examNotes?: string;
}

// Simplified request interface - only required fields
export interface CreateSubmissionsRequest {
  catDeadline: string;
  examDeadline: string;
  instructions?: string;
  catTitle?: string;
  examTitle?: string;
  catPriority?: 'NORMAL' | 'HIGH' | 'LOW';
  examPriority?: 'NORMAL' | 'HIGH' | 'LOW';
  catGracePeriodHours?: number;
  examGracePeriodHours?: number;
  catNotes?: string;
  examNotes?: string;
}

export interface CreateSubmissionsResponse {
  success: boolean;
  message: string;
  data?: {
    CAT?: DetailedSubmission;
    EXAM?: DetailedSubmission;
  };
  timestamp?: string;
}

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

// Extended submission details from the create submissions API response
export interface DetailedSubmission {
  id: string;
  submissionTitle: string;
  submissionDescription: string;
  submissionType: 'CAT' | 'EXAM';
  submissionTypeDisplayName: string;
  moduleAssignmentId: string;
  moduleCode: string;
  moduleName: string;
  semesterCode: string;
  semesterName: string;
  academicYear: string | null;
  lecturerName: string;
  groupName: string;
  departmentName: string | null;
  schoolName: string | null;
  processingStatus: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'OVERDUE';
  processingStatusDisplayName: string;
  processingStatusColor: string;
  currentProcessingLevel: string;
  currentProcessingOfficerId: string | null;
  currentProcessingOfficerName: string | null;
  submissionDeadline: string;
  submittedAt: string | null;
  lastProcessedAt: string;
  completedAt: string | null;
  isOverdue: boolean;
  isCompleted: boolean;
  daysUntilDeadline: number;
  daysSinceSubmission: number | null;
  submissionStatistics: {
    totalStudents: number;
    studentsWithCompleteMarks: number;
    studentsWithIncompleteMarks: number;
    absentStudents: number;
    completionPercentage: number;
    averageMarks: number;
    passRate: number;
    gradeDistribution: Record<string, any>;
  };
  workflowSteps: Array<{
    stepName: string;
    processingLevel: string;
    officerId: string | null;
    officerName: string | null;
    status: 'PENDING' | 'COMPLETED' | 'REJECTED';
    completedAt: string | null;
    comments: string | null;
    isRequired: boolean;
    stepOrder: number;
    processingTimeHours: number | null;
  }>;
  currentWorkflowStep: number;
  totalWorkflowSteps: number;
  workflowCompletionPercentage: number;
  validationInfo: {
    isValid: boolean;
    isComplete: boolean;
    validationErrors: string[];
    validationWarnings: string[];
    missingData: string[];
    consistencyScore: number;
    lastValidatedAt: string;
    validatedBy: string | null;
  };
  markSheetInfo: {
    markSheetGenerated: boolean;
    markSheetGeneratedAt: string | null;
    markSheetFormat: string;
    markSheetSize: number | null;
    markSheetLocation: string | null;
    isPublished: boolean;
    publishedAt: string | null;
    publishedBy: string | null;
  };
  approvals: any[];
  requiresApproval: boolean;
  isFullyApproved: boolean;
  finalApproverId: string | null;
  finalApproverName: string | null;
  finalApprovalDate: string | null;
  submittedByUserId: string | null;
  submittedByName: string | null;
  submittedByRole: string;
  totalProcessingActions: number;
  approvalCount: number;
  rejectionCount: number;
  escalationCount: number;
  notificationsEnabled: boolean;
  notificationsSent: number;
  lastNotificationSent: string | null;
  submissionCode: string;
  referenceNumber: string;
  metadata: {
    submissionType: 'CAT' | 'EXAM';
    priorityLevel: string;
    isLocked: boolean;
    gracePeriodHours: number;
  };
  performanceMetrics: {
    totalProcessingTime: number;
    averageStepProcessingTime: number;
    processingEfficiency: number;
    meetsSLA: boolean;
    performanceRating: string;
    qualityScore: number;
    firstTimeRight: boolean;
    revisionCount: number;
  };
  relatedSubmissionIds: string[];
  parentSubmissionId: string | null;
  childSubmissionIds: string[];
  createdAt: string;
  updatedAt: string;
  createdBy: string | null;
  lastModifiedBy: string | null;
  approved: boolean;
  pending: boolean;
  rejected: boolean;
  urgencyLevel: string;
  urgencyColor: string;
  overallProgress: number;
  readyForNextStep: boolean;
  submissionAge: string;
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

export const moduleAssignmentsApi = {
  getModuleAssignments: async (params: ModuleAssignmentsParams = {}): Promise<ModuleAssignmentsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (params.page !== undefined) queryParams.append('page', params.page.toString());
    if (params.size !== undefined) queryParams.append('size', params.size.toString());
    if (params.moduleCode) queryParams.append('moduleCode', params.moduleCode);
    if (params.instructorName) queryParams.append('instructorName', params.instructorName);
    if (params.departmentName) queryParams.append('departmentName', params.departmentName);
    if (params.academicYear) queryParams.append('academicYear', params.academicYear);
    if (params.semester) queryParams.append('semester', params.semester);

    const response = await api.get(`/academics/module-assignments?${queryParams.toString()}`);
    return response.data.data;
  },

  getModuleSubmissionDetails: async (moduleId: string): Promise<ModuleSubmissionDetailsResponse> => {
    console.log('API: Fetching submission details for module:', moduleId);
    try {
      const response = await api.get(`/grading/marks-submission/module/${moduleId}/submission-details`);
      console.log('API: Submission details response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching submission details:', error);
      throw error;
    }
  },

  // Fixed function using the correct endpoint
  setModuleDeadlines: async (
    moduleId: string, 
    deadlines: { catDeadline: string; examDeadline: string }
  ): Promise<CreateSubmissionsResponse> => {
    console.log('=== API Call Debug Info ===');
    console.log('Module ID:', moduleId);
    console.log('Input deadlines:', deadlines);
    
    if (!moduleId || !moduleId.trim()) {
      throw new Error('Module ID is required and cannot be empty');
    }

    if (!deadlines.catDeadline || !deadlines.examDeadline) {
      throw new Error('Both CAT and EXAM deadlines are required');
    }

    // Validate dates
    const catDate = new Date(deadlines.catDeadline);
    const examDate = new Date(deadlines.examDeadline);
    
    if (isNaN(catDate.getTime()) || isNaN(examDate.getTime())) {
      throw new Error('Invalid date format provided');
    }

    // Use the correct endpoint URL
    const url = `/grading/marks-submission/module/${encodeURIComponent(moduleId)}/create-submissions`;
    console.log('API URL:', url);

    // Create the complete request body matching the expected format
    const requestBody: CreateSubmissionsRequest = {
      catDeadline: catDate.toISOString(),
      examDeadline: examDate.toISOString(),
      instructions: "Please ensure all marks are submitted accurately and on time",
      catTitle: "Continuous Assessment Test",
      examTitle: "Final Examination",
      catPriority: "NORMAL",
      examPriority: "HIGH",
      catGracePeriodHours: 24,
      examGracePeriodHours: 48,
      catNotes: "CAT submission",
      examNotes: "Exam submission"
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    try {
      // The API uses POST for both create and update operations
      console.log('Making POST request to create/update submissions');
      const response = await api.post(url, requestBody);
      console.log('POST Success:', response.status);
      console.log('Response data:', response.data);
      return response.data;
      
    } catch (error: any) {
      console.error('=== API Request Failed ===');
      console.error('Error status:', error?.response?.status);
      console.error('Error data:', error?.response?.data);
      console.error('Error message:', error?.message);
      console.error('Request config:', {
        url: error?.config?.url,
        method: error?.config?.method,
        baseURL: error?.config?.baseURL
      });

      // Handle different types of errors
      if (error?.response?.status === 500) {
        throw new Error('Server error occurred. Please check server logs and contact support if the issue persists.');
      }
      
      if (error?.response?.status === 404) {
        throw new Error(`API endpoint not found. Please verify the module ID "${moduleId}" exists.`);
      }
      
      if (error?.response?.status === 400) {
        const errorMsg = error?.response?.data?.message || 'Invalid request data';
        throw new Error(`Bad request: ${errorMsg}`);
      }
      
      if (error?.response?.status === 403) {
        throw new Error('Insufficient permissions to set deadlines for this module.');
      }
      
      if (error?.response?.status === 409) {
        throw new Error('Conflict: Deadlines may already exist or there is a data conflict.');
      }
      
      // For network errors or other issues
      if (!error?.response) {
        throw new Error('Network error: Unable to connect to the server. Please check your internet connection.');
      }
      
      throw new Error(error?.response?.data?.message || error?.message || 'Unknown error occurred while setting deadlines');
    }
  },

  // Legacy functions for compatibility - now redirect to the corrected function
  createModuleSubmissions: async (
    moduleId: string, 
    deadlines: { catDeadline: string; examDeadline: string }, 
    isUpdate = false
  ): Promise<CreateSubmissionsResponse> => {
    console.log('Using legacy createModuleSubmissions, redirecting to setModuleDeadlines');
    return moduleAssignmentsApi.setModuleDeadlines(moduleId, deadlines);
  },

  updateModuleDeadline: async (moduleId: string, deadline: string): Promise<void> => {
    await api.put(`/academics/module-assignments/${moduleId}/deadline`, {
      deadline
    });
  },

  bulkUpdateDeadlines: async (updates: Array<{ moduleId: string; deadline: string }>): Promise<void> => {
    await api.put('/academics/module-assignments/bulk-deadline-update', {
      updates
    });
  }
};